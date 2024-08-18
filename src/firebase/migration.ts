import { addDoc } from "firebase/firestore/lite";
import { transactionCollection } from "./transactions/transactionCollection";
import { computeBalance } from "../business/computeBalance";
import { transactionState } from "./transactions/transactionInstances";

export const executeMigration = async () => {
  const balance = computeBalance(transactionState.data);

  addDoc(transactionCollection, {
    transactionType: "total",
    ...balance,
  });
};
