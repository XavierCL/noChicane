import {
  getFirestore,
  collection,
  CollectionReference,
  setDoc,
  Timestamp,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore/lite";
import { firebaseApp } from "../firebase/config";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { TransactionData } from "../app/content/transactionCard/TransactionCard";

type FirebaseTransaction = {
  id: string;
  title: string;
  addedDate: { toDate: () => Date };
  transactionDate: { toDate: () => Date };
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
};

const database = getFirestore(firebaseApp);
const TRANSACTION_COLLECTION_NAME = "transactions";
const transactionCollection = collection(
  database,
  TRANSACTION_COLLECTION_NAME
) as CollectionReference<FirebaseTransaction, FirebaseTransaction>;

const transactionState = proxy<{
  data: TransactionData[];
  // 0 for loading done. Natural number for loading in progress.
  loadingVersion: number;
}>({
  data: [],
  loadingVersion: 1,
});

export const useFetchTransactions = () => {
  useEffect(() => {
    (async () => {
      const loadingVersion = transactionState.loadingVersion + 1;

      try {
        transactionState.loadingVersion = loadingVersion;

        const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
          transactionCollection
        );

        const documentsSnapshot = await getDocs<
          FirebaseTransaction,
          FirebaseTransaction
        >(initialQuery);

        if (loadingVersion !== transactionState.loadingVersion) return;

        const transactionData = documentsSnapshot.docs.map((document) =>
          convertFirebaseTransactionToTransaction(document.data())
        );

        transactionState.data = transactionData;
      } catch (error) {
        transactionState.data = [];
        console.error("Couldn't get documents", error);
      } finally {
        if (transactionState.loadingVersion === loadingVersion) {
          transactionState.loadingVersion = 0;
        }
      }
    })();
  }, []);
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
  firebaseTransaction: FirebaseTransaction
): TransactionData => ({
  ...firebaseTransaction,
  addedDate: firebaseTransaction.addedDate.toDate(),
  transactionDate: firebaseTransaction.transactionDate.toDate(),
});
