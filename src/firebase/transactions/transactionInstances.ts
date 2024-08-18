import {
  setDoc,
  Timestamp,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { TransactionData } from "../../business/TransactionData";
import { database } from "../config";
import {
  FirebaseTransaction,
  FirebaseTransactionInstance,
  TRANSACTION_COLLECTION_NAME,
  transactionCollection,
} from "./transactionCollection";

export const transactionState = proxy<{
  data: TransactionData[];
  // 0 for loading done. Natural number for loading in progress.
  loadingVersion: number;
  loadingError: boolean;
}>({
  data: [],
  loadingVersion: 1,
  loadingError: false,
});

export const useFetchTransactions = (orderField: string) => {
  useEffect(() => {
    (async () => {
      const loadingVersion = transactionState.loadingVersion + 1;

      try {
        transactionState.loadingVersion = loadingVersion;

        const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
          transactionCollection,
          where("transactionType", "==", "instance"),
          orderBy(orderField, "desc"),
          limit(8)
        );

        const documentsSnapshot = await getDocs<
          FirebaseTransaction,
          FirebaseTransaction
        >(initialQuery);

        if (loadingVersion !== transactionState.loadingVersion) return;

        const transactionData = documentsSnapshot.docs.map((document) =>
          convertFirebaseTransactionToTransaction(
            document.data() as FirebaseTransactionInstance
          )
        );

        transactionState.data = transactionData;
        transactionState.loadingError = false;
      } catch (error) {
        transactionState.data = [];
        transactionState.loadingError = true;
        console.error("Couldn't get documents", error);
      } finally {
        if (transactionState.loadingVersion === loadingVersion) {
          transactionState.loadingVersion = 0;
        }
      }
    })();
  }, [orderField]);
};

export const useTransactions = () => useSnapshot(transactionState);

export const addTransaction = async (transactionData: TransactionData) => {
  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionData.id
  );

  await setDoc(documentReference, {
    ...transactionData,
    addedDate: Timestamp.fromDate(transactionData.addedDate),
    transactionDate: Timestamp.fromDate(transactionData.transactionDate),
  });

  transactionState.data.push(transactionData);
};

export const deleteTransaction = async (id: string) => {
  const documentReference = doc(database, TRANSACTION_COLLECTION_NAME, id);
  await deleteDoc(documentReference);

  transactionState.data = transactionState.data.filter(
    (transaction) => transaction.id !== id
  );
};

export const editTransaction = async (transactionData: TransactionData) => {
  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionData.id
  );

  await setDoc(documentReference, {
    ...transactionData,
    addedDate: Timestamp.fromDate(transactionData.addedDate),
    transactionDate: Timestamp.fromDate(transactionData.transactionDate),
  });

  const foundTransactionData = transactionState.data.find(
    ({ id }) => id === transactionData.id
  );

  if (!foundTransactionData)
    throw new Error(`Could not find transaction with id ${transactionData.id}`);

  Object.assign(foundTransactionData, transactionData);
};

const convertFirebaseTransactionToTransaction = (
  firebaseTransaction: FirebaseTransactionInstance
): TransactionData => ({
  ...firebaseTransaction,
  addedDate: firebaseTransaction.addedDate.toDate(),
  transactionDate: firebaseTransaction.transactionDate.toDate(),
});
