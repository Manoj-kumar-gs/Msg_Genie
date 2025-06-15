import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod/v4";


export async function POST(request: Request) {
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
    const userId = session._id
    try {
        const { acceptMessages } = await request.json();
        const user = await UserModel.findOneAndUpdate(
            { _id: userId },
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if(!user){
             return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            {
                status: 401
            })
        }
         return Response.json({
            success: true,
            message: "Updated accept messages status successfully"
        },
            {
                status: 201
            })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update accept messages status"
        },
            {
                status: 500
            })
    }
}



export async function GET(request:Request) {
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
    const userId = session._id
    try {
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({
            success: false,
            message: "User not found"
        },
            {
                status: 404
            })
        }
        return Response.json({
            success: true,
            isAcceptingMessages : user.isAcceptingMessages
        },
            {
                status: 200
            })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get accept messages status"
        },
            {
                status: 500
            })
    }
}