import { doc, getDocs, query, where, WriteBatch } from "firebase/firestore";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import {
  TransactionData,
  TransactionTotal,
} from "../../business/transactions/TransactionData";
import { database } from "../config";
import {
  FirebaseTransaction,
  getTransactionCollection,
  getTransactionCollectionName,
} from "./transactionCollection";
import { computeBalance } from "../../business/transactions/computeBalance";
import { familyState, useFamilies } from "../families/families";

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
  const { selectedFamily } = useFamilies();

  useEffect(() => {
    if (!selectedFamily) return;

    const transactionCollection = getTransactionCollection(selectedFamily.id);

    const transactionTotalQuery = query<
      FirebaseTransaction,
      FirebaseTransaction
    >(transactionCollection, where("transactionType", "==", "total"));

    (async () => {
      const loadingVersion = transactionTotalState.loadingVersion + 1;

      try {
        transactionTotalState.loadingVersion = loadingVersion;

        const documentsSnapshot = await getDocs<
          FirebaseTransaction,
          FirebaseTransaction
        >(transactionTotalQuery);

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
          documentsSnapshot.docs[0].data() as unknown as TransactionTotal;
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
  }, [selectedFamily]);
};

export const useTransactionTotal = () => useSnapshot(transactionTotalState);

export const addTotal = (
  newTransaction: TransactionData,
  batch: WriteBatch
) => {
  if (!transactionTotalState.data) {
    throw new Error("Could not get the total transaction");
  }

  const selectedFamily = familyState.selectedFamily;

  if (!selectedFamily) {
    throw new Error("No selected family");
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
    getTransactionCollectionName(selectedFamily.id),
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

  const selectedFamily = familyState.selectedFamily;

  if (!selectedFamily) {
    throw new Error("No selected family");
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
    getTransactionCollectionName(selectedFamily.id),
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

  const { selectedFamily } = familyState;

  if (!selectedFamily) {
    throw new Error("No selected family");
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
    getTransactionCollectionName(selectedFamily.id),
    transactionTotalState.data.id
  );

  batch.update(documentReference, { ...newTotals });

  Object.assign(transactionTotalState.data, newTotals);
};
