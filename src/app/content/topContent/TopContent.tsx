import emotionStyled from "@emotion/styled";
import { Balance } from "./Balance";
import { AddNewTransactionButton } from "./addNewTransaction/AddNewTransactionButton";
import { OrderField } from "../transactionCard/TransactionCard";
import { SortTransactionByButton } from "./SortTransactionByButton";

type TopContentProps = {
  orderField: OrderField;
  setOrderField: (newOrderField: OrderField) => void;
};

export const TopContent = (orderFieldState: TopContentProps) => {
  return (
    <Container>
      <LeftSideContainer>
        <AddNewTransactionButton />
        <SortTransactionByButton {...orderFieldState} />
      </LeftSideContainer>
      <Balance />
    </Container>
  );
};

const Container = emotionStyled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftSideContainer = emotionStyled.div`
  display: flex;
  flex-direction: row;
`;
