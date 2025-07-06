import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, verificationCode } = await req.json();
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        if(user.verifyCodeExpiry < new Date()) {
            return Response.json({
                success: false,
                message: "Verification code expired"
            }, {
                status: 400
            });
        }
        if(verificationCode !== user.verifyCode) {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, {
                status: 400
            });
        }

       redirect(`/reset-password/${username}`);

    } catch (error) {
        console.log("Error checking user validity", error);
        return Response.json({
            success: false,
            message: "Error checking user validity"
        }, {
            status: 500
        });
    }
}