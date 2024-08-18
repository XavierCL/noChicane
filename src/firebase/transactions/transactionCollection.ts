import { collection, CollectionReference } from "firebase/firestore/lite";
import { database } from "../config";

export type FirebaseTransactionInstance = {
  id: string;
  transactionType: "instance";
  title: string;
  addedDate: { toDate: () => Date };
  transactionDate: { toDate: () => Date };
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
};

export type FirebaseTransactionTotal = {
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
