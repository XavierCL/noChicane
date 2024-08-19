import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import emotionStyled from "@emotion/styled";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useState } from "react";
import { isEmpty, isEqual, mapValues, pickBy, sum } from "lodash";
import {
  defaultIdealPayerShares,
  TransactionData,
} from "../../business/TransactionData";
import { useIsXcl } from "../../authentication/authentication";
import {
  addTransaction,
  editTransaction,
} from "../../firebase/transactions/transactionInstances";
import { writeBatch } from "firebase/firestore/lite";
import { database } from "../../firebase/config";
import {
  addTotal,
  editTotal,
} from "../../firebase/transactions/transactionTotals";

type EditTransactionDialogProps = {
  transaction?: TransactionData;
  onClose: () => void;
};

export const EditTransactionDialog = ({
  transaction,
  onClose,
}: EditTransactionDialogProps) => {
  const isXcl = useIsXcl();

  const [title, setTitle] = useState<string | undefined>(transaction?.title);
  const titleError = title !== undefined && title.trim() === "";

  const [date, setDate] = useState(
    transaction
      ? DateTime.fromJSDate(transaction.transactionDate)
      : DateTime.now()
  );

  const [actualPayers, setActualPayers] = useState<Record<string, string>>(
    transaction
      ? mapValues(transaction.actualPayers, (value) => value.toFixed(2))
      : {}
  );

  const actualPayersError =
    isEmpty(actualPayers) ||
    Object.values(actualPayers).some(
      (value) =>
        value.trim() === "" || isNaN(Number(value)) || Number(value) <= 0
    );

  const [showAllPayers, setShowAllPayers] = useState(() => {
    if (!transaction) return false;

    return (
      Object.keys(pickBy(transaction.actualPayers, (value) => value > 0))
        .length >= 2
    );
  });

  const shownPayers = (() => {
    if (!showAllPayers) {
      return isXcl ? ["xcl"] : ["catb"];
    }

    return isXcl ? ["xcl", "catb"] : ["catb", "xcl"];
  })();

  const [idealPayerShares, setIdealPayerShares] = useState<
    Record<string, number>
  >(transaction?.idealPayerShares ?? defaultIdealPayerShares);

  const [showIdealShares, setShowIdealShares] = useState(() =>
    isEqual(idealPayerShares, defaultIdealPayerShares)
  );

  const canSubmit =
    title && !titleError && sum(Object.values(actualPayers)) > 0;

  const onSubmit = async () => {
    const editedTransaction: TransactionData = {
      id: transaction?.id ?? crypto.randomUUID(),
      actualPayers: pickBy(
        mapValues(actualPayers, (value) => Number(value)),
        (value) => value > 0
      ),
      idealPayerShares: pickBy(idealPayerShares, (value) => value > 0),
      addedDate: new Date(),
      transactionDate: date.toJSDate(),
      title: title ?? "Invalid transaction",
    };

    try {
      const batch = writeBatch(database);
      if (transaction) {
        editTransaction(editedTransaction, batch);
        editTotal(transaction, editedTransaction, batch);
      } else {
        addTransaction(editedTransaction, batch);
        addTotal(editedTransaction, batch);
      }
      await batch.commit();
    } catch (error) {
      console.error("Error while editing transaction", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} disableRestoreFocus>
      <DialogTitle>
        {transaction ? "Edit transaction" : "Add new transaction"}
      </DialogTitle>
      <TransactionDialogContent>
        <TextField
          autoFocus
          error={titleError}
          label="Title"
          variant="standard"
          value={title ?? ""}
          onBlur={() => setTitle((old) => old ?? "")}
          onChange={(event) => setTitle(event.target.value)}
        />
        <DatePicker
          value={date}
          onChange={(newDate) => newDate && setDate(newDate)}
        />
        {shownPayers.map((payer) => (
          <TextField
            error={actualPayersError}
            label={`${payer} paid`}
            variant="standard"
            type="number"
            value={actualPayers[payer] ?? ""}
            onBlur={() =>
              setActualPayers((old) => ({ ...old, payer: old[payer] ?? "" }))
            }
            onChange={(event) =>
              setActualPayers((old) => ({ ...old, payer: event.target.value }))
            }
          />
        ))}
        <Button>Add payers</Button>
        <Button>Change ideal shares</Button>
      </TransactionDialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit();
            onClose();
          }}
        >
          {transaction ? "Edit" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TransactionDialogContent = emotionStyled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
