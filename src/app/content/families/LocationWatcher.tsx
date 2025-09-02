import { familyState, useFamilies } from "#/firebase/families/families";
import { find } from "lodash";
import { useParams } from "react-router-dom";
import { useNavigateToHomePage } from "./familyNavigation";
import { useEffect } from "react";

export const LocationWatcher = () => {
  const { familyId } = useParams();
  const { loadingVersion: familyLoading } = useFamilies();
  const navigateToHomePage = useNavigateToHomePage();

  useEffect(() => {
    if (!familyId) return;
    if (familyLoading) return;

    const newSelectedFamily = find(
      familyState.availableFamilies,
      (f) => f.id == familyId
    );

    if (!newSelectedFamily) {
      // The selected family is no longer valid, returning to home page
      navigateToHomePage();
      return;
    }

    if (newSelectedFamily.id === familyState.selectedFamily?.id) return;

    familyState.selectedFamily = newSelectedFamily;
  }, [familyId, familyLoading, navigateToHomePage]);

  return null;
};
