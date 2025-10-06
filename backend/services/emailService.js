// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOtpEmail = async (to, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: to,
//     subject: 'Your Login OTP for StrangerHub',
//     text: `Your One-Time Password is: ${otp}`,
//   };
//   await transporter.sendMail(mailOptions);
// };

// backend/services/emailService.js

import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to, otp) => {
    try {
        await resend.emails.send({
            // Resend's test address works out-of-the-box, avoiding verification issues.
            from: 'IPU Friendlist <onboarding@resend.dev>',
            to: to,
            subject: 'Your Login OTP for IPU Friendlist',
            html: `<p>Your One-Time Password is: <strong>${otp}</strong></p>`,
        });
        console.log("OTP email sent successfully via Resend to", to);
    } catch (error) {
        console.error("Error sending OTP email via Resend:", error);
        // Re-throw the error so the calling function knows it failed
        throw error;
    }
};