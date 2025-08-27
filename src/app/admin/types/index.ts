export type CostDetail = {
  name: string;
  value: number;
};

export type PrimaryValues = {
  unitBuyingPrice: number;
  quantity: number;
  totalBuyingPrice: number;
  buyingCost: number;
  costDetails: CostDetail[];
};

export type TargetValues = {
  totalTarget: number;
  targetPU: number;
  targetPercentage: number;
  unitSellingPrice: number;
  totalSellingPrice: number;
  /** Cost of selling in the target */
  sellingCost: number;
  /** selling cost + buying cost */
  totalCost: number;
  /** Selling cost details */
  costDetails: CostDetail[];
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
