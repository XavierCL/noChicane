import { OrderField, TransactionCard } from "./transactionCard/TransactionCard";
import emotionStyled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import { useTransactions } from "../../firebase/transactions";
import { orderBy } from "lodash";

type TransactionListProps = {
  orderField: OrderField;
};

export const TransactionList = ({ orderField }: TransactionListProps) => {
  const { data: transactions, loadingVersion: loading } = useTransactions();

  if (loading) return <CircularProgress />;

  const sortedTransactions = orderBy(transactions, orderField, "desc");

  return (
    <TableContainer>
      {sortedTransactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          orderField={orderField}
        />
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
