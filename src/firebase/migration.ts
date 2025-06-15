import { getDocs, query, writeBatch } from "firebase/firestore";
import { database } from "./config";
import {
  FirebaseTransaction,
  transactionCollection,
} from "./transactions/transactionCollection";

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
    const document = documentSnapshot.data();

    if (document.transactionType) continue;

    batch.update(documentSnapshot.ref, {
      transactionType: "instance",
    });
  }

  batch.commit();
};
