import emotionStyled from "@emotion/styled";
import { Card, Typography } from "@mui/material";
import { mapValues, sum, uniq } from "lodash";

export type TransactionData = {
  id: string;
  transactionDate: Date;
  addedDate: Date;
  totalAmount: number;
  actualPayerShares: Record<string, number>;
  idealPayerShares: Record<string, number>;
  title: string;
};

export const TransactionCard = (transaction: TransactionData) => {
  const {
    title,
    transactionDate,
    totalAmount,
    actualPayerShares,
    idealPayerShares,
  } = transaction;

  const totalActualShares = sum(Object.values(actualPayerShares));
  const totalIdealShares = sum(Object.values(idealPayerShares));

  if (totalActualShares <= 0 || totalIdealShares <= 0) {
    console.error("Invalid transaction card", transaction);
    return <TransactionContainer>error</TransactionContainer>;
  }

  const payers = mapValues(
    actualPayerShares,
    (share) => (totalAmount * share) / totalActualShares
  );

  const ideals = mapValues(
    idealPayerShares,
    (share) => (totalAmount * share) / totalIdealShares
  );

  const allPayers = uniq([...Object.keys(payers), ...Object.keys(ideals)]);

  return (
    <TransactionContainer>
      <CardLeftSide>
        <Typography variant="h5">{title}</Typography>
        <div>
          {Object.entries(payers).map(([payerName, amount]) => {
            if (amount <= 0) return null;

            return (
              <div key={payerName}>
                {payerName} paid {amount}$
              </div>
            );
          })}
        </div>
        <div>{transactionDate.toDateString()}</div>
      </CardLeftSide>
      <ShareListContainer>
        {allPayers.map((payerName) => {
          const paid = payers[payerName] ?? 0;
          const ideal = ideals[payerName] ?? 0;

          if (paid >= ideal) return null;

          return (
            <div key={payerName}>
              {payerName} borrowed {ideal - paid}$
            </div>
          );
        })}
      </ShareListContainer>
    </TransactionContainer>
  );
};

const TransactionContainer = emotionStyled(Card)`
  width: 100%;
  padding: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CardLeftSide = emotionStyled.div``;

const ShareListContainer = emotionStyled.div`
  display: flex;
  flex-direction: column;
`;
