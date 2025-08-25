import emotionStyled from "@emotion/styled";
import { TopContent } from "./topContent/TopContent";
import { TransactionList } from "./TransactionList";
import { TransactionDataContainer } from "./TransactionDataContainer";

export const TransactionPage = () => {
  return (
    <>
      <TransactionDataContainer />
      <TopContent />
      <MainTablesContainer>
        <TransactionList />
      </MainTablesContainer>
    </>
  );
};

const MainTablesContainer = emotionStyled.div`
  flex: 1;

  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow: hidden;
`;
