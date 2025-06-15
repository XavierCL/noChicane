import { useFetchTransactions } from "../firebase/transactions/transactionInstances";
import { useFetchTransactionTotal } from "../firebase/transactions/transactionTotals";
import { useReactiveTransactions } from "../firebase/transactions/useReactiveTransactions";

export const DataContainer = () => {
  console.log("Data rendered!");
  useFetchTransactions();
  useFetchTransactionTotal();
  useReactiveTransactions();

  return null;
};
