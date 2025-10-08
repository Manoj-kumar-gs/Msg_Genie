import sendVerificationEmail from "@/clients/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function POST(req: Request) {
    try {
        const { identifier } = await req.json();

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

        await dbConnect();
        const user = await UserModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
            ]
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 400
            })
        }

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;
        await user.save();
        const emailResponse = await sendVerificationEmail(
            user.username,
            user.email,
            verifyCode,
        )

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "email not sent"
                },
                {
                    status: 500
                }
            )
        }

        return Response.json({
            success: true,
            message: "Verification code sent successfully"
        }, {
            status: 200
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "error to send reset password email"
        }, {
            status: 500
        })
        console.error("Error sending verification email:", error);
    }
}