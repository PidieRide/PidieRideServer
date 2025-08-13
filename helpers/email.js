// helpers/email.js
const nodemailer = require("nodemailer");

// transporter default (pakai akun developer)
const transporter = nodemailer.createTransport({
    service: "gmail", // bisa diganti ke SMTP lain
    auth: {
        user: "developer.email@gmail.com", // ganti dengan email developer
        pass: "password_email_atau_app_password" // pakai app password untuk Gmail
    }
});

/**
 * Kirim email
 * @param {string} to - Alamat email penerima
 * @param {string} subject - Judul email
 * @param {string} htmlContent - Isi email dalam format HTML
 */
const sendEmail = async (to, subject, htmlContent) => {
    try {
        let info = await transporter.sendMail({
            from: `"Developer App" <developer.email@gmail.com>`, // sender
            to: to, // receiver
            subject: subject,
            html: htmlContent // body email
        });

        console.log("✅ Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};

module.exports = { sendEmail };
