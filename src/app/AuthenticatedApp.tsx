import emotionStyled from "@emotion/styled";
import { ApplicationHeader } from "./header/ApplicationHeader";
import { TopContent } from "./content/topContent/TopContent";
import { TransactionList } from "./content/TransactionList";
import { useFetchTransactions } from "../firebase/transactions/transactionInstances";
import { useFetchTransactionTotal } from "../firebase/transactions/transactionTotals";

export const AuthenticatedApp = () => {
  useFetchTransactions();
  useFetchTransactionTotal();

  return (
    <>
      <ApplicationHeader />
      <ApplicationContainer>
        <TopContent />
        <MainTablesContainer>
          <TransactionList />
        </MainTablesContainer>
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

const MainTablesContainer = emotionStyled.div`
  flex: 1;

  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow: hidden;
`;
