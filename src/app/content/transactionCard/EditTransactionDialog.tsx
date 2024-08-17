import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import emotionStyled from "@emotion/styled";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useState } from "react";
import { TransactionData } from "./TransactionCard";
import { useIsXcl } from "../../../authentication/authentication";
import { editTransaction } from "../../../firebase/transactions";
import { CustomShares } from "../CustomShares";
import { sum } from "lodash";
import { defaultIdealPayerShares } from "../DefaultIdealPayerShares";

type AddNewTransactionDialogProps = {
  transaction: TransactionData;
  onClose: () => void;
};

export const EditTransactionDialog = ({
  transaction,
  onClose,
}: AddNewTransactionDialogProps) => {
  const isXcl = useIsXcl();

  const [title, setTitle] = useState<string>(transaction.title);
  const titleError = title !== undefined && title.trim() === "";

  const [amount, setAmount] = useState<string>(
    transaction.totalAmount.toFixed(2)
  );

  const amountError =
    amount !== undefined &&
    (amount.trim() === "" || isNaN(Number(amount)) || Number(amount) <= 0);

  const [date, setDate] = useState(
    DateTime.fromJSDate(transaction.transactionDate)
  );

  const [owedShares, setOwedShares] = useState("custom");

  const [actualPayerShares, setActualPayerShares] = useState<
    Record<string, number>
  >(transaction.actualPayerShares);

  const [idealPayerShares, setIdealPayerShares] = useState<
    Record<string, number>
  >(transaction.idealPayerShares);

  const canSubmit = title && !titleError && amount && !amountError;

  const onEdit = () => {
    editTransaction({
      id: transaction.id,
      actualPayerShares:
        owedShares === "xcl"
          ? { xcl: 1 }
          : owedShares === "custom"
          ? actualPayerShares
          : { catb: 1 },
      idealPayerShares:
        owedShares === "custom" ? idealPayerShares : defaultIdealPayerShares,
      addedDate: new Date(),
      transactionDate: date.toJSDate(),
      title: title ?? "",
      totalAmount: Number(amount),
    }).catch((error) => console.error("Error while adding transaction", error));
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add new transaction</DialogTitle>
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
        <RadioGroup
          value={owedShares}
          onChange={(event) => setOwedShares(event.target.value)}
        >
          {isXcl && (
            <FormControlLabel
              value="xcl"
              control={<Radio />}
              label={`xcl paid (${defaultIdealPayerShares.xcl}/${sum(
                Object.values(defaultIdealPayerShares)
              )})`}
            />
          )}
          {!isXcl && (
            <FormControlLabel
              value="catb"
              control={<Radio />}
              label={`catb paid (${defaultIdealPayerShares.catb}/${sum(
                Object.values(defaultIdealPayerShares)
              )})`}
            />
          )}
          <FormControlLabel value="custom" control={<Radio />} label="custom" />
        </RadioGroup>
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
            onEdit();
            onClose();
          }}
        >
          Edit
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
