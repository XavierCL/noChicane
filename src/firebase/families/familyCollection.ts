import { collection, CollectionReference } from "firebase/firestore";
import { database } from "../config";

export type FirebaseFamily = {
  id: string;
  name: string;
  members: string[];
};

export const FAMILY_COLLECTION_NAME = "families";
export const familyCollection = collection(
  database,
  FAMILY_COLLECTION_NAME
) as CollectionReference<FirebaseFamily, FirebaseFamily>;
