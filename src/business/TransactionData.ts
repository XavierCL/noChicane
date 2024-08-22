export const defaultIdealPayerShares = { xcl: 7, catb: 3 };

export type TransactionData = {
  id: string;
  transactionDate: Date;
  addedDate: Date;
  actualPayers: Record<string, number>;
  idealPayerShares: Record<string, number>;
  title: string;
  transactionType: "instance";
};

export type TransactionTotal = {
  id: string;
  totalPaid: Record<string, number>;
  totalIdeal: Record<string, number>;
  transactionType: "instance";
};

export type OrderField = "transactionDate" | "addedDate";
