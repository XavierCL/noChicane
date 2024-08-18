import { getDocs, query, writeBatch } from "firebase/firestore/lite";
import {
  database,
  FirebaseTransaction,
  transactionCollection,
} from "./firebase/transactions";

const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
  transactionCollection
);

const documentsSnapshot = await getDocs<
  FirebaseTransaction,
  FirebaseTransaction
>(initialQuery);

const batch = writeBatch(database);

for (const documentSnapshot of documentsSnapshot.docs) {
  batch.update(documentSnapshot.ref, { transactionType: "instance" });
}

batch.commit();
