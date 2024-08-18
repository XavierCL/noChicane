import emotionStyled from "@emotion/styled";
import { Balance } from "./Balance";
import { AddNewTransactionButton } from "./AddNewTransactionButton";
import { SortTransactionByButton } from "./SortTransactionByButton";
import { OrderField } from "../../../business/TransactionData";
import { SettingsButton } from "./settings/SettingsButton";

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
        <SettingsButton />
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
