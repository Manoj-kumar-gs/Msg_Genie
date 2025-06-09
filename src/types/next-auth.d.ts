import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        _id: string;
        username: string;
        email: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
    interface Session {
        _id: string;
        username: string;
        email: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
}