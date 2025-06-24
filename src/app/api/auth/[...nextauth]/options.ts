import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Username/Email", type: "text", placeholder: "Enter Username/Email" },
                password: { label: "Password", type: "password", placeholder: "Enter Password" }
            },
            async authorize(credentials: any): Promise<any> {
              console.log(credentials)
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { username: credentials.identifier },
                            { email: credentials.identifier },
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (!user?.isVerified) {
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
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session._id = token._id?.toString();
                session.username = token.username;
                session.isVerified = token.isVerified;
                session.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
    },
    pages: {
        signIn: "/dashboard"
    },
    session: {
        strategy: "jwt"
    }
}