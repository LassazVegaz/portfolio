export type CostDetail = {
  name: string;
  value: number;
};

/** How a cost detail are sent to the view */
export type CostDetailOutput = {
  [k in keyof PrimaryValues["costDetails"][number]]: string;
};

export type PrimaryValues = {
  unitBuyingPrice: number;
  quantity: number;
  totalBuyingPrice: number;
  buyingCost: number;
  costDetails: CostDetail[];
};

/** Primary values that can be changed by the user */
export type PrimaryInputs = Omit<PrimaryValues, "buyingCost" | "costDetails">;

/* How primary values are sent to the view */
export type PrimaryOutputs = {
  [k in keyof Omit<PrimaryValues, "costDetails">]: string;
} & { [k in keyof Pick<PrimaryValues, "costDetails">]: CostDetailOutput[] };

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
  /** Total selling price after/before all costs */
  totalSellingPriceAC: number;
  /** Unit selling price after/before all costs */
  unitSellingPriceAC: number;
};

/** Target values that can be changed by the user */
export type TargetInputs = Omit<
  TargetValues,
  | "sellingCost"
  | "totalCost"
  | "costDetails"
  | "totalSellingPriceAC"
  | "unitSellingPriceAC"
>;

/**How Target values are sent to the view */
export type TargetOutputs = {
  [k in keyof Omit<TargetValues, "costDetails">]: string;
} & { [k in keyof Pick<TargetValues, "costDetails">]: CostDetailOutput[] };

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
