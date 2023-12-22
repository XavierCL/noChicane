import { sortBy } from "lodash";
import { useTransactions } from "./useTransactions";
import { TransactionCard, TransactionData } from "./TransactionCard";
import emotionStyled from "@emotion/styled";

type TransactionListProps = {
  sortSelector: (transaction: TransactionData) => number | string | Date;
};

export const TransactionList = ({ sortSelector }: TransactionListProps) => {
  const transactions = useTransactions().data;

  if (!transactions) return <div>loading</div>;

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
`;
