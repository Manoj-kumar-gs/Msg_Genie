import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

const userCodeVerifySchema = z.object({
    username: usernameValidation,
    verifyCode: verifySchema
}) 
 
export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json()
        const result = userCodeVerifySchema.safeParse(body)
        if (!result.success) {
            console.error(result.error.flatten());
            return Response.json(
                {
                    success: false,
                    message: "Invalid format of data",
                    errors: result.error.format().verifyCode?._errors,
                },
                { status: 400 }
            );
        }

        const { username, verifyCode } = result.data;

        const user = await UserModel.findOne({ username: username })
        if (!user) {
            console.error("user not found")
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 400 })
        }

        if (user.isVerified) {
            return Response.json({
                success: false,
                message: "Your already verified"
            },
                { status: 400 })
        }

        const codeVarified = user.verifyCode === verifyCode.code
        if (!codeVarified) {
            return Response.json({
                success: false,
                message: "Varification code is incorrect"
            },
                { status: 400 })
        }

        const verifyCodeExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (!verifyCodeExpired) {
            return Response.json({
                success: false,
                message: "Varification code is Expired"
            },
                { status: 400 })
        }
 
        user.isVerified = true;
        await user.save()
        return Response.json({
            success: true,
            message: "User verified successfully"
        },
            { status: 200 })

    } catch (error) {
        console.error("error in verifying user using verify code : ", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            { status: 400 })
    }
}