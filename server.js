require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI,
     { 
        // useNewUrlParser: true, useUnifiedTopology: true 
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error: ", err));


const emailSchema = new mongoose.Schema({
    from: String,
    to: String,
    subject: String,
    text: String,
    html: String,
    sentAt: { type: Date, default: Date.now }
});

const Email = mongoose.model("Email", emailSchema);

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { from, pass, to, subject, text, html } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: from, 
          pass: pass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);

       
        const emailLog = new Email({
            from,
            to,
            subject,
            text,
            html
        });
        await emailLog.save();

        res.status(200).json({ message: 'Email sent', info });
    } catch (error) {
        console.log('Error occurred during email sending:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
