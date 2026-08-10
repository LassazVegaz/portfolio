import { formatMoneyDateInput, getBudgetForDateRange } from "./date-ranges";

export type DashboardCategory = {
  id: string;
  name: string;
  parentId: string | null;
  monthlyBudgetCents: number;
};

export type DashboardTransaction = {
  amountCents: number;
  direction: "IN" | "OUT";
  time: Date;
  categoryId: string;
};

export type CategoryGroup = {
  id: string;
  name: string;
  categoryIds: string[];
  monthlyBudgetCents: number;
};

const SERIES_COLORS = [
  "#6ee7b7",
  "#fb7185",
  "#60a5fa",
  "#fbbf24",
  "#c084fc",
  "#22d3ee",
  "#f97316",
  "#a3e635",
  "#f472b6",
  "#94a3b8",
];

export const getCategoryGroups = (
  categories: DashboardCategory[],
  selectedIds: string[],
  showSubcategories: boolean,
) => {
  const selected = new Set(selectedIds);
  if (!selected.size) {
    return {
      groups: [
        {
          id: "all",
          name: "All money",
          categoryIds: categories.map(({ id }) => id),
          monthlyBudgetCents: 0,
        },
      ],
      filteredCategoryIds: [] as string[],
      hasCategorySelection: false,
    };
  }

  const groups: CategoryGroup[] = [];
  for (const category of categories) {
    if (!selected.has(category.id)) continue;
    const children = categories.filter(({ parentId }) => parentId === category.id);
    groups.push({
      id: category.id,
      name: category.name,
      categoryIds:
        !showSubcategories && children.length
          ? [category.id, ...children.map(({ id }) => id)]
          : [category.id],
      monthlyBudgetCents: category.monthlyBudgetCents,
    });
  }

  return {
    groups,
    filteredCategoryIds: [...new Set(groups.flatMap(({ categoryIds }) => categoryIds))],
    hasCategorySelection: true,
  };
};

const getGranularity = (from: string, to: string) => {
  const days =
    Math.round(
      (new Date(`${to}T00:00:00Z`).getTime() -
        new Date(`${from}T00:00:00Z`).getTime()) /
        86_400_000,
    ) + 1;
  if (days <= 62) return "day" as const;
  if (days <= 370) return "week" as const;
  return "month" as const;
};

const getBucket = (date: Date, granularity: "day" | "week" | "month") => {
  const singaporeDate = formatMoneyDateInput(date);
  if (granularity === "day") return singaporeDate;
  if (granularity === "month") return singaporeDate.slice(0, 7);
  const value = new Date(`${singaporeDate}T00:00:00Z`);
  const weekday = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 1 - weekday);
  return formatMoneyDateInput(value);
};

export const buildLineChart = (
  transactions: DashboardTransaction[],
  groups: CategoryGroup[],
  from: string,
  to: string,
  showCashflow: boolean,
) => {
  const granularity = getGranularity(from, to);
  const buckets = new Map<string, Record<string, number>>();
  for (const transaction of transactions) {
    const group = groups.find(({ categoryIds }) =>
      categoryIds.includes(transaction.categoryId),
    );
    if (!group) continue;
    const bucket = getBucket(transaction.time, granularity);
    const values = buckets.get(bucket) ?? {};
    const key = `series_${groups.indexOf(group)}`;
    const amount =
      showCashflow && transaction.direction === "OUT"
        ? -transaction.amountCents
        : transaction.amountCents;
    values[key] = (values[key] ?? 0) + amount;
    buckets.set(bucket, values);
  }

  return {
    data: [...buckets.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([period, values]) => ({ period, ...values })),
    series: groups.map((group, index) => ({
      key: `series_${index}`,
      label: group.name,
      color: SERIES_COLORS[index % SERIES_COLORS.length],
    })),
  };
};

export const buildCategorySummaries = (
  transactions: DashboardTransaction[],
  groups: CategoryGroup[],
  from: string,
  to: string,
) =>
  groups.map((group) => {
    const actualCents = transactions
      .filter(
        (transaction) =>
          transaction.direction === "OUT" &&
          group.categoryIds.includes(transaction.categoryId),
      )
      .reduce((sum, transaction) => sum + transaction.amountCents, 0);
    const budgetCents = getBudgetForDateRange(
      group.monthlyBudgetCents,
      from,
      to,
    );
    return {
      ...group,
      actualCents,
      budgetCents,
      remainingCents: budgetCents - actualCents,
      remainingPercentage:
        budgetCents > 0 ? ((budgetCents - actualCents) / budgetCents) * 100 : null,
    };
  });
