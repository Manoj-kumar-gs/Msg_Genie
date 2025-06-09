import { z } from "zod";

export const acceptMessageSchema = z.object({
    AcceptMessage : z.boolean()
})