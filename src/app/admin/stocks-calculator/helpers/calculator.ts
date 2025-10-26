import {
  PrimaryInputs,
  PrimaryValues,
  TargetInputs,
  TargetValues,
} from "../types";
import calculateFees from "./fee-calculators";

class Calculator {
  private readonly n: number;

  private readonly targetPUCalculators: Record<
    keyof TargetInputs,
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
    changedFieldName: keyof TargetInputs,
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
    const {
      unitBuyingPrice,
      quantity,
      totalBuyingPrice,
      buyingFees: buyingCost,
    } = primaryValues;

    const totalTarget = targetPU * quantity;
    const totalSellingPrice = totalBuyingPrice + totalTarget * this.n;
    const sellingCost = calculateFees(quantity, totalSellingPrice);
    const totalCost = buyingCost + sellingCost.totalFees;
    const totalSellingPriceAC = totalSellingPrice + totalCost;

    return {
      targetPU,
      totalTarget,
      unitSellingPrice: unitBuyingPrice + targetPU * this.n,
      totalSellingPrice: totalSellingPrice,
      targetPercentage: (targetPU / unitBuyingPrice) * 100,
      feeDetails: sellingCost.details,
      sellingFees: sellingCost.totalFees,
      totalFees: totalCost,
      totalSellingPriceAF: totalSellingPriceAC,
      unitSellingPriceAF: totalSellingPriceAC / quantity,
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
export const primaryValuesCalculator: Record<
  keyof PrimaryInputs,
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

export const calculatePrimaryValues = (
  changedField: keyof PrimaryInputs,
  primaryValues: PrimaryValues
) => {
  primaryValuesCalculator[changedField](primaryValues);
  const cost = calculateFees(
    primaryValues.quantity,
    primaryValues.totalBuyingPrice
  );
  primaryValues.buyingFees = cost.totalFees;
  primaryValues.feeDetails = cost.details;
};
