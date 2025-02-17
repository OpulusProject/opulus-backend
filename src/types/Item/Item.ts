export interface Item {
  plaidId: string;
  userId: string;
  accessToken: string;
  institutionId?: string | null;
  institutionName?: string | null;
  transactionCursor?: string;
}
