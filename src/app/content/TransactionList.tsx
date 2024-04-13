import { TransactionCard } from "./transactionCard/TransactionCard";
import emotionStyled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import { useTransactions } from "../../firebase/transactions";

export const TransactionList = () => {
  const { data: transactions, loadingVersion: loading } = useTransactions();

  if (loading) return <CircularProgress />;

  return (
    <TableContainer>
      {transactions.map((transaction) => (
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
