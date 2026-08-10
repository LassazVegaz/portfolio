"use client";

import {
  getPresetDateRange,
  MONEY_DATE_RANGE_LABELS,
  MONEY_DATE_RANGE_PRESETS,
  MoneyDateRangePreset,
  isValidMoneyDateInput,
} from "@/features/money/date-ranges";
import { MoneyDirection } from "@/features/money/money";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  deleteFilterAction,
  renameFilterAction,
  saveFilterAction,
} from "../actions";

const MAX_CATEGORIES = 10;

export type FilterCategory = {
  id: string;
  name: string;
  parentId: string | null;
  isSystem: boolean;
};

export type SavedFilter = {
  id: string;
  name: string;
  direction: MoneyDirection;
  categoryIds: string[];
  showSubcategories: boolean;
  rangePreset: MoneyDateRangePreset | null;
  from: string | null;
  to: string | null;
  showCashflow: boolean;
};

export type CurrentFilters = {
  direction: MoneyDirection;
  categoryIds: string[];
  showSubcategories: boolean;
  rangePreset: MoneyDateRangePreset | null;
  from: string;
  to: string;
  showCashflow: boolean;
};

const unique = (values: string[]) => [...new Set(values)].slice(0, MAX_CATEGORIES);

export default function DashboardFilters({
  categories,
  savedFilters,
  current,
}: Readonly<{
  categories: FilterCategory[];
  savedFilters: SavedFilter[];
  current: CurrentFilters;
}>) {
  const router = useRouter();
  const [direction, setDirection] = useState(current.direction);
  const [selected, setSelected] = useState(current.categoryIds);
  const [showSubcategories, setShowSubcategories] = useState(
    current.showSubcategories,
  );
  const [rangePreset, setRangePreset] = useState(current.rangePreset);
  const [from, setFrom] = useState(current.from);
  const [to, setTo] = useState(current.to);
  const [showCashflow, setShowCashflow] = useState(current.showCashflow);
  const [search, setSearch] = useState("");
  const [saveName, setSaveName] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const roots = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories],
  );
  const childrenByParent = useMemo(() => {
    const map = new Map<string, FilterCategory[]>();
    for (const category of categories) {
      if (!category.parentId) continue;
      const children = map.get(category.parentId) ?? [];
      children.push(category);
      map.set(category.parentId, children);
    }
    return map;
  }, [categories]);

  const visibleRoots = roots.filter((root) => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return true;
    return (
      root.name.toLocaleLowerCase().includes(term) ||
      (childrenByParent.get(root.id) ?? []).some((child) =>
        child.name.toLocaleLowerCase().includes(term),
      )
    );
  });

  const toggleSingle = (id: string) => {
    setError(undefined);
    setSelected((values) => {
      if (values.includes(id)) return values.filter((value) => value !== id);
      if (values.length >= MAX_CATEGORIES) {
        setError(`Choose no more than ${MAX_CATEGORIES} categories.`);
        return values;
      }
      return [...values, id];
    });
  };

  const toggleParent = (root: FilterCategory) => {
    const children = childrenByParent.get(root.id) ?? [];
    if (!showSubcategories || children.length === 0) {
      toggleSingle(root.id);
      return;
    }
    const childIds = children.map(({ id }) => id);
    const allSelected = childIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((values) => values.filter((id) => !childIds.includes(id)));
      return;
    }
    setSelected((values) => {
      const withoutGroup = values.filter((id) => !childIds.includes(id));
      const room = MAX_CATEGORIES - withoutGroup.length;
      const nextChildren = childIds.slice(0, room);
      if (nextChildren.length < childIds.length) {
        setError(`The first ${nextChildren.length} subcategories were selected (maximum ${MAX_CATEGORIES}).`);
      }
      return [...withoutGroup, ...nextChildren];
    });
  };

  const changeSubcategoryVisibility = (show: boolean) => {
    setShowSubcategories(show);
    if (show) {
      const expanded: string[] = [];
      for (const id of selected) {
        const children = childrenByParent.get(id) ?? [];
        expanded.push(...(children.length ? children.map((child) => child.id) : [id]));
      }
      setSelected(unique(expanded));
    } else {
      setSelected(
        unique(
          selected.map(
            (id) => categories.find((category) => category.id === id)?.parentId ?? id,
          ),
        ),
      );
    }
  };

  const selectPreset = (preset: MoneyDateRangePreset) => {
    const range = getPresetDateRange(preset);
    setRangePreset(preset);
    setFrom(range.from);
    setTo(range.to);
    if (preset === "THIS_MONTH") setShowCashflow(true);
  };

  const setManualDate = (side: "from" | "to", value: string) => {
    setRangePreset(null);
    if (side === "from") setFrom(value);
    else setTo(value);
  };

  const navigate = (filter: CurrentFilters) => {
    if (
      !isValidMoneyDateInput(filter.from) ||
      !isValidMoneyDateInput(filter.to) ||
      filter.from > filter.to
    ) {
      setError("Choose a valid date range with the start before the end.");
      return;
    }
    const params = new URLSearchParams();
    params.set("direction", filter.direction);
    filter.categoryIds.forEach((id) => params.append("category", id));
    params.set("subcategories", filter.showSubcategories ? "show" : "hide");
    params.set("from", filter.from);
    params.set("to", filter.to);
    if (filter.rangePreset) params.set("range", filter.rangePreset);
    params.set("cashflow", filter.showCashflow ? "true" : "false");
    router.push(`/admin/money/transactions?${params}` as Route);
  };

  const active = (): CurrentFilters => ({
    direction,
    categoryIds: selected,
    showSubcategories,
    rangePreset,
    from,
    to,
    showCashflow,
  });

  const save = async () => {
    if (!isValidMoneyDateInput(from) || !isValidMoneyDateInput(to) || from > to) {
      setError("Choose a valid date range with the start before the end.");
      return;
    }
    setPending(true);
    setError(undefined);
    try {
      await saveFilterAction({
        name: saveName.trim() || undefined,
        direction,
        categoryIds: selected,
        showSubcategories,
        rangePreset,
        from,
        to,
        showCashflow,
      });
      setSaveName("");
      setSavedOpen(true);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save filter.");
    } finally {
      setPending(false);
    }
  };

  const applySaved = (filter: SavedFilter) => {
    const range = filter.rangePreset
      ? getPresetDateRange(filter.rangePreset)
      : { from: filter.from ?? current.from, to: filter.to ?? current.to };
    setSavedOpen(false);
    navigate({
      direction: filter.direction,
      categoryIds: filter.categoryIds.filter((id) =>
        categories.some((category) => category.id === id),
      ),
      showSubcategories: filter.showSubcategories,
      rangePreset: filter.rangePreset,
      from: range.from,
      to: range.to,
      showCashflow: filter.showCashflow,
    });
  };

  return (
    <details open className="admin-panel rounded-admin">
      <summary className="cursor-pointer px-page py-4 font-semibold">Filters</summary>
      <div className="grid border-t border-admin-line lg:grid-cols-[18rem_1fr]">
        <aside className="border-b border-admin-line p-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="sticky top-0 z-10 bg-admin-surface pb-3">
            <input
              className="admin-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              aria-label="Search categories"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-admin-muted">
              <span>{selected.length} / {MAX_CATEGORIES} selected</span>
              <button type="button" onClick={() => setSelected([])} className="hover:text-admin-accent">
                Clear
              </button>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-admin-muted">
              <input
                type="checkbox"
                checked={showSubcategories}
                onChange={(event) => changeSubcategoryVisibility(event.target.checked)}
                className="accent-admin-accent"
              />
              Show subcategories
            </label>
          </div>
          <div className="grid gap-1">
            {visibleRoots.map((root) => {
              const children = childrenByParent.get(root.id) ?? [];
              const selectedChildren = children.filter((child) => selected.includes(child.id)).length;
              const rootSelected = selected.includes(root.id);
              const cue = children.length
                ? selectedChildren === children.length
                  ? "all"
                  : selectedChildren
                    ? "some"
                    : "none"
                : rootSelected
                  ? "all"
                  : "none";
              return (
                <div key={root.id} className="rounded-xl py-1">
                  <button
                    type="button"
                    onClick={() => toggleParent(root)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold hover:bg-white/5"
                    aria-label={`${root.name}: ${cue} selected`}
                  >
                    <span className={`grid size-4 place-items-center rounded border text-[10px] ${cue === "none" ? "border-admin-line" : "border-admin-accent text-admin-accent"}`}>
                      {cue === "all" ? "✓" : cue === "some" ? "−" : ""}
                    </span>
                    {root.name}
                  </button>
                  {showSubcategories && children.length > 0 && (
                    <div className="ml-6 grid gap-1 border-l border-admin-line pl-2">
                      {children
                        .filter((child) =>
                          !search.trim() || child.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
                        )
                        .map((child) => (
                          <label key={child.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-admin-muted hover:bg-white/5 hover:text-admin-ink">
                            <input
                              type="checkbox"
                              checked={selected.includes(child.id)}
                              onChange={() => toggleSingle(child.id)}
                              className="accent-admin-accent"
                            />
                            {child.name}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <div className="grid content-start gap-page p-page">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Money direction
              <select className="admin-input" value={direction} onChange={(event) => setDirection(event.target.value as MoneyDirection)}>
                <option value="OUT">Money out</option>
                <option value="IN">Money in</option>
              </select>
            </label>
            <label className="flex items-end gap-3 pb-3 text-sm font-medium">
              <input type="checkbox" checked={showCashflow} onChange={(event) => setShowCashflow(event.target.checked)} className="size-4 accent-admin-accent" />
              Include cashflow numbers (money in and out)
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Predefined date range</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {MONEY_DATE_RANGE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => selectPreset(preset)}
                  className={rangePreset === preset ? "admin-primary-button" : "admin-secondary-button"}
                >
                  {MONEY_DATE_RANGE_LABELS[preset]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              From (inclusive)
              <input className="admin-input" type="date" value={from} max={to} onChange={(event) => setManualDate("from", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              To (inclusive)
              <input className="admin-input" type="date" value={to} min={from} onChange={(event) => setManualDate("to", event.target.value)} />
            </label>
          </div>

          {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="admin-primary-button" onClick={() => navigate(active())}>
              Apply filters
            </button>
            <button type="button" className="admin-secondary-button" onClick={() => setSavedOpen(true)}>
              Saved filters ({savedFilters.length})
            </button>
          </div>

          <div className="grid gap-3 border-t border-admin-line pt-page sm:grid-cols-[1fr_auto]">
            <input
              className="admin-input"
              value={saveName}
              onChange={(event) => setSaveName(event.target.value)}
              placeholder="Optional name — Filter 1, Filter 2… if blank"
              maxLength={80}
            />
            <button type="button" className="admin-secondary-button" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save current filter"}
            </button>
          </div>
        </div>
      </div>

      {savedOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Saved filters">
          <div className="admin-panel max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-admin p-page">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Saved filters</h2>
              <button type="button" className="admin-secondary-button" onClick={() => setSavedOpen(false)}>Close</button>
            </div>
            <div className="mt-page grid gap-3">
              {savedFilters.map((filter) => (
                <SavedFilterRow
                  key={filter.id}
                  filter={filter}
                  onApply={() => applySaved(filter)}
                  onChanged={() => router.refresh()}
                />
              ))}
              {savedFilters.length === 0 && <p className="py-8 text-center text-sm text-admin-muted">No saved filters yet.</p>}
            </div>
          </div>
        </div>
      )}
    </details>
  );
}

function SavedFilterRow({
  filter,
  onApply,
  onChanged,
}: Readonly<{
  filter: SavedFilter;
  onApply: () => void;
  onChanged: () => void;
}>) {
  const [name, setName] = useState(filter.name);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const rename = async () => {
    setPending(true);
    setError(undefined);
    try {
      await renameFilterAction(filter.id, name);
      onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not rename filter.");
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    setPending(true);
    try {
      await deleteFilterAction(filter.id);
      onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete filter.");
      setPending(false);
    }
  };

  return (
    <div className="rounded-xl border border-admin-line p-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input className="admin-input" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
        <button type="button" className="admin-secondary-button" onClick={rename} disabled={pending || name.trim() === filter.name}>
          Rename
        </button>
        <button type="button" className="admin-danger-button" onClick={remove} disabled={pending} aria-label={`Delete ${filter.name}`}>
          Delete
        </button>
      </div>
      <button type="button" onClick={onApply} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-admin-muted hover:bg-white/5 hover:text-admin-accent">
        Apply · {filter.direction === "OUT" ? "money out" : "money in"} · {filter.categoryIds.length || "all"} categories
      </button>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
