import emotionStyled from "@emotion/styled";
import { ApplicationHeader } from "./header/ApplicationHeader";
import { TransactionPage } from "./content/transactions/TransactionPage";

export const AuthenticatedApp = () => {
  return (
    <>
      <ApplicationHeader />
      <ApplicationContainer>
        <TransactionPage />
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
