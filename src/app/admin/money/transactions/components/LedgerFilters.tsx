import Link from "next/link";
import { parseLedgerFilters } from "@/features/money/ledger-filters";

type Option = { id: string; name: string };
type Props = {
  current: ReturnType<typeof parseLedgerFilters>;
  categories: Option[];
  instruments: Option[];
};

export default function LedgerFilters({
  current,
  categories,
  instruments,
}: Readonly<Props>) {
  return (
    <form
      action="/admin/money/transactions"
      method="get"
      className="admin-panel mt-6 grid min-w-0 gap-4 rounded-2xl p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"
    >
      <label className="grid min-w-0 gap-2 text-sm sm:col-span-2">
        Search transactions
        <input
          className="admin-input"
          name="search"
          type="search"
          maxLength={120}
          defaultValue={current.search}
          placeholder="Title, notes, payee, payer or reference"
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Direction
        <select
          className="admin-input"
          name="direction"
          defaultValue={current.direction ?? ""}
        >
          <option value="">Money in and out</option>
          <option value="IN">Money in</option>
          <option value="OUT">Money out</option>
        </select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Sort by
        <select className="admin-input" name="sort" defaultValue={current.sort}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Category (includes subcategories)
        <select
          className="admin-input"
          name="category"
          defaultValue={current.categoryId}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Instrument
        <select
          className="admin-input"
          name="instrument"
          defaultValue={current.instrumentId}
        >
          <option value="">All instruments</option>
          {instruments.map((instrument) => (
            <option key={instrument.id} value={instrument.id}>
              {instrument.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        From (Singapore date)
        <input
          className="admin-input min-w-0"
          type="date"
          name="from"
          defaultValue={current.from}
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        To (inclusive)
        <input
          className="admin-input min-w-0"
          type="date"
          name="to"
          defaultValue={current.to}
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Minimum amount (SGD)
        <input
          className="admin-input"
          name="min"
          inputMode="decimal"
          defaultValue={current.min}
          placeholder="0.00"
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm">
        Maximum amount (SGD)
        <input
          className="admin-input"
          name="max"
          inputMode="decimal"
          defaultValue={current.max}
          placeholder="No limit"
        />
      </label>
      <div className="flex flex-wrap items-end gap-3 sm:col-span-2">
        <button className="admin-primary-button" type="submit">
          Apply filters
        </button>
        <Link
          className="admin-secondary-button"
          href="/admin/money/transactions"
        >
          Clear filters
        </Link>
      </div>
    </form>
  );
}
