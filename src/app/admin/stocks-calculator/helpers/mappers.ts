import {
  CostDetail,
  CostDetailOutput,
  PrimaryInputs,
  PrimaryOutputs,
  PrimaryValues,
  TargetInputs,
  TargetOutputs,
  TargetValues,
} from "../types";

const mapCostDetail = (c: CostDetail): CostDetailOutput => ({
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
  buyingCost: data.buyingCost.toFixed(2),
  costDetails: data.costDetails.map(mapCostDetail),
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
    sellingCost: data.sellingCost.toFixed(2),
    totalCost: data.totalCost.toFixed(2),
    costDetails: data.costDetails.map(mapCostDetail),
    totalSellingPriceAC: data.totalSellingPriceAC.toFixed(2),
    unitSellingPriceAC: data.unitSellingPriceAC.toFixed(2),
  };

  if (changedField && changedValue) {
    result[changedField] = changedValue;
  }

  return result;
}
