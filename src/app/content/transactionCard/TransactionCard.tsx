import emotionStyled from "@emotion/styled";
import Delete from "@mui/icons-material/Delete";
import { Card, IconButton, Typography } from "@mui/material";
import { mapValues, sum, uniq } from "lodash";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import { useIsXcl } from "../../../authentication/authentication";
import { theme } from "../../../theme/muiTheme";
import { TransactionData } from "../../../business/TransactionData";
import { EditTransactionDialog } from "../EditTransactionDialog";
import { useTransactions } from "../../../firebase/transactions/transactionInstances";

type TransactionCardProps = {
  transaction: TransactionData;
};

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const { title, actualPayers, idealPayerShares } = transaction;

  const { orderField } = useTransactions();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isXcl = useIsXcl();

  const totalAmount = sum(Object.values(actualPayers));
  const totalIdealShares = sum(Object.values(idealPayerShares));

  if (totalAmount <= 0 || totalIdealShares <= 0) {
    console.error("Invalid transaction card", transaction);
    return <TransactionContainer>error</TransactionContainer>;
  }

  const ideals = mapValues(
    idealPayerShares,
    (share) => (totalAmount * share) / totalIdealShares
  );

  const allPayers = uniq([
    ...Object.keys(actualPayers),
    ...Object.keys(ideals),
  ]);

  return (
    <>
      <TransactionContainer>
        <CardLeftSide>
          <TransactionTitle variant="h5">{title}</TransactionTitle>
          <div>
            {Object.entries(actualPayers).map(([payerName, amount]) => {
              if (amount <= 0) return null;

              return (
                <div key={payerName}>
                  {payerName} paid {amount}$
                </div>
              );
            })}
          </div>
          <div>{transaction[orderField].toDateString()}</div>
        </CardLeftSide>
        <CardRightSide>
          <ShareListContainer>
            {allPayers.map((payerName) => {
              const paid = actualPayers[payerName] ?? 0;
              const ideal = ideals[payerName] ?? 0;

              if (paid >= ideal) return null;

              return (
                <div key={payerName}>
                  {payerName} borrowed{" "}
                  <span
                    style={{
                      color:
                        (payerName === "xcl") === isXcl
                          ? theme.palette.error
                          : theme.palette.success,
                    }}
                  >
                    {(ideal - paid).toFixed(2)}$
                  </span>
                </div>
              );
            })}
          </ShareListContainer>
          <CardActions>
            <IconButton onClick={() => setEditOpen(true)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => setConfirmDeleteOpen(true)}>
              <Delete />
            </IconButton>
          </CardActions>
        </CardRightSide>
      </TransactionContainer>
      {confirmDeleteOpen && (
        <ConfirmDeleteDialog
          transaction={transaction}
          onClose={() => setConfirmDeleteOpen(false)}
        />
      )}
      {editOpen && (
        <EditTransactionDialog
          transaction={transaction}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

const TransactionContainer = emotionStyled(Card)`
  width: 100%;
  padding: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: visible;
  gap: 8px;
`;

const CardLeftSide = emotionStyled.div`
  flex: 1;
  min-width: 0;
`;

const TransactionTitle = emotionStyled(Typography)`
  text-overflow: ellipsis;
  text-wrap: nowrap;
  overflow: hidden;
`;

const CardRightSide = emotionStyled.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ShareListContainer = emotionStyled.div`
  display: flex;
  flex-direction: column;
`;

const CardActions = emotionStyled.div`
  flex: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
`;
