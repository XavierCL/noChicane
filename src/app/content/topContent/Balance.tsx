import { sum, uniq } from "lodash";
import { useTransactions } from "../../../firebase/transactions/transactionInstances";
import { useIsXcl } from "../../../authentication/authentication";
import { theme } from "../../../theme/muiTheme";
import emotionStyled from "@emotion/styled";
import { computeBalance } from "../../../business/computeBalance";

export const Balance = () => {
  const isXcl = useIsXcl();
  const { data } = useTransactions();

  const { totalPaid, totalIdeal } = computeBalance(data);

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
