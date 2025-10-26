import { FeeCalculateParams, FeeCalculator, FeeDetail } from "../types";

export const feeCalculators: FeeCalculator[] = [
  {
    name: "Platform fees",
    calculate: (p) => {
      const max = 0.99;
      const cost = p.amount < 1 ? p.totalPrice * (0.99 / 100) : 0.99;
      return cost > max ? max : cost;
    },
  },
  {
    name: "Settlement fees",
    calculate: (p) => {
      if (p.amount < 1) return 0;

      const max = 0.01 * p.totalPrice;
      const cost = 0.003 * p.amount;
      return cost > max ? max : cost;
    },
  },
  {
    name: "Trading Activity Fees",
    calculate: (p) => {
      if (p.amount < 1 || p.type !== "sell") return 0;

      const max = 8.3,
        min = 0.01;

      const cost = 0.000166 * p.amount;
      return cost < min ? min : cost > max ? max : cost;
    },
  },
  {
    name: "Consolidated Audit Trail Fee",
    calculate: (p) => 0.0000265 * p.amount,
  },
];

const calculateTax = (totalFees: number) => {
  const taxRate = 0.09;
  return totalFees * taxRate;
};

export default function calculateFees(params: FeeCalculateParams) {
  const details: FeeDetail[] = [];
  let totalFees = 0;

  for (const calculator of feeCalculators) {
    const fee = calculator.calculate(params);
    if (fee > 0) {
      details.push({ name: calculator.name, value: fee });
      totalFees += fee;
    }
  }

  const tax = calculateTax(totalFees);
  details.push({ name: "GST", value: tax });
  totalFees += tax;

  return {
    totalFees,
    details,
  };
}
