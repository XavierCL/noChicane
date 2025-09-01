import { FamilyData } from "#/business/families/FamilyData";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import {
  FAMILY_COLLECTION_NAME,
  familyCollection,
  FirebaseFamily,
} from "./familyCollection";
import { doc, getDocs, orderBy, query, writeBatch } from "firebase/firestore";
import { database } from "../config";
import { XCL_UID } from "#/authentication/authentication";
import {
  FirebaseTransactionTotal,
  getTransactionCollectionName,
} from "../transactions/transactionCollection";
import { navigateToFamily } from "#/app/content/families/familyNavigation";

export const familyState = proxy<{
  selectedFamily?: FamilyData;
  availableFamilies: FamilyData[];
  // 0 for loading done. Natural number for loading in progress.
  loadingVersion: number;
  loadingError: boolean;
}>({
  availableFamilies: [],
  loadingVersion: 1,
  loadingError: false,
});

export const useFamilies = () => useSnapshot(familyState);

export const useFetchFamilies = () => {
  useEffect(() => {
    (async () => {
      const loadingVersion = familyState.loadingVersion + 1;

      try {
        familyState.loadingVersion = loadingVersion;

        const familyQuery = query<FirebaseFamily, FirebaseFamily>(
          familyCollection,
          orderBy("name", "asc")
        );

        const documentsSnapshot = await getDocs<FirebaseFamily, FirebaseFamily>(
          familyQuery
        );

        if (loadingVersion !== familyState.loadingVersion) return;

        const familyData = documentsSnapshot.docs.map((document) =>
          convertFirebaseFamilyToFamily(document.data())
        );

        familyState.availableFamilies = familyData;
        familyState.loadingError = false;
      } catch (error) {
        familyState.availableFamilies = [];
        familyState.loadingError = true;
        console.error("Couldn't get documents", error);
      } finally {
        if (familyState.loadingVersion === loadingVersion) {
          familyState.loadingVersion = 0;
        }
      }
    })();
  }, []);
};

const convertFirebaseFamilyToFamily = (
  firebaseTransaction: FirebaseFamily
): FamilyData => ({
  ...firebaseTransaction,
});

export const createFamily = (name: string) => {
  const batch = writeBatch(database);

  const newFamilyId = crypto.randomUUID();

  const familyDocumentReference = doc(
    database,
    FAMILY_COLLECTION_NAME,
    newFamilyId
  );
  const newFamilyData: FamilyData = {
    id: newFamilyId,
    name,
    members: [XCL_UID],
  };

  batch.set(familyDocumentReference, newFamilyData);

  const transactionTotalDocumentId = crypto.randomUUID();

  const transactionTotalDocumentReference = doc(
    database,
    getTransactionCollectionName(newFamilyId),
    transactionTotalDocumentId
  );

  const transactionTotalData: FirebaseTransactionTotal = {
    id: transactionTotalDocumentId,
    totalIdeal: {},
    totalPaid: {},
    transactionType: "total",
  };

  batch.set(transactionTotalDocumentReference, transactionTotalData);

  batch.commit();

  familyState.availableFamilies.push(newFamilyData);
  navigateToFamily(newFamilyData.id);
};
