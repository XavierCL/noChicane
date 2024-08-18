import { Button } from "@mui/material";
import { useState } from "react";
import { EditTransactionDialog } from "../EditTransactionDialog";

export const AddNewTransactionButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        style={{ alignSelf: "flex-start", textWrap: "nowrap" }}
        onClick={() => setDialogOpen(true)}
      >
        Add transaction
      </Button>
      {dialogOpen && (
        <EditTransactionDialog onClose={() => setDialogOpen(false)} />
      )}
    </>
  );
};
