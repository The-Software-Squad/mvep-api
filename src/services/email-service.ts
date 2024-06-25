import nodemailer from "nodemailer";
import logger from "../utils/logger";


/**
 * This Function Allows Application to send mail to targetted person
 * 
 * @param {string} receiverEmail Reciver Email in String Format 
 * @param {string} resetLink    Reset Password Link
 */

export async function sendForgotPasswordMail(receiverEmail: string, resetLink: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
          user: process.env.MAIL_SERVICE_USER_MAIL,
          pass: process.env.MAIL_SERVICE_USER_PASSWORD
        }
      });
    
    const info = await transporter.sendMail({
        from: "eswardev69420@gmail.com",
        to: receiverEmail,
        subject: "Endless Store Password Reset",
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #4A5568;">
                <div style="max-width: 32rem; margin: 0 auto; padding: 1.25rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">
                    <h2 style="color: #3B82F6; text-align: center; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Endless Store account. If you did not make this request, please ignore this email.</p>
                    <p>To reset your password, please click the button below:</p>
                    <div style="text-align: center; margin: 1rem 0;">
                        <a href="${resetLink}" style="background-color: #3B82F6; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; text-decoration: none; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If the button above doesn't work, you can also reset your password by clicking the link below:</p>
                    <p><a href="${resetLink}" style="color: #3B82F6; text-decoration: underline;">${resetLink}</a></p>
                    <p>Thank you,<br>The Endless Store Team</p>
                    <p style="font-size: 0.75rem; color: #A0AEC0; margin-top: 1rem;">If you did not request a password reset, please contact our support team immediately.</p>
                </div>
            </div>
        `
    });
    logger.info(info.response);
    return;
}