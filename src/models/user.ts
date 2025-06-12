import mongoose, { Document, Schema } from "mongoose";
import { string } from "zod/v4";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: []
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, "username is requred"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is requred"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please enter a valid email"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyCode: {
        type: String,
        required: true, 
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);
// const UserModel = models.User || model<User>("User", UserSchema);

export default UserModel;   