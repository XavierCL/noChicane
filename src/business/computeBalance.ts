import { sum } from "lodash";

export const computeBalance = (
  transactions: readonly Readonly<{
    totalAmount: number;
    actualPayerShares: Record<string, number>;
    idealPayerShares: Record<string, number>;
  }>[]
) => {
  const totalPaid: Record<string, number> = {};
  const totalIdeal: Record<string, number> = {};

  for (const transaction of transactions) {
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

  return { totalPaid, totalIdeal };
};
