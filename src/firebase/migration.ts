import { doc, setDoc } from "firebase/firestore/lite";
import { TRANSACTION_COLLECTION_NAME } from "./transactions/transactionCollection";
import { computeBalance } from "../business/computeBalance";
import { transactionState } from "./transactions/transactionInstances";
import { database } from "./config";

export const executeMigration = async () => {
  const balance = computeBalance(transactionState.data);

  const totalId = `total-${crypto.randomUUID()}`;

  const documentReference = doc(database, TRANSACTION_COLLECTION_NAME, totalId);

  await setDoc(documentReference, {
    id: totalId,
    transactionType: "total",
    ...balance,
  });
};
