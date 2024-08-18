import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type ConfirmDeleteDialogProps = {
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmDeleteDialog = ({
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) => (
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
