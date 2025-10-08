import { z } from "zod";

export const messageSchema = z.object({
    suggester: z.string(),
    content : z
    .string()
    .min(10, {message:"message must contain at least 10 characters"})
    .max(300, {message:"message should not greater than 300 characters"})
})