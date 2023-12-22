import {
  getFirestore,
  getDocs,
  collection,
  CollectionReference,
} from "firebase/firestore/lite";
import { TransactionData } from "./TransactionCard";
import { firebaseApp } from "../firebase/config";
import { useEffect, useState } from "react";

type FirebaseTransaction = {
  id: string;
  addedDate: { toDate: () => Date };
  transactionDate: { toDate: () => Date };
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
};

const database = getFirestore(firebaseApp);
const transactionCollection = collection(
  database,
  "transactions"
) as CollectionReference<FirebaseTransaction, FirebaseTransaction>;

export const useTransactions = (): {
  data: TransactionData[];
  loading: boolean;
} => {
  const [transactions, setTransactions] = useState<TransactionData[]>();

  useEffect(() => {
    getDocs(transactionCollection)
      .then((query) =>
        setTransactions(
          query.docs.map((document) => {
            const data = document.data();

            return {
              ...data,
              addedDate: data.addedDate.toDate(),
              transactionDate: data.transactionDate.toDate(),
            };
          })
        )
      )
      .catch((error) => console.error("Couldn't get documents", error));
  }, []);

  return { data: transactions ?? [], loading: Boolean(transactions) };
};
