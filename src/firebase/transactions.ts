import {
  getFirestore,
  collection,
  CollectionReference,
  setDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore/lite";
import { firebaseApp } from "../firebase/config";
import { doc, getDocs } from "firebase/firestore/lite";
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

const transactionState = proxy<{ data: TransactionData[]; loading: boolean }>({
  data: [],
  loading: true,
});

export const useFetchInitialTransactions = () => {
  useEffect(() => {
    getDocs(transactionCollection)
      .then((query) => {
        const transactionData = query.docs.map((document) => {
          const data = document.data();

          return {
            ...data,
            addedDate: data.addedDate.toDate(),
            transactionDate: data.transactionDate.toDate(),
          };
        });

        transactionState.data = transactionData;
        transactionState.loading = false;
      })
      .catch((error) => console.error("Couldn't get documents", error));
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
