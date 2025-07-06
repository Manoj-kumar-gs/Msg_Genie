import { z } from "zod";

export const resetPasswordSchema = z.object({
    newPassword : z.string().min(5,{message:"password must contain minimum of 5 characters"}),
    checkNewPassword : z.string().min(5,{message:"password must contain minimum of 5 characters"})
})