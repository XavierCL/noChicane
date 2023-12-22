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
import { useAuthentication } from "../../../authentication/authentication";
import emotionStyled from "@emotion/styled";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

type AddNewTransactionDialogProps = {
  onClose: () => void;
};

export const AddNewTransactionDialog = ({
  onClose,
}: AddNewTransactionDialogProps) => {
  const user = useAuthentication();
  const isXcl = user.uid === "CjpvbFe7Uod443sLQdkUMDhtgXD2";

  const addTransaction = () => {};

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add new transaction</DialogTitle>
      <TransactionDialogContent>
        <TextField label="Title" autoFocus variant="standard" />
        <TextField label="Amount" autoFocus variant="standard" type="number" />
        <DatePicker defaultValue={DateTime.now()} />
        <RadioGroup defaultValue={isXcl ? "xcl" : "catb"}>
          {isXcl && (
            <FormControlLabel
              value="xcl"
              control={<Radio />}
              label="xcl paid (2/3)"
            />
          )}
          {!isXcl && (
            <FormControlLabel
              value="catb"
              control={<Radio />}
              label="catb paid (1/3)"
            />
          )}
          <FormControlLabel value="custom" control={<Radio />} label="custom" />
        </RadioGroup>
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
          onClick={() => {
            addTransaction();
            onClose();
          }}
        >
          Add
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
