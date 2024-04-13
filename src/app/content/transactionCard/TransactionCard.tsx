import emotionStyled from "@emotion/styled";
import Delete from "@mui/icons-material/Delete";
import { Card, IconButton, Typography } from "@mui/material";
import { mapValues, sum, uniq } from "lodash";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useState } from "react";
import { deleteTransaction } from "../../../firebase/transactions";
import Edit from "@mui/icons-material/Edit";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { useIsXcl } from "../../../authentication/authentication";
import { theme } from "../../../theme/muiTheme";

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
    id,
    title,
    transactionDate,
    totalAmount,
    actualPayerShares,
    idealPayerShares,
  } = transaction;

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isXcl = useIsXcl();

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
    <>
      <TransactionContainer>
        <CardLeftSide>
          <TransactionTitle variant="h5">{title}</TransactionTitle>
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
        <CardRightSide>
          <ShareListContainer>
            {allPayers.map((payerName) => {
              const paid = payers[payerName] ?? 0;
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
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={() =>
            deleteTransaction(id).catch((error) =>
              console.error("Error deleting transaction", error)
            )
          }
        />
      )}
      {editOpen && (
        <EditTransactionDialog
          onClose={() => setEditOpen(false)}
          transaction={transaction}
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
