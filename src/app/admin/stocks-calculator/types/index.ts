export type FeeDetail = {
  name: string;
  value: number;
};

/** How a cost detail are sent to the view */
export type CostDetailOutput = {
  [k in keyof PrimaryValues["feeDetails"][number]]: string;
};

export type PrimaryValues = {
  unitBuyingPrice: number;
  quantity: number;
  totalBuyingPrice: number;
  buyingFees: number;
  feeDetails: FeeDetail[];
};

/** Primary values that can be changed by the user */
export type PrimaryInputs = Omit<PrimaryValues, "buyingFees" | "feeDetails">;

/* How primary values are sent to the view */
export type PrimaryOutputs = {
  [k in keyof Omit<PrimaryValues, "feeDetails">]: string;
} & { [k in keyof Pick<PrimaryValues, "feeDetails">]: CostDetailOutput[] };

export type TargetValues = {
  totalTarget: number;
  targetPU: number;
  targetPercentage: number;
  unitSellingPrice: number;
  totalSellingPrice: number;
  /** Fees of selling in the target */
  sellingFees: number;
  /** selling fees + buying fees */
  totalFees: number;
  /** Selling fees details */
  feeDetails: FeeDetail[];
  /** Total selling price after/before all fees */
  totalSellingPriceAF: number;
  /** Unit selling price after/before all fees */
  unitSellingPriceAF: number;
};

/** Target values that can be changed by the user */
export type TargetInputs = Omit<
  TargetValues,
  | "sellingFees"
  | "totalFees"
  | "feeDetails"
  | "totalSellingPriceAF"
  | "unitSellingPriceAF"
>;

/**How Target values are sent to the view */
export type TargetOutputs = {
  [k in keyof Omit<TargetValues, "feeDetails">]: string;
} & { [k in keyof Pick<TargetValues, "feeDetails">]: CostDetailOutput[] };

export type State = {
  primaryValues: PrimaryValues;
  profitTargetValues: TargetValues;
  lossTargetValues: TargetValues;
};

export type FeeCalculateParams = {
  /** The total number of shares. Can be fractional */
  amount: number;
  /** The total price of the shares */
  totalPrice: number;
  /** The type of transaction */
  type: "buy" | "sell";
};

export type FeeCalculator = {
  name: string;
  /**
   * Calculate the fee
   */
  calculate: (params: FeeCalculateParams) => number;
};
