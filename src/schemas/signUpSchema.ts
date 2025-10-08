import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, { message: "username must contain 2 characters" })
    .max(20, { message: "maximum no of characters allowed are 20" })
    .regex(/^[a-zA-Z0-9_]+$/, "alphabets, numbers and _ are only allowed")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "invalid email address" }),
    password: z.string().min(5, { message: "password should contain atleast 5 characters" })
}) 