import { TypeOf, object, string } from "zod";

export type CreateItemInput = TypeOf<typeof createItemSchema>["body"];

export const createItemSchema = object({
  body: object({
    publicToken: string({
      required_error: "Public token is required",
    }),
  }),
});
