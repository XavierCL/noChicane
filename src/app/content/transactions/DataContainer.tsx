import { useFetchTransactions } from "#/firebase/transactions/transactionInstances";
import { useFetchTransactionTotal } from "#/firebase/transactions/transactionTotals";
import { useReactiveTransactions } from "#/firebase/transactions/useReactiveTransactions.ts";

export const DataContainer = () => {
  useFetchTransactions();
  useFetchTransactionTotal();
  useReactiveTransactions();

  return null;
};
