import { collection, CollectionReference } from "firebase/firestore";
import { database } from "../config";

export type FirebaseTransactionInstance = {
  id: string;
  transactionType: "instance";
  title: string;
  addedDate: { toDate: () => Date };
  transactionDate: { toDate: () => Date };
  actualPayers: Record<string, number>;
  idealPayerShares: Record<string, number>;
};

export type FirebaseTransactionTotal = {
  id: string;
  transactionType: "total";
  totalPaid: Record<string, number>;
  totalIdeal: Record<string, number>;
};

export type FirebaseTransaction =
  | FirebaseTransactionInstance
  | FirebaseTransactionTotal;

export const TRANSACTION_COLLECTION_NAME = "transactions";
export const transactionCollection = collection(
  database,
  TRANSACTION_COLLECTION_NAME
) as CollectionReference<FirebaseTransaction, FirebaseTransaction>;
