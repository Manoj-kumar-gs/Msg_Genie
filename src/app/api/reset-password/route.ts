import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { newPassword, checkNewPassword, username } = await req.json();
        if (newPassword !== checkNewPassword) {
            return Response.json({
                success: false,
                message: "Passwords do not match"
            }, {
                status: 400
            });
        }
        await dbConnect();
        const user = await UserModel.findOne({ username });
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