// import NextAuth from "next-auth"
import "next-auth";

// Add custom fields to your user object for both Session and User
declare module "next-auth" {
  interface Session {
    user?: {
      _id: string;
      username: string;
      email: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    _id: string;
    username: string;
    email: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
}

// For JWT
import "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    email: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
}
