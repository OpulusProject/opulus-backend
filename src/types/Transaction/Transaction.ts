export interface Transaction {
  plaidId: string;
  accountId: string;
  amount: number;
  currencyCode: string | null;
  pending: boolean;
  date: Date;
  authorizedDate: Date | null;
  paymentChannel: string;
  transactionCode: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  name: string;
  merchantName?: string | null;
  logoURL?: string | null;
  website?: string | null;
}
