import { TransactionCard } from "./transactionCard/TransactionCard";
import emotionStyled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import {
  fetchMoreTransactions,
  useTransactions,
} from "../../firebase/transactions/transactionInstances";
import { orderBy } from "lodash";
import { useRef } from "react";

const INFINITE_SCROLL_OFFSET = 30;

export const TransactionList = () => {
  const {
    data: transactions,
    loadingVersion: loading,
    orderField,
  } = useTransactions();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const sortedTransactions = orderBy(transactions, orderField, "desc");

  const onScroll = () => {
    if (!tableContainerRef.current) return;

    if (
      tableContainerRef.current.scrollTop >=
      tableContainerRef.current.scrollHeight -
        tableContainerRef.current.offsetHeight -
        INFINITE_SCROLL_OFFSET
    ) {
      fetchMoreTransactions();
    }
  };

  return (
    <TableContainer ref={tableContainerRef} onScroll={onScroll}>
      {sortedTransactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : null}
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

const LoadingContainer = emotionStyled.div`
  min-height: 48px;
  max-height: 48px;
  text-align: center;
`;
