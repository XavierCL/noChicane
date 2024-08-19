import {
  doc,
  getDocs,
  query,
  where,
  WriteBatch,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import {
  TransactionData,
  TransactionTotal,
} from "../../business/TransactionData";
import { database } from "../config";
import {
  FirebaseTransaction,
  TRANSACTION_COLLECTION_NAME,
  transactionCollection,
} from "./transactionCollection";
import { computeBalance } from "../../business/computeBalance";

export const transactionTotalState = proxy<{
  data?: TransactionTotal;
  // 0 for loading done. Natural number for loading in progress.
  loadingVersion: number;
  loadingError: boolean;
}>({
  data: undefined,
  loadingVersion: 1,
  loadingError: false,
});

export const useFetchTransactionTotal = () => {
  useEffect(() => {
    (async () => {
      const loadingVersion = transactionTotalState.loadingVersion + 1;

      try {
        transactionTotalState.loadingVersion = loadingVersion;

        const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
          transactionCollection,
          where("transactionType", "==", "total")
        );

        const documentsSnapshot = await getDocs<
          FirebaseTransaction,
          FirebaseTransaction
        >(initialQuery);

        if (loadingVersion !== transactionTotalState.loadingVersion) return;

        if (documentsSnapshot.size !== 1) {
          console.error(
            "The total transaction document isn't valid",
            documentsSnapshot.docs
          );

          transactionTotalState.loadingError = true;

          throw new Error("The total transaction document isn't valid");
        }

        transactionTotalState.data =
          documentsSnapshot.docs[0].data() as TransactionTotal;
        transactionTotalState.loadingError = false;
      } catch (error) {
        transactionTotalState.data = undefined;
        transactionTotalState.loadingError = true;
        console.error("Couldn't get documents", error);
      } finally {
        if (transactionTotalState.loadingVersion === loadingVersion) {
          transactionTotalState.loadingVersion = 0;
        }
      }
    })();
  }, []);
};

export const useTransactionTotal = () => useSnapshot(transactionTotalState);

export const addTotal = (
  newTransaction: TransactionData,
  batch: WriteBatch
) => {
  if (!transactionTotalState.data) {
    throw new Error("Could not get the total transaction");
  }

  const newTotals = computeBalance([
    {
      actualPayers: transactionTotalState.data.totalPaid,
      idealPayerShares: transactionTotalState.data.totalIdeal,
    },
    newTransaction,
  ]);

  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionTotalState.data.id
  );

  batch.update(documentReference, { ...newTotals });

  Object.assign(transactionTotalState.data, newTotals);
};

export const editTotal = (
  oldTransaction: TransactionData,
  newTransaction: TransactionData,
  batch: WriteBatch
) => {
  if (!transactionTotalState.data) {
    throw new Error("Could not get the total transaction");
  }

  const newTotals = computeBalance([
    {
      actualPayers: transactionTotalState.data.totalPaid,
      idealPayerShares: transactionTotalState.data.totalIdeal,
    },
    { ...oldTransaction, rollback: true },
    newTransaction,
  ]);

  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionTotalState.data.id
  );

  batch.update(documentReference, { ...newTotals });

  Object.assign(transactionTotalState.data, newTotals);
};

export const deleteTotal = (
  oldTransaction: TransactionData,
  batch: WriteBatch
) => {
  if (!transactionTotalState.data) {
    throw new Error("Could not get the total transaction");
  }

  const newTotals = computeBalance([
    {
      actualPayers: transactionTotalState.data.totalPaid,
      idealPayerShares: transactionTotalState.data.totalIdeal,
    },
    { ...oldTransaction, rollback: true },
  ]);

  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionTotalState.data.id
  );

  batch.update(documentReference, { ...newTotals });

  Object.assign(transactionTotalState.data, newTotals);
};
