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

export type CostCalculator = {
  name: string;
  /**
   * Calculate the fee
   * @param amount Total number of shares. Can be fractional
   * @param totalPrice The total price of the transaction
   * @returns The fee
   */
  calculate: (amount: number, totalPrice: number) => number;
};
