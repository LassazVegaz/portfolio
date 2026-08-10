"use client";

import { formatMoney } from "@/features/money/money";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MoneyLinePoint = { period: string } & Record<string, string | number>;
export type MoneyLineSeries = { key: string; label: string; color: string };
export type MoneyBarPoint = { category: string; actualCents: number; budgetCents: number };

const tooltipStyle = {
  background: "#0f1f1a",
  border: "1px solid rgba(148,163,184,.2)",
  borderRadius: 12,
};

const moneyTooltip = (value: unknown) => [
  formatMoney(Number(value ?? 0)),
  "",
];

export default function MoneyCharts({
  lineData,
  lineSeries,
  barData,
  showLine,
}: Readonly<{
  lineData: MoneyLinePoint[];
  lineSeries: MoneyLineSeries[];
  barData: MoneyBarPoint[];
  showLine: boolean;
}>) {
  const [showBudgets, setShowBudgets] = useState(true);

  return (
    <div className="grid gap-page">
      {showLine && (
        <details open className="admin-panel rounded-admin">
          <summary className="cursor-pointer px-page py-4 font-semibold">
            Money over time
          </summary>
          <div className="h-80 border-t border-admin-line p-page pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
                <XAxis dataKey="period" stroke="#92a79d" fontSize={12} />
                <YAxis
                  stroke="#92a79d"
                  fontSize={12}
                  tickFormatter={(value) => `S$${Math.round(Number(value) / 100)}`}
                />
                <Tooltip formatter={moneyTooltip} contentStyle={tooltipStyle} />
                <Legend />
                {lineSeries.map((series) => (
                  <Line
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    name={series.label}
                    stroke={series.color}
                    strokeWidth={2}
                    dot={lineData.length < 32}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </details>
      )}

      {barData.length > 1 && (
        <details open className="admin-panel rounded-admin">
          <summary className="cursor-pointer px-page py-4 font-semibold">
            Categories versus budget
          </summary>
          <div className="border-t border-admin-line p-page">
            <label className="mb-4 flex items-center gap-2 text-xs text-admin-muted">
              <input
                type="checkbox"
                checked={showBudgets}
                onChange={(event) => setShowBudgets(event.target.checked)}
                className="accent-admin-accent"
              />
              Show budget bars
            </label>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
                  <XAxis dataKey="category" stroke="#92a79d" fontSize={12} />
                  <YAxis
                    stroke="#92a79d"
                    fontSize={12}
                    tickFormatter={(value) => `S$${Math.round(Number(value) / 100)}`}
                  />
                  <Tooltip formatter={moneyTooltip} contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="actualCents" name="Actual" fill="#fb7185" radius={[6, 6, 0, 0]} />
                  {showBudgets && (
                    <Bar dataKey="budgetCents" name="Budget" fill="#6ee7b7" radius={[6, 6, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
