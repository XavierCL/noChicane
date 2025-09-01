import { familyState } from "#/firebase/families/families";
import Button from "@mui/material/Button";
import { SettingsButton } from "./settings/SettingsButton";
import { navigateToFamilySubPage } from "./familyNavigation";

export const FamilyPage = () => {
  return (
    <>
      <SettingsButton />
      <Button
        onClick={() => {
          const { selectedFamily } = familyState;

          if (!selectedFamily) return;

          navigateToFamilySubPage("transaction");
        }}
      >
        Transactions
      </Button>
    </>
  );
};
