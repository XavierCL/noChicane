import emotionStyled from "@emotion/styled";
import { Card } from "@mui/material";

export type TransactionData = {
  id: string;
  transactionDate: Date;
  addedDate: Date;
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
};

export const TransactionCard = ({
  addedDate,
  transactionDate,
  totalAmount,
  actualPayerShares,
  idealPayerShares,
}: TransactionData) => (
  <TransactionContainer>
    <div>{totalAmount}$</div>
    <div>{addedDate.toISOString()}</div>
    <div>{transactionDate.toISOString()}</div>
    <ShareListContainer>
      {Object.entries(actualPayerShares).map(([key, value]) => (
        <ShareContainer key={key}>
          <div>{key}</div>
          <div>{value}</div>
        </ShareContainer>
      ))}
    </ShareListContainer>
    <ShareListContainer>
      {Object.entries(idealPayerShares).map(([key, value]) => (
        <ShareContainer key={key}>
          <div>{key}</div>
          <div>{value}</div>
        </ShareContainer>
      ))}
    </ShareListContainer>
  </TransactionContainer>
);

const TransactionContainer = emotionStyled(Card)``;

const ShareListContainer = emotionStyled.div`
  display: flex;
  flex-direction: column;
`;

const ShareContainer = emotionStyled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
