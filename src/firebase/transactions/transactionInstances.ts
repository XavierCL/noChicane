import {
  Timestamp,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  WriteBatch,
  startAfter,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { OrderField, TransactionData } from "../../business/TransactionData";
import { database } from "../config";
import {
  FirebaseTransaction,
  FirebaseTransactionInstance,
  TRANSACTION_COLLECTION_NAME,
  transactionCollection,
} from "./transactionCollection";

const PAGE_SIZE = 8;

export const transactionState = proxy<{
  data: TransactionData[];
  moreData: boolean;
  latestPage?: Date | string;
  // 0 for loading done. Natural number for loading in progress.
  loadingVersion: number;
  loadingError: boolean;
  orderField: OrderField;
  // Resets the data every time this increments
  resets: number;
}>({
  data: [],
  moreData: true,
  loadingVersion: 1,
  loadingError: false,
  orderField: "transactionDate",
  resets: 0,
});

export const useTransactions = () => useSnapshot(transactionState);

export const useFetchTransactions = () => {
  const { orderField, resets } = useTransactions();

  useEffect(() => {
    (async () => {
      const loadingVersion = transactionState.loadingVersion + 1;

      try {
        transactionState.loadingVersion = loadingVersion;

        const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
          transactionCollection,
          where("transactionType", "==", "instance"),
          orderBy(orderField, "desc"),
          limit(PAGE_SIZE)
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
        transactionState.moreData = documentsSnapshot.size === PAGE_SIZE;
        transactionState.latestPage = documentsSnapshot.docs.at(-1)!.data()[
          orderField as keyof FirebaseTransaction
        ];
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
  }, [orderField, resets]);
};

export const fetchMoreTransactions = async () => {
  if (transactionState.loadingVersion) return;
  if (!transactionState.moreData) return;
  if (!transactionState.latestPage) return;
  if (transactionState.loadingError) return;

  const loadingVersion = transactionState.loadingVersion + 1;

  try {
    transactionState.loadingVersion = loadingVersion;

    const fetchMoreQuery = query<FirebaseTransaction, FirebaseTransaction>(
      transactionCollection,
      where("transactionType", "==", "instance"),
      orderBy(transactionState.orderField, "desc"),
      startAfter(transactionState.latestPage),
      limit(PAGE_SIZE)
    );

    const documentsSnapshot = await getDocs<
      FirebaseTransaction,
      FirebaseTransaction
    >(fetchMoreQuery);

    if (loadingVersion !== transactionState.loadingVersion) return;

    const transactionData = documentsSnapshot.docs.map((document) =>
      convertFirebaseTransactionToTransaction(
        document.data() as FirebaseTransactionInstance
      )
    );

    transactionState.data = [...transactionState.data, ...transactionData];
    transactionState.loadingError = false;
    transactionState.moreData = documentsSnapshot.size === PAGE_SIZE;
    transactionState.latestPage = documentsSnapshot.docs.at(-1)!.data()[
      transactionState.orderField as keyof FirebaseTransaction
    ];
  } catch (error) {
    transactionState.loadingError = true;
    console.error("Couldn't get documents", error);
  } finally {
    if (transactionState.loadingVersion === loadingVersion) {
      transactionState.loadingVersion = 0;
    }
  }
};

export const addTransaction = (
  transactionData: TransactionData,
  batch: WriteBatch
) => {
  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionData.id
  );

  batch.set(documentReference, {
    ...transactionData,
    addedDate: Timestamp.fromDate(transactionData.addedDate),
    transactionDate: Timestamp.fromDate(transactionData.transactionDate),
  });

  transactionState.data.push(transactionData);
};

export const deleteTransaction = (id: string, batch: WriteBatch) => {
  const documentReference = doc(database, TRANSACTION_COLLECTION_NAME, id);
  batch.delete(documentReference);

  transactionState.data = transactionState.data.filter(
    (transaction) => transaction.id !== id
  );
};

export const editTransaction = (
  transactionData: TransactionData,
  batch: WriteBatch
) => {
  const documentReference = doc(
    database,
    TRANSACTION_COLLECTION_NAME,
    transactionData.id
  );

  batch.set(documentReference, {
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
