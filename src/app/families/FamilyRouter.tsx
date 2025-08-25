import { Route, Router } from "react-router-dom";
import { FamilyPage } from "./FamilyPage";
import { useFetchFamilies } from "#/firebase/families/families";

export const FamilyRouter = () => {
  useFetchFamilies();

  return (
    <Router>
      <Route path="/families/:familyId" element={<FamilyPage />} />
      <Route path="/families" element={<FamilySelector />} />
    </Router>
  );
};
