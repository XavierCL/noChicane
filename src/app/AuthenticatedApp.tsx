import emotionStyled from "@emotion/styled";
import { ApplicationHeader } from "./header/ApplicationHeader";
import { useDefaultLocation } from "#/navigation/useDefaultLocation";
import { FamilyRouter } from "./content/families/FamilyRouter";

export const AuthenticatedApp = () => {
  useDefaultLocation();

  return (
    <>
      <ApplicationHeader />
      <ApplicationContainer>
        <FamilyRouter />
      </ApplicationContainer>
    </>
  );
};

const ApplicationContainer = emotionStyled.div`
  padding: 8px;
  height: calc(100vh - 64px);

  display: flex;
  flex-direction: column;
  gap: 8px;
`;
