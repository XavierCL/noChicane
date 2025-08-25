import { FamilyData } from "#/business/families/FamilyData";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { familyCollection, FirebaseFamily } from "./familyCollection";
import { getDocs, orderBy, query } from "firebase/firestore";

export const familyState = proxy<{
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
