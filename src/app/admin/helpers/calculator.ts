import { PrimaryValues, TargetValues } from "../types";

class Calculator {
  private readonly n: number;

  private readonly targetPUCalculators: Record<
    keyof TargetValues,
    (changedValue: number, primaryValues: PrimaryValues) => number
  > = {
    targetPercentage: (changedValue, primaryValues) =>
      (changedValue * primaryValues.unitBuyingPrice) / 100,
    unitSellingPrice: (changedValue, primaryValues) =>
      (changedValue - primaryValues.unitBuyingPrice) * this.n,
    totalSellingPrice: (changedValue, primaryValues) =>
      ((changedValue - primaryValues.totalBuyingPrice) * this.n) /
      primaryValues.quantity,
    targetPU: (changedValue) => changedValue,
    totalTarget: (changedValue, primaryValues) =>
      changedValue / primaryValues.quantity,
  };

  constructor(type: "profit" | "loss") {
    this.n = type === "profit" ? 1 : -1;
  }

  calculateTargetPU(
    changedFieldName: keyof TargetValues,
    changedValue: number,
    primaryValues: PrimaryValues
  ): number {
    const calculator = this.targetPUCalculators[changedFieldName];
    return calculator(changedValue, primaryValues);
  }

  calculateTargetValues(
    primaryValues: PrimaryValues,
    targetPU: number
  ): TargetValues {
    const { unitBuyingPrice, quantity, totalBuyingPrice } = primaryValues;

    const totalTarget = targetPU * quantity;

    return {
      targetPU,
      totalTarget,
      unitSellingPrice: unitBuyingPrice + targetPU * this.n,
      totalSellingPrice: totalBuyingPrice + totalTarget * this.n,
      targetPercentage: (targetPU / unitBuyingPrice) * 100,
    };
  }
}

export const bearableLossCalculator = new Calculator("loss");
export const expectedProfitCalculator = new Calculator("profit");

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
