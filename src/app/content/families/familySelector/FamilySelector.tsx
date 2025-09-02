import { useIsXcl } from "#/authentication/authentication";
import { useFamilies } from "#/firebase/families/families";
import Button from "@mui/material/Button";
import { useState } from "react";
import { CreateFamilyDialog } from "./CreateFamilyDialog";
import { useNavigateToFamily } from "../familyNavigation";
import emotionStyled from "@emotion/styled";

export const FamilySelector = () => {
  const familyState = useFamilies();
  const isXcl = useIsXcl();
  const [showCreateFamilyDialog, setShowCreateFamilyDialog] = useState(false);
  const navigateToFamily = useNavigateToFamily();

  // Families are still loading, return
  if (familyState.loadingVersion) return null;

  return (
    <ButtonContainer>
      {showCreateFamilyDialog && (
        <CreateFamilyDialog onClose={() => setShowCreateFamilyDialog(false)} />
      )}
      {familyState.availableFamilies.map((family) => (
        <Button
          key={family.id}
          variant="contained"
          onClick={() => navigateToFamily(family.id)}
        >
          {family.name}
        </Button>
      ))}
      {isXcl && (
        <Button onClick={() => setShowCreateFamilyDialog(true)}>
          Create family
        </Button>
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = emotionStyled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
