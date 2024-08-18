import { getDocs, query, where, writeBatch } from "firebase/firestore/lite";
import { database } from "./config";
import {
  FirebaseTransaction,
  FirebaseTransactionInstance,
  transactionCollection,
} from "./transactions/transactionCollection";
import { sum } from "lodash";

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
    const newActualPayers: Record<string, number> = {};

    const document = documentSnapshot.data() as FirebaseTransactionInstance;
    const totalPayerShares = sum(Object.values(document.actualPayerShares));

    for (const payer of Object.keys(document.actualPayerShares)) {
      const payerValue = document.actualPayerShares[payer];

      if (!payerValue || payerValue <= 0) continue;

      newActualPayers[payer] =
        (payerValue * document.totalAmount) / totalPayerShares;
    }

    batch.update(documentSnapshot.ref, { actualPayers: newActualPayers });
  }

  batch.commit();
};
