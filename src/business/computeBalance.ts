import { sum } from "lodash";

export const computeBalance = (
  transactions: readonly Readonly<{
    actualPayers: Record<string, number>;
    idealPayerShares: Record<string, number>;
    rollback?: boolean;
  }>[]
) => {
  const totalPaid: Record<string, number> = {};
  const totalIdeal: Record<string, number> = {};

  for (const transaction of transactions) {
    const { actualPayers, idealPayerShares, rollback } = transaction;
    const totalPayed = sum(Object.values(actualPayers));
    const totalIdealShares = sum(Object.values(idealPayerShares));
    const rollbackSign = rollback ? -1 : 1;

    for (const [actualPayer, actualPaid] of Object.entries(actualPayers)) {
      totalPaid[actualPayer] =
        (totalPaid[actualPayer] ?? 0) + actualPaid * rollbackSign;
    }

    for (const [idealPayer, idealShare] of Object.entries(idealPayerShares)) {
      const idealAmount = (totalPayed * idealShare) / totalIdealShares;

      totalIdeal[idealPayer] =
        (totalIdeal[idealPayer] ?? 0) + idealAmount * rollbackSign;
    }
  }

  return { totalPaid, totalIdeal };
};
