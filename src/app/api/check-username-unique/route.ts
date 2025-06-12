import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

const usernameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryparams = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryparams)

        if (!result.success) {
            console.error("fieldErrors :", result.error.flatten().fieldErrors);
            const errors = result.error.format().username?._errors || []
            return Response.json({
                message: "Invalid username",
                issues: errors?.length > 0 ? errors.join("' ") : "invalid username",
            }, {
                status: 400
            });
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username: username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "user already exists"
            })
        }

        return Response.json(
            {
                success: true,
                message: "Valid username"
            },
            { status: 200 });

    } catch (error) {
        console.error("error checking username", error);
        return Response.json({
            message: "enter unique username"
        }, { status: 500 });
    }
}

