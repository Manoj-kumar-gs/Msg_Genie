import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

import sendVerificationEmail from "@/clients/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, email, password } = await request.json();
        const verifiedUser = await UserModel.findOne({ username })
        if (verifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "username already taken"
                },
                {
                    status: 400
                }
            )
            }
            const existingUserByEmail = await UserModel.findOne({email})
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)
            
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

            if(existingUserByEmail){
                
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "user already exists with this email"
                    },
                    {
                        status: 400
                    }
                )
            }else {
                const hassedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.username = username;
                existingUserByEmail.email = email;
                existingUserByEmail.password = hassedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
                await existingUserByEmail.save()
                 return Response.json(
                    {
                        success: true,
                        message: "verification email sent"
                    },
                    {
                        status: 201
                    }
                )
            }
            }
                const hassedPassword = await bcrypt.hash(password, 10);
                const newUser = new UserModel({
                    username: username,
                    email: email,
                    password: hassedPassword,
                    verifyCode:verifyCode,
                    verifyCodeExpiry:verifyCodeExpiry,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                })
                await newUser.save()
                
                return Response.json(
                    {
                        success: true,
                        message: "user created successfully,verification email sent"
                    },
                    {
                        status: 201
                    }
                )
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