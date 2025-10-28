import {
  FeeDetail,
  CostDetailOutput,
  PrimaryInputs,
  PrimaryOutputs,
  PrimaryValues,
  TargetInputs,
  TargetOutputs,
  TargetValues,
} from "../types";

const mapCostDetail = (c: FeeDetail): CostDetailOutput => ({
  name: c.name,
  value: c.value.toFixed(2),
});

/**
 * Map `PrimaryValues` to `PrimaryOutputs`
 */
export const primaryMapper = (
  data: PrimaryValues,
  changedField: keyof PrimaryInputs,
  changedValue: string
): PrimaryOutputs => ({
  unitBuyingPrice: data.unitBuyingPrice.toFixed(2),
  quantity: data.quantity.toString(),
  totalBuyingPrice: data.totalBuyingPrice.toFixed(2),
  buyingFees: data.buyingFees.toFixed(2),
  feeDetails: data.feeDetails.map(mapCostDetail),
  [changedField]: changedValue,
});

/**
 * Map `TargetValues` to `TargetOutputs`
 */
export function targetMapper(data: TargetValues): TargetOutputs;

/**
 * Map `TargetValues` to `TargetOutputs`
 */
export function targetMapper(
  data: TargetValues,
  changedField: keyof TargetInputs,
  changedValue: string
): TargetOutputs;

/**
 * Map `TargetValues` to `TargetOutputs`
 */
export function targetMapper(
  data: TargetValues,
  changedField?: keyof TargetInputs,
  changedValue?: string
): TargetOutputs {
  const result: TargetOutputs = {
    totalTarget: data.totalTarget.toFixed(2),
    targetPU: data.targetPU.toFixed(2),
    targetPercentage: data.targetPercentage.toString(),
    unitSellingPrice: data.unitSellingPrice.toFixed(2),
    totalSellingPrice: data.totalSellingPrice.toFixed(2),
    sellingFees: data.sellingFees.toFixed(2),
    totalFees: data.totalFees.toFixed(2),
    feeDetails: data.feeDetails.map(mapCostDetail),
    totalSellingPriceAF: data.totalSellingPriceAF.toFixed(2),
    unitSellingPriceAF: data.unitSellingPriceAF.toFixed(2),
  };

  if (changedField && changedValue) {
    result[changedField] = changedValue;
  }

  return result;
}
