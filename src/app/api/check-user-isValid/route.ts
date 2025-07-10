import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier, verificationCode } = await req.json();
        console.log("valid Identifier received:", identifier, verificationCode);
          const user = await UserModel.findOne({
                        $or: [
                            { username: identifier },
                            { email: identifier },
                        ]
                    })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400
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

       return Response.json({
            success: true,
            message: "User verified successfully"
        });

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