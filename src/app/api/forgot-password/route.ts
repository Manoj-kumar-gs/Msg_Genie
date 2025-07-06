import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { redirect } from "next/navigation";
import { json } from "stream/consumers";
import { success } from "zod/v4";

export async function POST(req: Request) {
    try {
        const username = await req.json();

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verifyCodeExpiry = new Date();

        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)
                // const emailResponse = await sendVerificationEmail(
                //     username,
                //     email,
                //     verifyCode,
                // )

                // if (!emailResponse.success) {
                //     return Response.json(
                //         {
                //             success: false,
                //             message: "email not sent"
                //         },
                //         {
                //             status: 500
                //         }
                //     )
                // }

        await dbConnect();
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success:false,
                message:"user not found"
            },{
                status:400
            })
        }

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;
        await user.save();
        
        redirect(`verify-user/${username}`)

    } catch (error) {
        return Response.json({
            success:false,
            message:"Failed to reset password"
        },{
            status:500
        })
    }
}