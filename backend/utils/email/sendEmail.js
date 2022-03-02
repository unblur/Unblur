const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8')
    const compiledTemplate = handlebars.compile(source)
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        replyTo: process.env.FROM_EMAIL,
        subject: subject,
        html: compiledTemplate(payload),
      }
    }

    // Send email
    await transporter.sendMail(options())

    return {}
  } catch (error) {
    return { error }
  }
}

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail
