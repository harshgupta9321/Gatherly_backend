import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendTemplatedEmail = async (to, subject, templateName, data) => {
    try {
        const templatePath = path.join(__dirname, `../views/emails/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, data);

        const info = await transporter.sendMail({
            from: `"Event Management" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Email sending error:', error);
    }
};
