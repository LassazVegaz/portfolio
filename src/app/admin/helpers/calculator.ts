export type PrimaryValues = {
  unitBuyingPrice: number;
  quantity: number;
  totalBuyingPrice: number;
};

type TargetValues = {
  totalTarget: number;
  targetPU: number;
  targetPercentage: number;
  unitSellingPrice: number;
  totalSellingPrice: number;
};

export type State = {
  primaryValues: PrimaryValues;
  profitTargetValues: TargetValues;
  lossTargetValues: TargetValues;
};

/**
 * Calculate primary values when one of them change.
 * Key is the changed field name.\
 * If unit buying price change, calculate total buying price.
 * If total buying price change, calculate unit buying price.
 * If quantity change, calculate total buying price.\
 * This function modifies the `primaryValues` object directly
 */
export const calculatePrimaryValues: Record<
  keyof PrimaryValues,
  (primaryValues: PrimaryValues) => void
> = {
  unitBuyingPrice: (primaryValues) =>
    (primaryValues.totalBuyingPrice =
      primaryValues.quantity * primaryValues.unitBuyingPrice),
  quantity: (primaryValues) =>
    (primaryValues.totalBuyingPrice =
      primaryValues.quantity * primaryValues.unitBuyingPrice),
  totalBuyingPrice: (primaryValues) =>
    (primaryValues.unitBuyingPrice =
      primaryValues.totalBuyingPrice / primaryValues.quantity),
};

// if a Target Value change, recalculate the expected profit per unit. Expected profit per unit
// is calculated using the changed value
export const calculateExpectedProfitPU: Record<
  keyof TargetValues,
  (changedValue: number, primaryValues: PrimaryValues) => number
> = {
  targetPercentage: (changedValue, primaryValues) =>
    (changedValue * primaryValues.unitBuyingPrice) / 100,
  unitSellingPrice: (changedValue, primaryValues) =>
    changedValue + primaryValues.unitBuyingPrice,
  totalSellingPrice: (changedValue, primaryValues) =>
    changedValue + primaryValues.totalBuyingPrice,
  targetPU: (changedValue) => changedValue,
  totalTarget: (changedValue, primaryValues) =>
    changedValue / primaryValues.quantity,
};

export const calculateTargetProfitValues = (
  primaryValues: PrimaryValues,
  expectedProfitPU: number
): TargetValues => {
  const { unitBuyingPrice, quantity, totalBuyingPrice } = primaryValues;

  const expectedTotalProfit = expectedProfitPU * quantity;

  return {
    targetPU: expectedProfitPU,
    totalTarget: expectedTotalProfit,
    unitSellingPrice: unitBuyingPrice + expectedProfitPU,
    totalSellingPrice: totalBuyingPrice + expectedTotalProfit,
    targetPercentage: (expectedProfitPU / unitBuyingPrice) * 100,
  };
};
