import { familyState } from "#/firebase/families/families";

export const navigateToHomePage = () =>
  history.pushState(undefined, "", `/families`);

export const navigateToFamily = (familyId: string) =>
  history.pushState(undefined, "", `/families/${familyId}`);

export const navigateToFamilySubPage = (subPage: "transaction") => {
  if (subPage !== "transaction") return;
  const { selectedFamily } = familyState;
  if (!selectedFamily) return;
  history.pushState(
    undefined,
    "",
    `/families/${selectedFamily.id}/transaction`
  );
};
