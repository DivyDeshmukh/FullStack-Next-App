import { z } from "zod";

// here username is a single value so direct string
export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

// here we have multiple things to check so that's why object
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters" }),
});
