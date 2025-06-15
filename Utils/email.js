const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    // Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIl_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const emailOptions = {
        from: "Cineflix<support@cineflix.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    return await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;