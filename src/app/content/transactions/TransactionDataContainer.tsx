import { useFetchTransactions } from "#/firebase/transactions/transactionInstances";
import { useFetchTransactionTotal } from "#/firebase/transactions/transactionTotals";
import { useReactiveTransactions } from "#/firebase/transactions/useReactiveTransactions.ts";

export const TransactionDataContainer = () => {
  useFetchTransactions();
  useFetchTransactionTotal();
  useReactiveTransactions();

  return null;
};
