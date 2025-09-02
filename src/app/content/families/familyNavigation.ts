import { familyState } from "#/firebase/families/families";
import { useNavigate } from "react-router-dom";

export const useNavigateToHomePage = () => {
  const navigate = useNavigate();
  return () => navigate("/families");
};

export const useNavigateToFamily = () => {
  const navigate = useNavigate();
  return (familyId: string) => navigate(`/families/${familyId}`);
};

export const useNavigateToFamilySubPage = () => {
  const navigate = useNavigate();
  return (subPage: "transaction") => {
    if (subPage !== "transaction") return;
    const { selectedFamily } = familyState;
    if (!selectedFamily) return;
    navigate(`/families/${selectedFamily.id}/transactions`);
  };
};
