require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: process.env.USER, 
          pass: process.env.PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.USER, 
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ message: 'Email sent', info });
    } catch (error) {
        console.log('Error occurred during email sending:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
