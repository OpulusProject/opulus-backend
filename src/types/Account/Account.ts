export interface Account {
  plaidId: string;
  itemId: string;
  mask: string | null;
  name: string;
  officialName: string | null;
  type: string;
  subtype: string | null;
  availableBalance: number | null;
  currentBalance: number | null;
  limit: number | null;
  currencyCode: string | null;
}
