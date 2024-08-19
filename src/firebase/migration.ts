import { getDocs, query, where, writeBatch } from "firebase/firestore/lite";
import { database } from "./config";
import {
  FirebaseTransaction,
  FirebaseTransactionInstance,
  transactionCollection,
} from "./transactions/transactionCollection";
import { omit } from "lodash";

export const executeMigration = async () => {
  const initialQuery = query<FirebaseTransaction, FirebaseTransaction>(
    transactionCollection,
    where("transactionType", "==", "instance")
  );

  const documentsSnapshot = await getDocs<
    FirebaseTransaction,
    FirebaseTransaction
  >(initialQuery);

  const batch = writeBatch(database);

  for (const documentSnapshot of documentsSnapshot.docs) {
    const document = documentSnapshot.data() as FirebaseTransactionInstance;

    batch.set(
      documentSnapshot.ref,
      omit(document, [
        "actualPayerShares",
        "totalAmount",
      ]) as FirebaseTransactionInstance
    );
  }

  batch.commit();
};
