import { UserCreateRequest } from "plaid";

import { plaid } from "./plaid";

export async function createPlaidUser(userId: string) {
  const request: UserCreateRequest = {
    client_user_id: userId,
  };

  return await plaid.userCreate(request);
}
