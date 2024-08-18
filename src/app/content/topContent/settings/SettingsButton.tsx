import { IconButton } from "@mui/material";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { SettingsDialog } from "./SettingsDialog";

export const SettingsButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setDialogOpen(true)}>
        <SettingsIcon />
      </IconButton>
      {dialogOpen && <SettingsDialog onClose={() => setDialogOpen(false)} />}
    </>
  );
};
