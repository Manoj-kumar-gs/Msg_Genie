import VerificationEmail from "../../emailTemplates/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";

export default async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<ApiResponse> { //defines return type

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Message With AI | Verification code',
            react: VerificationEmail({username, otp:verificationCode}),
        });
        return { success: true, message: "Verification email send successfully" }
    } catch (emailError) {
        console.log("error in verifying your email", emailError)
        return { success: false, message: "error" }
    }
} 