import { getDocs, query, writeBatch } from "firebase/firestore";
import { database } from "./config";
import {
  FirebaseTransaction,
  getTransactionCollection,
} from "./transactions/transactionCollection";
import { familyState } from "./families/families";

export const executeMigration = async () => {
  const { selectedFamily } = familyState;

  if (!selectedFamily) return;

  const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
    getTransactionCollection(selectedFamily.id)
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
