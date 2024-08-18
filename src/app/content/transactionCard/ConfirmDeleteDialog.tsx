import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { deleteTransaction } from "../../../firebase/transactions/transactionInstances";
import { writeBatch } from "firebase/firestore/lite";
import { database } from "../../../firebase/config";
import { deleteTotal } from "../../../firebase/transactions/transactionTotals";
import { TransactionData } from "../../../business/TransactionData";

type ConfirmDeleteDialogProps = {
  transaction: TransactionData;
  onClose: () => void;
};

export const ConfirmDeleteDialog = ({
  transaction,
  onClose,
}: ConfirmDeleteDialogProps) => {
  const onConfirm = async () => {
    try {
      const batch = writeBatch(database);
      deleteTransaction(transaction.id, batch);
      deleteTotal(transaction, batch);
      await batch.commit();
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Do you really want to delete this transaction?</DialogTitle>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
