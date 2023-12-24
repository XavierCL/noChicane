import { sortBy } from "lodash";
import {
  TransactionCard,
  TransactionData,
} from "./transactionCard/TransactionCard";
import emotionStyled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import { useTransactions } from "../../firebase/transactions";

type TransactionListProps = {
  sortSelector: (transaction: TransactionData) => number | string | Date;
};

export const TransactionList = ({ sortSelector }: TransactionListProps) => {
  const { data: transactions, loading } = useTransactions();

  if (loading) return <CircularProgress />;

  const sortedTransactions = sortBy(transactions, sortSelector);

  return (
    <TableContainer>
      {sortedTransactions.map((transaction) => (
        <TransactionCard key={transaction.id} {...transaction} />
      ))}
    </TableContainer>
  );
};

const TableContainer = emotionStyled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;
