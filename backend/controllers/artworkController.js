const asyncHandler = require('express-async-handler')
const Artwork = require('../models/artworkModel')
const { exec } = require('child_process')
const path = require('path')
const multer = require('multer')
const Jimp = require('jimp')

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // TODO: check file extension to make sure it's an image
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
}).single('image')

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
const getArtworks = asyncHandler(async (req, res) => {
  const artworks = await Artwork.find().select('-image')
  if (!artworks) {
    res.status(500)
    throw new Error('Server error')
  }

  res.status(200).json(artworks)
})

const uploadWrapper = asyncHandler(async (req, res, next) => {
  upload(
    req,
    res,
    asyncHandler(async (err) => {
      if (err) {
        next(new Error('Something went wrong uploading image.'))
      }

      next()
    })
  )
})

// @desc    Upload an artwork
// @route   POST /api/artworks/upload
// @access  Private
const uploadArtwork = asyncHandler(async (req, res) => {
  // TODO: figure out why throwing error here causes UnhandledPromiseRejectionWarning:
  if (!req.body.algosToUnblur) {
    throw new Error('Please enter algos to unblur.')
  }

  const fileName = req.file.filename.split('.')[0]
  const fileExtension = req.file.filename.split('.')[1]
  const blurredImagePath = `./uploads/${fileName}-blurred.${fileExtension}`

  await blurImage(
    `./uploads/${req.file.filename}`,
    blurredImagePath,
    100
  ).catch((e) => {
    res.status(500)
    throw new Error('Error blurring. Please retry.')
  })

  const artwork = await Artwork.create({
    creatorID: req.user.id,
    image: req.file.filename,
    blurredImage: `${fileName}-blurred.${fileExtension}`,
    algosToUnblur: req.body.algosToUnblur,
  })
  if (!artwork) {
    res.status(400)
    throw new Error('Invalid artwork data.')
  }

  res.json({
    message: 'Successfully uploaded image.',
  })
})

const blurImage = async (imagePath, imageOutPath, percentBlur) => {
  const imageWidthAlgo = (blur) => 300 - 2.5 * blur

  return new Promise(async (resolve, reject) => {
    const FRONT_END_IMAGE_MAX_HEIGHT_MAX_WIDTH = 300
    const image = await Jimp.read(imagePath)
    const { width, height } = image.bitmap
    const biggerDimension = Math.max(width, height)
    const ratio = FRONT_END_IMAGE_MAX_HEIGHT_MAX_WIDTH / biggerDimension
    await image.resize(width * ratio, height * ratio).write(imageOutPath)
    const tileWidth =
      FRONT_END_IMAGE_MAX_HEIGHT_MAX_WIDTH / imageWidthAlgo(percentBlur)
    const tilerRatio = tileWidth / 100

    console.log(`Tiler ratio: ${tilerRatio}`)

    exec(
      `python ./tiler/tiler.py ${imageOutPath} ./tiler/tiles/circles/gen_circle_100 ${tilerRatio} ${imageOutPath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject()
        } else {
          resolve()
        }
      }
    )
  })
}

module.exports = {
  uploadWrapper,
  getArtworks,
  uploadArtwork,
}
