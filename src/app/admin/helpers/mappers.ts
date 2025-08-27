import {
  CostDetail,
  CostDetailOutput,
  PrimaryOutputs,
  PrimaryValues,
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
export const primaryMapper = (data: PrimaryValues): PrimaryOutputs => ({
  unitBuyingPrice: data.unitBuyingPrice.toFixed(2),
  quantity: data.quantity.toString(),
  totalBuyingPrice: data.totalBuyingPrice.toFixed(2),
  buyingCost: data.buyingCost.toFixed(2),
  costDetails: data.costDetails.map(mapCostDetail),
});

/**
 * Map `TargetValues` to `TargetOutputs`
 */
export const targetMapper = (data: TargetValues): TargetOutputs => ({
  totalTarget: data.totalTarget.toFixed(2),
  targetPU: data.targetPU.toFixed(2),
  targetPercentage: data.targetPercentage.toString(),
  unitSellingPrice: data.unitSellingPrice.toFixed(2),
  totalSellingPrice: data.totalSellingPrice.toFixed(2),
  sellingCost: data.sellingCost.toFixed(2),
  totalCost: data.totalCost.toFixed(2),
  costDetails: data.costDetails.map(mapCostDetail),
  totalSellingPriceAC: data.totalSellingPriceAC.toFixed(2),
});
