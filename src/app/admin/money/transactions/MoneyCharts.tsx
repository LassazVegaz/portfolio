"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyPoint = { month: string; income: number; expense: number };
type CategoryPoint = { category: string; expense: number };

export default function MoneyCharts({
  monthly,
  categories,
}: {
  monthly: MonthlyPoint[];
  categories: CategoryPoint[];
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="admin-panel rounded-2xl p-5">
        <h2 className="font-semibold">Cash flow by month</h2>
        <p className="mt-1 text-xs text-slate-400">Income versus expenses</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value) => [`S$${Number(value ?? 0).toFixed(2)}`, ""]} contentStyle={{ background: "#0f1f1a", border: "1px solid rgba(148,163,184,.2)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#income)" />
              <Area type="monotone" dataKey="expense" stroke="#fb7185" fill="url(#expense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="admin-panel rounded-2xl p-5">
        <h2 className="font-semibold">Spending by category</h2>
        <p className="mt-1 text-xs text-slate-400">Top expense categories</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid stroke="rgba(148,163,184,.12)" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis type="category" dataKey="category" width={90} stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value) => [`S$${Number(value ?? 0).toFixed(2)}`, ""]} contentStyle={{ background: "#0f1f1a", border: "1px solid rgba(148,163,184,.2)", borderRadius: 12 }} />
              <Bar dataKey="expense" fill="#fb7185" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
