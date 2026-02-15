import * as z from "zod";

export const jwtPayloadSchema = z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string()
})

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;