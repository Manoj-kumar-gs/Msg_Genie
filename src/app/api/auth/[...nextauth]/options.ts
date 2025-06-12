import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "enter username" },
                email: { label: "Email", type: "text", placeholder: "enter email" },
                password: { label: "Password", type: "password", placeholder: "enter password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { username: credentials.username },
                            { email: credentials.email },
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (user?.isVerified) {
                        throw new Error("Please verify your account before login")
                    }
                    const checkUserPassword = await bcrypt.compare(credentials.password, user?.password)
                    if (!checkUserPassword) {
                        throw new Error("incorrect password")
                    }
                    return user;
                } catch (error: any) {
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session._id = user._id;
                session.username = user.username;
                session.isVerified = user.isVerified;
                session.isAcceptingMessage = user.isAcceptingMessage;
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token
        }
    },
    // pages: {
    //     signIn: "/sign-in"
    // },
    session: {
        strategy: "jwt"
    }
}