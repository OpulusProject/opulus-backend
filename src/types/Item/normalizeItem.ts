import { Item as PlaidItem } from "plaid";

import { Item } from "./Item";

export function normalizeItem(
  item: PlaidItem,
  userId: string,
  accessToken: string,
  institutionName?: string,
): Item {
  return {
    plaidId: item.item_id,
    userId,
    accessToken,
    institutionId: item.institution_id,
    institutionName,
  };
}
