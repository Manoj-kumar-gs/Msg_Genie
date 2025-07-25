import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    suggester: string;
    content: string;
    createdAt: Date;
}

const messageSchema = new Schema<Message>({
    suggester:{
        type: String,
        required: true,
        default:"Well-Wisher"
    },
    content: {
        type: String, 
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
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
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [messageSchema]
})

const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;   