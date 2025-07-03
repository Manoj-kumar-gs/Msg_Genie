import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user";

export async function POST(request: Request) {
  await dbConnect();
  const { suggesterName,username, message } = await request.json();
  console.log(message, suggesterName)

  try {
    const user = await UserModel.findOneAndUpdate(
      { username, isVerified: true, isAcceptingMessages: true },
      {
        $push: {
          messages: {
            suggester: suggesterName || "Well-Wisher",
            content: message,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { success: false, message: "User not accepting messages" },
        { status: 202 }
      );
    }

    return Response.json(
      { success: true, message: `Message sent successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Failed to send suggestion" },
      { status: 500 }
    );
  }
}
