import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user";
import mongoose from "mongoose";

export async function DELETE(request: Request, context: { params: Promise<{ messageId: string }> }
) {
    const { messageId } = await context.params;
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
    const dbMessageId = new mongoose.Types.ObjectId(messageId)
    try {
        const deleteConfirmation = await UserModel.updateOne(
            { _id: session?.user?._id },
            {
                $pull: {
                    messages: { _id: dbMessageId }
                }
            }
        )
        if (deleteConfirmation.matchedCount === 0) {
            return Response.json({
                success: false,
                message: "Error deleting message"
            },
                {
                    status: 401
                })
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        },
            {
                status: 200
            })
    } catch (error) {
        console.log("Error in deleting message", error)
        return Response.json({
            success: false,
            message: "Failed delete the message"
        },
            {
                status: 500
            })
    }
}