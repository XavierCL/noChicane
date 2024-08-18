import emotionStyled from "@emotion/styled";
import { Balance } from "./Balance";
import { AddNewTransactionButton } from "./AddNewTransactionButton";
import { SortTransactionByButton } from "./SortTransactionByButton";
import { SettingsButton } from "./settings/SettingsButton";

export const TopContent = () => (
  <Container>
    <LeftSideContainer>
      <AddNewTransactionButton />
      <SortTransactionByButton />
      <SettingsButton />
    </LeftSideContainer>
    <Balance />
  </Container>
);

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
