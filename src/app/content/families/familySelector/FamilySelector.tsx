import { useIsXcl } from "#/authentication/authentication";
import { useFamilies } from "#/firebase/families/families";
import Button from "@mui/material/Button";
import { useState } from "react";
import { CreateFamilyDialog } from "./CreateFamilyDialog";
import { navigateToFamily } from "../familyNavigation";

export const FamilySelector = () => {
  const familyState = useFamilies();
  const isXcl = useIsXcl();
  const [showCreateFamilyDialog, setShowCreateFamilyDialog] = useState(false);

  // Families are still loading, return
  if (familyState.loadingVersion) return null;

  return (
    <>
      {showCreateFamilyDialog && (
        <CreateFamilyDialog onClose={() => setShowCreateFamilyDialog(false)} />
      )}
      {familyState.availableFamilies.map((family) => (
        <Button key={family.id} onClick={() => navigateToFamily(family.id)}>
          {family.name}
        </Button>
      ))}
      {isXcl && (
        <Button onClick={() => setShowCreateFamilyDialog(true)}>
          Create family
        </Button>
      )}
    </>
  );
};
