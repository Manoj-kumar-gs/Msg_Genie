import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { newPassword, identifier } = await req.json();
        await dbConnect();
        const user = await UserModel.findOne({ $or: [
            { username: identifier },
            { email: identifier }
        ]});

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
            return Response.json({
                success: false,
                message: "New and Old Passwords are same"
            }, {
                status: 404
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return Response.json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.log("Failed to reset password", error);
        return Response.json({
            success: false,
            message: "Failed to reset password"
        }, {
            status: 500
        })
    }
}