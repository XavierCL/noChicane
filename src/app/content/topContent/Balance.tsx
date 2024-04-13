import { sum, uniq } from "lodash";
import { useTransactions } from "../../../firebase/transactions";
import { useIsXcl } from "../../../authentication/authentication";
import { theme } from "../../../theme/muiTheme";
import emotionStyled from "@emotion/styled";

export const Balance = () => {
  const isXcl = useIsXcl();
  const { data } = useTransactions();

  const totalPaid: Record<string, number> = {};
  const totalIdeal: Record<string, number> = {};

  for (const transaction of data) {
    const { totalAmount, actualPayerShares, idealPayerShares } = transaction;
    const totalPayerShares = sum(Object.values(actualPayerShares));
    const totalIdealShares = sum(Object.values(idealPayerShares));

    if (totalPayerShares <= 0 || totalIdealShares <= 0) {
      console.error("Invalid transaction", transaction);
      continue;
    }

    for (const [actualPayer, actualShare] of Object.entries(
      actualPayerShares
    )) {
      if (actualShare <= 0) continue;

      const amountPaid = (totalAmount * actualShare) / totalPayerShares;

      totalPaid[actualPayer] = (totalPaid[actualPayer] ?? 0) + amountPaid;
    }

    for (const [idealPayer, idealShare] of Object.entries(idealPayerShares)) {
      if (idealShare <= 0) continue;

      const idealAmount = (totalAmount * idealShare) / totalIdealShares;

      totalIdeal[idealPayer] = (totalIdeal[idealPayer] ?? 0) + idealAmount;
    }
  }

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
