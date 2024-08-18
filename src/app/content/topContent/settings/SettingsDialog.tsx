import { CircularProgress, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { executeMigration } from "../../../../firebase/migration";

type SettingsDialogProps = {
  onClose: () => void;
};

export const SettingsDialog = ({ onClose }: SettingsDialogProps) => {
  const [migrationLoading, setMigrationLoading] = useState(false);

  const onMigrationClick = async () => {
    if (migrationLoading) return;

    setMigrationLoading(true);
    await executeMigration();
    setMigrationLoading(false);
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Button
          variant="outlined"
          disabled={migrationLoading}
          onClick={onMigrationClick}
        >
          Migrate data {migrationLoading && <CircularProgress />}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
