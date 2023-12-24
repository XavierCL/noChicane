import { Button } from "@mui/material";
import { useState } from "react";
import { AddNewTransactionDialog } from "./AddNewTransactionDialog";

export const AddNewTransactionButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        style={{ alignSelf: "flex-start" }}
        onClick={() => setDialogOpen(true)}
      >
        Add transaction
      </Button>
      {dialogOpen && (
        <AddNewTransactionDialog onClose={() => setDialogOpen(false)} />
      )}
    </>
  );
};
