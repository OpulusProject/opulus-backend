import { TypeOf, object, string } from "zod";

export type CreateAccountInput = TypeOf<typeof createAccountSchema>["body"];

export const createAccountSchema = object({
  body: object({
    publicToken: string({
      required_error: "Public token is required",
    }),
  }),
});
