import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

import sendVerificationEmail from "@/clients/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, email, password, message } = await request.json();
        const verifiedUser = await UserModel.findOne(
            {
                username,
                isVerified: true
            })
        if (verifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Your are verified user, please log in"
                },
                {
                    status: 400
                }
            )
        }
        else {

            const notVerifiedExistingUser = await UserModel.findOne(
                { 
                    email,
                    isVerified:false
                }
            )
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

            if (notVerifiedExistingUser) {
                const hassedPassword = await bcrypt.hash(password, 10);
                notVerifiedExistingUser.username = username;
                notVerifiedExistingUser.email = email;
                notVerifiedExistingUser.password = hassedPassword;
                notVerifiedExistingUser.verifyCode = verifyCode;
                notVerifiedExistingUser.verifyCodeExpiry = verifyCodeExpiry;
                await notVerifiedExistingUser.save()
            }
            else {
                const hassedPassword = await bcrypt.hash(password, 10);
                const newUser = new UserModel({
                    username: username,
                    email: email,
                    password: hassedPassword,
                    verifyCode:verifyCode,
                    verifyCodeExpiry:verifyCodeExpiry,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: [{
                        content: message,
                    }]
                })
                await newUser.save()
            }
                const emailResponse = await sendVerificationEmail(
                    username,
                    email,
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
                
                return Response.json(
                    {
                        success: true,
                        message: "user created successfully,verification email sent"
                    },
                    {
                        status: 201
                    }
                )
        }
    } catch (error) {
        console.log("Error registering user", error)
        return new Response(
            JSON.stringify({
                success: false,
                message: "error registering user"
            }),
            {
                status: 500
            }
        )
    }
} 