import { familyState } from "#/firebase/families/families";
import Button from "@mui/material/Button";
import { SettingsButton } from "./settings/SettingsButton";
import { useNavigateToFamilySubPage } from "./familyNavigation";

export const FamilyPage = () => {
  const navigateToSubPage = useNavigateToFamilySubPage();

  return (
    <>
      <SettingsButton />
      <Button
        onClick={() => {
          const { selectedFamily } = familyState;

          if (!selectedFamily) return;

          navigateToSubPage("transaction");
        }}
      >
        Transactions
      </Button>
    </>
  );
};
