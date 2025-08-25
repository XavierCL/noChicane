import { useFamilies } from "#/firebase/families/families";
import { useParams } from "react-router-dom";

export const FamilyPage = () => {
  const familyState = useFamilies();
  const { familyId } = useParams();

  // Families are still loading, return
  if (!familyState.loadingVersion) return null;

  const family = familyState.availableFamilies.find((f) => f.id == familyId);

  // The selected family is no longer valid, returning to home page
  if (!family) history.pushState(undefined, "", "/families");
};
