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
import { isEqual } from "lodash";
import {
  defaultIdealPayerShares,
  TransactionData,
} from "../../../business/TransactionData";
import { useIsXcl } from "../../../authentication/authentication";
import { CustomShares } from "../CustomShares";
import {
  addTransaction,
  editTransaction,
} from "../../../firebase/transactions/transactionInstances";
import { ShareRadioGroup, ShareType } from "./ShareRadioGroup";

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

  const [amount, setAmount] = useState<string | undefined>(
    transaction?.totalAmount.toFixed(2)
  );

  const amountError =
    amount !== undefined &&
    (amount.trim() === "" || isNaN(Number(amount)) || Number(amount) <= 0);

  const [date, setDate] = useState(
    transaction
      ? DateTime.fromJSDate(transaction.transactionDate)
      : DateTime.now()
  );

  const [owedShares, setOwedShares] = useState<ShareType>(() => {
    if (!transaction) {
      return isXcl ? "xcl" : "catb";
    }

    if (!isEqual(transaction.idealPayerShares, defaultIdealPayerShares)) {
      return "custom";
    }

    if (
      transaction.actualPayerShares["xcl"] &&
      !transaction.actualPayerShares["catb"]
    ) {
      return "xcl";
    }

    if (
      !transaction.actualPayerShares["xcl"] &&
      transaction.actualPayerShares["catb"]
    ) {
      return "catb";
    }

    return "custom";
  });

  const [actualPayerShares, setActualPayerShares] = useState<
    Record<string, number>
  >(transaction?.actualPayerShares ?? { xcl: 0.5, catb: 0.5 });

  const [idealPayerShares, setIdealPayerShares] = useState<
    Record<string, number>
  >(transaction?.idealPayerShares ?? defaultIdealPayerShares);

  const canSubmit = title && !titleError && amount && !amountError;

  const onSubmit = async () => {
    const editedTransaction = {
      id: transaction?.id ?? crypto.randomUUID(),
      actualPayerShares:
        owedShares === "xcl"
          ? { xcl: 1 }
          : owedShares === "catb"
          ? { catb: 1 }
          : actualPayerShares,
      idealPayerShares:
        owedShares === "custom" ? idealPayerShares : defaultIdealPayerShares,
      addedDate: new Date(),
      transactionDate: date.toJSDate(),
      title: title ?? "Invalid transaction",
      totalAmount: Number(amount),
    };

    try {
      if (transaction) {
        await editTransaction(editedTransaction);
      } else {
        await addTransaction(editedTransaction);
      }
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
        <TextField
          error={amountError}
          label="Amount"
          variant="standard"
          type="number"
          value={amount ?? ""}
          onBlur={() => setAmount((old) => old ?? "")}
          onChange={(event) => setAmount(event.target.value)}
        />
        <DatePicker
          value={date}
          onChange={(newDate) => newDate && setDate(newDate)}
        />
        <ShareRadioGroup
          shareType={owedShares}
          onShareTypeChanged={setOwedShares}
        />
        {owedShares === "custom" && (
          <CustomShares
            defaultActualPayerShares={actualPayerShares}
            defaultIdealPayerShares={idealPayerShares}
            onChange={(actual, ideal) => {
              setActualPayerShares(actual);
              setIdealPayerShares(ideal);
            }}
          />
        )}
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
