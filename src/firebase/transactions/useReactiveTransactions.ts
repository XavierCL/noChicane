import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import {
  transactionTotalQuery,
  transactionTotalState,
} from "./transactionTotals";
import { transactionState } from "./transactionInstances";
import { TransactionTotal } from "../../business/TransactionData";
import { isEqual } from "lodash";

export const useReactiveTransactions = () => {
  useEffect(() => {
    return onSnapshot(transactionTotalQuery, (changeData) => {
      // Don't do anything on local changes
      if (changeData.metadata.hasPendingWrites || changeData.empty) {
        return;
      }

      const newTransactionTotal =
        changeData.docs[0].data() as unknown as TransactionTotal;

      if (isEqual(transactionTotalState.data, newTransactionTotal)) {
        return;
      }

      if (!transactionTotalState.data) {
        transactionTotalState.data = newTransactionTotal;
      } else {
        Object.assign(transactionTotalState.data, newTransactionTotal);
      }

      transactionState.resets += 1;
    });
  }, []);
};
