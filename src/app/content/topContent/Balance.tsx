import { uniq } from "lodash";
import { useIsXcl } from "../../../authentication/authentication";
import { theme } from "../../../theme/muiTheme";
import emotionStyled from "@emotion/styled";
import { useTransactionTotal } from "../../../firebase/transactions/transactionTotals";
import { CircularProgress } from "@mui/material";

export const Balance = () => {
  const isXcl = useIsXcl();
  const { data, loadingVersion } = useTransactionTotal();

  if (loadingVersion) {
    return <CircularProgress />;
  }

  if (!data) {
    return "error";
  }

  const { totalPaid, totalIdeal } = data;

  const allPayers = uniq([
    ...Object.keys(totalPaid),
    ...Object.keys(totalIdeal),
  ]);

  return (
    <div>
      {allPayers.map((payerName) => {
        const amountPaid = totalPaid[payerName] ?? 0;
        const idealAmount = totalIdeal[payerName] ?? 0;

        if (amountPaid >= idealAmount) return null;

        return (
          <BalanceContainer key={payerName}>
            {payerName} owes{" "}
            <span
              style={{
                color:
                  (payerName === "xcl") === isXcl
                    ? theme.palette.error
                    : theme.palette.success,
              }}
            >
              {(idealAmount - amountPaid).toFixed(2)}$
            </span>
          </BalanceContainer>
        );
      })}
    </div>
  );
};

const BalanceContainer = emotionStyled.div`
  text-align: right;
`;
