import emotionStyled from "@emotion/styled";
import { Balance } from "./Balance";
import { AddNewTransactionButton } from "./addNewTransaction/AddNewTransactionButton";

export const TopContent = () => {
  return (
    <Container>
      <AddNewTransactionButton />
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
