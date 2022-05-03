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
  const ARTWORKS_PER_REQUEST = 12 // We have 4 responisve sizes are 12 works perfectly for all sizes
  const page = Math.max(req.query.page || 1, 1)
  const artworks = await Artwork.find()
    .populate('transactionIDs')
    .populate('creatorID', ['username', 'wallet'])
    .select('-image')
    .skip((page - 1) * ARTWORKS_PER_REQUEST)
    .limit(ARTWORKS_PER_REQUEST)
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

// @desc    Get an artwork
// @route   GET /api/artworks/:id
// @access  Public
const getArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id)
    .populate('transactionIDs')
    .populate('creatorID', ['username', 'wallet'])
    .select('-image')

  if (!artwork) {
    res.status(500)
    throw new Error('Server error')
  }

  res.status(200).json(artwork)
})

// @desc    Upload an artwork
// @route   POST /api/artworks/upload
// @access  Private
const uploadArtwork = asyncHandler(async (req, res) => {
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
    throw new Error(
      'Add PYTHON_VERSION=python or PYTHON_VERSION=python3 in your .env'
    )
  })

  const artwork = await Artwork.create({
    creatorID: req.user.id,
    image: req.file.filename,
    blurredImage: `${fileName}-blurred.${fileExtension}`,
    algosToUnblur: req.body.algosToUnblur,
    title: req.body.title,
    description: req.body.description,
  })
  if (!artwork) {
    res.status(400)
    throw new Error('Invalid artwork data.')
  }

  // Add artwork ID to user
  // https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
  // May run into some concurrent issues with .save()
  req.user.artworkIDs.push(artwork.id)
  await req.user.save()

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
      `${process.env.PYTHON_VERSION} ./tiler/tiler.py ${imageOutPath} ./tiler/tiles/circles/gen_circle_100 ${tilerRatio} ${imageOutPath}`,
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
  getArtwork,
  uploadArtwork,
  blurImage,
}
