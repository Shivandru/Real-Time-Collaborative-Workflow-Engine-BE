import * as z from "zod";

export const createUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string(),
    isOauth: z.boolean().default(false)
})

export const userSchema = createUserSchema.extend({
    userId: z.string(),
    createdAt: z.string(),
})

export const oauthUserSchema = createUserSchema.extend({
  oauthProvider: z.enum(["google", "github"]),
  oauthId: z.string(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
