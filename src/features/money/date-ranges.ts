export const MONEY_DATE_RANGE_PRESETS = [
  "TODAY",
  "THIS_WEEK",
  "LAST_WEEK",
  "THIS_MONTH",
  "LAST_MONTH",
  "THIS_YEAR",
  "LAST_YEAR",
] as const;

export type MoneyDateRangePreset = (typeof MONEY_DATE_RANGE_PRESETS)[number];

export const MONEY_DATE_RANGE_LABELS: Record<MoneyDateRangePreset, string> = {
  TODAY: "Today",
  THIS_WEEK: "This week",
  LAST_WEEK: "Last week",
  THIS_MONTH: "This month",
  LAST_MONTH: "Last month",
  THIS_YEAR: "This year",
  LAST_YEAR: "Last year",
};

const SINGAPORE_TIME_ZONE = "Asia/Singapore";
const SINGAPORE_OFFSET = "+08:00";

const formatDate = (date: Date) =>
  [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");

export const formatMoneyDateInput = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SINGAPORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
};

const singaporeToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SINGAPORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts();
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return new Date(Date.UTC(value("year"), value("month") - 1, value("day")));
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const getPresetDateRange = (preset: MoneyDateRangePreset) => {
  const today = singaporeToday();
  const day = today.getUTCDay() || 7;
  const startOfThisWeek = addDays(today, 1 - day);
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();

  const ranges: Record<MoneyDateRangePreset, [Date, Date]> = {
    TODAY: [today, today],
    THIS_WEEK: [startOfThisWeek, addDays(startOfThisWeek, 6)],
    LAST_WEEK: [addDays(startOfThisWeek, -7), addDays(startOfThisWeek, -1)],
    THIS_MONTH: [
      new Date(Date.UTC(year, month, 1)),
      new Date(Date.UTC(year, month + 1, 0)),
    ],
    LAST_MONTH: [
      new Date(Date.UTC(year, month - 1, 1)),
      new Date(Date.UTC(year, month, 0)),
    ],
    THIS_YEAR: [
      new Date(Date.UTC(year, 0, 1)),
      new Date(Date.UTC(year, 11, 31)),
    ],
    LAST_YEAR: [
      new Date(Date.UTC(year - 1, 0, 1)),
      new Date(Date.UTC(year - 1, 11, 31)),
    ],
  };
  const [from, to] = ranges[preset];
  return { from: formatDate(from), to: formatDate(to) };
};

export const parseMoneyDateStart = (value?: string) =>
  value ? new Date(`${value}T00:00:00.000${SINGAPORE_OFFSET}`) : undefined;

export const parseMoneyDateEnd = (value?: string) =>
  value ? new Date(`${value}T23:59:59.999${SINGAPORE_OFFSET}`) : undefined;

export const isMoneyDatePreset = (
  value: string | undefined,
): value is MoneyDateRangePreset =>
  MONEY_DATE_RANGE_PRESETS.includes(value as MoneyDateRangePreset);

export const isSingleDayRange = (from: string, to: string) => from === to;

export const isValidMoneyDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && formatDate(date) === value;
};

export const isExactMonthRange = (from: string, to: string) => {
  if (!isValidMoneyDateInput(from) || !isValidMoneyDateInput(to)) return false;
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  return (
    start.getUTCDate() === 1 &&
    end.getUTCDate() ===
      new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate() &&
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()
  );
};

export const getBudgetForDateRange = (
  monthlyBudgetCents: number,
  from: string,
  to: string,
) => {
  if (monthlyBudgetCents <= 0) return 0;
  const cursor = new Date(`${from}T00:00:00Z`);
  const last = new Date(`${to}T00:00:00Z`);
  let budget = 0;

  while (cursor <= last) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const monthEnd = new Date(Date.UTC(year, month, daysInMonth));
    const overlapEnd = monthEnd < last ? monthEnd : last;
    const days =
      Math.round((overlapEnd.getTime() - cursor.getTime()) / 86_400_000) + 1;
    budget += (monthlyBudgetCents * days) / daysInMonth;
    cursor.setUTCMonth(month + 1, 1);
  }

  return Math.round(budget);
};
