import { FeeCalculator, FeeDetail } from "../types";

export const feeCalculators: FeeCalculator[] = [
  {
    name: "Platform fees",
    calculate: (amount: number, totalPrice: number) => {
      const max = 0.99;
      const cost = amount < 1 ? totalPrice * (0.99 / 100) : 0.99;
      return cost > max ? max : cost;
    },
  },
  {
    name: "Settlement fees",
    calculate: (amount: number, totalPrice: number) => {
      if (amount < 1) return 0;

      const max = 0.01 * totalPrice;
      const cost = 0.003 * amount;
      return cost > max ? max : cost;
    },
  },
  {
    name: "Trading Activity Fees",
    calculate: (amount: number) => {
      if (amount < 1) return 0;

      const max = 8.3,
        min = 0.01;

      const cost = 0.000166 * amount;
      return cost < min ? min : cost > max ? max : cost;
    },
  },
  {
    name: "Consolidated Audit Trail Fee",
    calculate: (amount: number) => 0.0000265 * amount,
  },
];

const calculateTax = (totalFees: number) => {
  const taxRate = 0.09;
  return totalFees * taxRate;
};

export default function calculateFees(amount: number, totalPrice: number) {
  const details: FeeDetail[] = [];
  let totalFees = 0;

  for (const calculator of feeCalculators) {
    const fee = calculator.calculate(amount, totalPrice);
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
