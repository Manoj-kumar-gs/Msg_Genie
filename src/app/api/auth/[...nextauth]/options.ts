import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

// Explicitly define credentials type for CredentialsProvider
type Credentials = {
  identifier: string;
  password: string;
};

type DBUser = {
  _id: string | { toString(): string };
  username: string;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: unknown) {
        // Safely cast and destructure credentials
        const { identifier, password } = credentials as Credentials;

        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { username: identifier },
            { email: identifier },
          ],
        });

        if (!user) throw new Error("User not found");
        if (!user.isVerified) throw new Error("Please verify your account before login");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Incorrect password");

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // On initial login
      if (user && account) {
        await dbConnect();

        if (account.provider === "google" || account.provider === "github") {
          const existingUser = await UserModel.findOne({ email: user.email });

          if (existingUser) {
            token._id = existingUser._id?.toString();
            token.username = existingUser.username;
            token.isVerified = existingUser.isVerified;
            token.isAcceptingMessages = existingUser.isAcceptingMessages;
          } else {
            const generatedUsername =
              user.name?.toLowerCase().replace(/\s+/g, "") ??
              user.email?.split("@")[0];

            const newUser = await UserModel.create({
              username: generatedUsername,
              email: user.email,
              password: null,
              isVerified: true,
              isAcceptingMessages: true,
              messages: [],
            });

            token._id = newUser._id?.toString();
            token.username = newUser.username;
            token.isVerified = true;
            token.isAcceptingMessages = true;
          }
        } else {
          // Credentials login
          const u = user as DBUser;
          token._id = typeof u._id === "string" ? u._id : u._id.toString();
          token.username = u.username === "string" ? u.username : u.username.toString();
          token.isVerified = u.isVerified as boolean;
          token.isAcceptingMessages = u.isAcceptingMessages as boolean;

        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id as string,
          username: token.username as string,
          email: token.email as string,
          isVerified: token.isVerified as boolean,
          isAcceptingMessages: token.isAcceptingMessages as boolean,
        };
      }
      return session;
    }

  },

  pages: {
    signIn: "/dashboard",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
