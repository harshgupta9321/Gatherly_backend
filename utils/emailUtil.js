import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter at startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter error:', error);
    } else {
        console.log('Mailer is ready to send emails!');
    }
});

export const sendTemplatedEmail = async (to, subject, templateName, data) => {
    try {
        const templatePath = path.join(__dirname, `../views/emails/${templateName}.ejs`);
        console.log('Template path:', templatePath);

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at: ${templatePath}`);
        }

        // Render the EJS template
        const html = await ejs.renderFile(templatePath, data);

        // Send the email
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
