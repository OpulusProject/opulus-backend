export interface Item {
  plaidId: string;
  userId: string;
  accessToken: string;
  institutionId?: string | null;
  institutionName?: string | null;
  institutionLogo?: string | null;
  transactionCursor?: string | null;
}
