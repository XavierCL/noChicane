import { createFamily } from "#/firebase/families/families";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigateToFamily } from "../familyNavigation";

type CreateFamilyDialogProps = {
  onClose: () => void;
};

export const CreateFamilyDialog = ({ onClose }: CreateFamilyDialogProps) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const nameError = name !== undefined && name.trim() === "";
  const navigateToFamily = useNavigateToFamily();

  return (
    <Dialog open={true} onClose={onClose} disableRestoreFocus>
      <DialogTitle>Create family</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={nameError}
          label="Name"
          variant="standard"
          value={name ?? ""}
          onBlur={() => setName((old) => old ?? "")}
          onChange={(event) => setName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!name) return;
            const newFamilyData = createFamily(name);
            navigateToFamily(newFamilyData.id);
            onClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
