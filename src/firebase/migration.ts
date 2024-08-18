import { getDocs, query, writeBatch } from "firebase/firestore/lite";
import { FirebaseTransaction, transactionCollection } from "./transactions";
import { database } from "./config";

export const executeMigration = async () => {
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
};
