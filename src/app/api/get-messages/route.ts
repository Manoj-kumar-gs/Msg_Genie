import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod/v4";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions)
    if (!session) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            {
                status: 401
            })
    }
    const userId = new mongoose.Types.ObjectId(session._id as string)
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if(!user){
        return Response.json({
            success: false,
            message: "user not found"
        }, {
            status: 401
        })
        }
        
        return Response.json({
            success: false,
            messages: user[0].messages
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get messages"
        }, {
            status: 500
        })
    }

}