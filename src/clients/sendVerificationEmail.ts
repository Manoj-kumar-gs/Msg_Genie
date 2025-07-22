import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '@/emailTemplates/verificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export default async function sendVerificationEmail(
  username: string,
  email: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 2. Render your React email to HTML
    const htmlContent = await render(
      VerificationEmail({ username, otp: verificationCode })
    );

    // 3. Send the email
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your MsgGenie Verification Code',
      html: htmlContent,
    });

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
}
