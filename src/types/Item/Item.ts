export interface Item {
  plaidId: string;
  userId: string;
  accessToken: string;
  transactionCursor: string;
  institutionId?: string | null;
  institutionName?: string | null;
}
