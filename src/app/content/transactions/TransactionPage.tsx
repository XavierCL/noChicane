import emotionStyled from "@emotion/styled";
import { TopContent } from "./topContent/TopContent";
import { TransactionList } from "./TransactionList";
import { DataContainer } from "./DataContainer";

export const TransactionPage = () => {
  return (
    <>
      <DataContainer />
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
