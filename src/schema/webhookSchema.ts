import { TypeOf, object, string } from "zod";

export type WebhookInput = TypeOf<typeof WebhookSchema>["body"];

export const WebhookSchema = object({
  body: object({
    webhook_type: string({
      required_error: "Webhook type is required",
    }),
    webhook_code: string({
      required_error: "Webhook code is required",
    }),
    item_id: string({
      required_error: "PlaidItemId is required",
    }),
  }),
});
