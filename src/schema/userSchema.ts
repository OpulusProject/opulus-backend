import { TypeOf, object, string } from "zod";

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
  }),
});
