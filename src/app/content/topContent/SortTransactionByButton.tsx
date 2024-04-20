import { useRef, useState } from "react";
import { OrderField } from "../transactionCard/TransactionCard";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import emotionStyled from "@emotion/styled";

const SORT_OPTIONS: { field: OrderField; label: string }[] = [
  { field: "transactionDate", label: "Transaction date" },
  { field: "addedDate", label: "Added date" },
];

type SortTransactionByButtonProps = {
  orderField: OrderField;
  setOrderField: (newOrderField: OrderField) => void;
};

export const SortTransactionByButton = ({
  orderField,
  setOrderField,
}: SortTransactionByButtonProps) => {
  const [isOpen, setOpen] = useState(false);
  const anchorElement = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <IconButton onClick={() => setOpen(true)} ref={anchorElement}>
        <KeyboardArrowDownIcon />
      </IconButton>
      <Popper
        open={isOpen}
        anchorEl={anchorElement.current}
        placement="bottom-start"
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList>
                  {SORT_OPTIONS.map(({ field, label }) => (
                    <SelectableMenuItem
                      key={field}
                      selected={field === orderField}
                      onClick={() => {
                        setOrderField(field);
                        setOpen(false);
                      }}
                    >
                      {label}
                    </SelectableMenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const SelectableMenuItem = emotionStyled(MenuItem)<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? "#3F3F3F" : "inherit")}
`;
