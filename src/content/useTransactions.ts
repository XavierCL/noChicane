import { TransactionData } from "./TransactionCard";

const fakeTransactions = [
  {
    id: "1",
    transactionDate: new Date(123),
    addedDate: new Date(111),
    totalAmount: 50,
    shares: { xcl: 66, catb: 33 },
  },
  {
    id: "2",
    transactionDate: new Date(321),
    addedDate: new Date(222),
    totalAmount: 10,
    shares: { xcl: 66, catb: 33 },
  },
];

export const useTransactions = (): { data: TransactionData[] } => {
  return { data: fakeTransactions };
};
