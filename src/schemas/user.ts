import * as z from "zod";

export const localAuthSchema = z.object({
    provider: z.literal("local"),
    password: z.string("").min(3, "password must be 3 characters long"),
    googleId: z.string().optional().default("").nullable(),
});

export const googleAuthSchema = z.object({
    provider: z.literal("google"),
    password: z.string().optional().default("").nullable(),
    googleId: z.string("").min(3, "password must be 3 characters long"),
});

export const authProviderSchema = z.discriminatedUnion("provider", [localAuthSchema, googleAuthSchema]);

export const createUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    auth: authProviderSchema,
});

export const userSchema = createUserSchema.extend({
    userId: z.string(),
    createdAt: z.string(),
});

export const userLocalInputSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
});
export const userGoogleInputSchema = z.object({
    username: z.string(),
    googleId: z.string(),
    email: z.string().email(),
});

export type UserInputLocal = z.infer<typeof userLocalInputSchema>;
export type UserInputGoogle = z.infer<typeof userGoogleInputSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
