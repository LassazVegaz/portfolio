"use client";

import Form from "@/components/Form";
import { useRouter } from "next/navigation";
import { SubmitEventHandler, useState } from "react";
import { createAction, updateAction, deleteAction } from "../actions";

type Category = {
  id: string;
  name: string;
  description: string | null;
  usage: "IN" | "OUT" | "BOTH";
  isArchived: boolean;
  parentId: string | null;
  isSystem: boolean;
  monthlyBudgetCents: number;
};
type Props = {
  isNew: boolean;
  category?: Category | null;
  categories: { id: string; name: string }[];
};

export default function ClientForm({ category, categories }: Readonly<Props>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(undefined);
    setSaved(false);
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      description: String(data.get("description") ?? ""),
      usage: String(data.get("usage")) as Category["usage"],
      parentId: String(data.get("parentId") ?? "") || null,
      monthlyBudget: String(data.get("monthlyBudget") ?? "0"),
      isArchived: data.get("isArchived") === "on",
    };
    try {
      if (category) {
        const result = await updateAction(category.id, input);
        if (!result.success) throw new Error(result.error);
        setSaved(true);
        router.refresh();
      } else {
        const result = await createAction(input);
        if (!result.success) throw new Error(result.error);
        router.push(`/admin/money/categories/${result.data}`);
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save category.",
      );
    } finally {
      setPending(false);
    }
  };
  const onDelete = async () => {
    if (
      !category ||
      !confirm(
        `Delete ${category.name}? Categories with transactions must be archived instead.`,
      )
    )
      return;
    setPending(true);
    setError(undefined);
    try {
      const result = await deleteAction(category.id);
      if (!result.success) throw new Error(result.error);
      router.push("/admin/money/categories");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete category.",
      );
      setPending(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="admin-panel mt-8 grid gap-5 rounded-2xl p-5 sm:p-6"
    >
      <fieldset
        disabled={pending || category?.isSystem}
        className="grid min-w-0 gap-5 disabled:opacity-70"
      >
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input
            className="admin-input"
            name="name"
            maxLength={80}
            defaultValue={category?.name ?? ""}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Description
          <textarea
            className="admin-input min-h-24 resize-y"
            name="description"
            maxLength={500}
            defaultValue={category?.description ?? ""}
            placeholder="What belongs in this category?"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Available for
          <select
            className="admin-input"
            name="usage"
            defaultValue={category?.usage ?? "BOTH"}
          >
            <option value="BOTH">Money in and out</option>
            <option value="IN">Money in</option>
            <option value="OUT">Money out</option>
          </select>
          <span className="text-xs text-admin-muted">
            Applies to transactions assigned directly to this category.
            Subcategories have their own setting.
          </span>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Parent category
          <select
            className="admin-input"
            name="parentId"
            defaultValue={category?.parentId ?? ""}
          >
            <option value="">None</option>
            {categories.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Monthly spending budget (SGD)
          <input
            className="admin-input"
            name="monthlyBudget"
            inputMode="decimal"
            defaultValue={((category?.monthlyBudgetCents ?? 0) / 100).toFixed(
              2,
            )}
            required
          />
        </label>
        <p className="text-sm leading-6 text-admin-muted">
          Use 0 for no budget. Subcategory budgets together cannot exceed their
          parent budget. Budgets apply to money out and are prorated for partial
          months.
        </p>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            className="size-4 accent-admin-accent"
            type="checkbox"
            name="isArchived"
            defaultChecked={category?.isArchived}
          />
          Archive category
        </label>
        <p className="text-sm text-admin-muted">
          Archived categories stay in reports and existing transactions, but
          cannot be assigned to new transactions.
        </p>
      </fieldset>
      {category?.isSystem && (
        <p className="text-sm text-admin-muted">
          Unclassified is the permanent fallback category.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-emerald-300">
          Category saved.
        </p>
      )}
      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          className="admin-secondary-button"
          disabled={pending}
          onClick={() => router.back()}
        >
          Back
        </button>
        {!category?.isSystem && (
          <div className="flex flex-wrap gap-3">
            {category && (
              <button
                type="button"
                className="admin-danger-button"
                disabled={pending}
                onClick={onDelete}
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="admin-primary-button"
              disabled={pending}
            >
              {pending ? "Saving…" : "Save category"}
            </button>
          </div>
        )}
      </div>
    </Form>
  );
}
