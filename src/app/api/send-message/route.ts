import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function POST(request: Request) {
  await dbConnect();
  const { username, message } = await request.json();

  try {
    const user = await UserModel.findOneAndUpdate(
      { username, isVerified: true, isAcceptingMessages: true },
      {
        $push: {
          messages: {
            content: message,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { success: false, message: "User not found or not accepting messages" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
