export const defaultIdealPayerShares = { xcl: 7, catb: 3 };

export type TransactionData = {
  id: string;
  transactionDate: Date;
  addedDate: Date;
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
  title: string;
};

export type OrderField = "transactionDate" | "addedDate";
