export type PrimaryValues = {
  unitBuyingPrice: number;
  quantity: number;
  totalBuyingPrice: number;
};

export type TargetValues = {
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
