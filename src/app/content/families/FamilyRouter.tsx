import { Route, Routes } from "react-router-dom";
import { FamilyPage } from "./FamilyPage";
import { useFetchFamilies } from "#/firebase/families/families";
import { FamilySelector } from "./familySelector/FamilySelector";
import { TransactionPage } from "../transactions/TransactionPage";
import { useStoreSelectedFamilyFromPath } from "./useFamilyFromPath";

export const FamilyRouter = () => {
  useFetchFamilies();
  useStoreSelectedFamilyFromPath();

  return (
    <Routes>
      <Route path="/families" element={<FamilySelector />} />
      <Route path="/families/:familyId" element={<FamilyPage />} />
      <Route
        path="/families/:familyId/transactions"
        element={<TransactionPage />}
      />
    </Routes>
  );
};
