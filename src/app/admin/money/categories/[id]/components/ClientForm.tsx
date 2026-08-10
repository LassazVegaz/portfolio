"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FieldContainer,
  FormButton,
  InputField,
  SelectField,
  SelectOption,
} from "@/components/FormFields";
import Form from "@/components/Form";
import {
  createAction,
  updateAction,
  deleteAction,
} from "../actions";

type Category = {
  id: string;
  name: string;
  parentId: string | null;
  isSystem: boolean;
  monthlyBudgetCents: number;
};

type ClientFormProps = {
  isNew: boolean;
  category?: Category | null;
  categories: Pick<Category, "id" | "name">[];
};

type FormEntries = {
  name: string;
  parentId: string;
  monthlyBudget: string;
};

const _onSaveClick = async (form: HTMLFormElement, id?: string) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries()) as FormEntries;
  const data = {
    name: entries.name,
    parentId: entries.parentId === "" ? null : entries.parentId,
    monthlyBudget: entries.monthlyBudget,
  };

  if (id) await updateAction(id, data);
  else id = await createAction(data);

  return id;
};

export default function ClientForm(props: Readonly<ClientFormProps>) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [parentId, setParentId] = useState(props.category?.parentId ?? "");
  const [pending, setPending] = useState(false);

  const onSaveClick = useCallback(async () => {
    setPending(true);
    try {
      const newId = await _onSaveClick(form.current!, props.category?.id);
      if (props.isNew) {
        router.push(`/admin/money/categories/${newId}`);
      } else router.refresh();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert(error.message);
      else alert("An error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  }, [props.category, props.isNew, router]);

  const onDeleteClick = useCallback(async () => {
    if (!confirm(`Delete ${props.category?.name}?`)) return;
    setPending(true);
    try {
      await deleteAction(props.category!.id);
      router.push("/admin/money/categories");
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  }, [props.category, router]);

  return (
    <Form
      ref={form}
      onSubmit={(event) => {
        event.preventDefault();
        void onSaveClick();
      }}
      className="admin-panel mt-8 grid gap-5 rounded-2xl p-6"
    >
      <FieldContainer label="Name">
        <InputField
          type="text"
          name="name"
          defaultValue={props.category?.name ?? ""}
          required
          disabled={props.category?.isSystem}
          className="admin-input"
        />
      </FieldContainer>

      <FieldContainer label="Parent category">
        <SelectField
          name="parentId"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          disabled={props.category?.isSystem}
          className="admin-input"
        >
          <SelectOption value="">-- None --</SelectOption>
          {props.categories.map((cat) => (
            <SelectOption key={cat.id} value={cat.id}>
              {cat.name}
            </SelectOption>
          ))}
        </SelectField>
      </FieldContainer>

      <FieldContainer label="Monthly budget (SGD)">
        <InputField
          type="text"
          inputMode="decimal"
          name="monthlyBudget"
          defaultValue={((props.category?.monthlyBudgetCents ?? 0) / 100).toFixed(2)}
          required
          disabled={props.category?.isSystem}
          className="admin-input"
        />
      </FieldContainer>

      <p className="text-sm leading-6 text-admin-muted">
        Subcategory budgets together cannot exceed their parent category budget.
        Dashboard budgets are prorated for partial-month date ranges.
      </p>

      <div className="flex justify-between mt-10">
        <FormButton type="button" disabled={pending} onClick={router.back}>
          Cancel
        </FormButton>
        {!props.category?.isSystem && (
          <FormButton
            type="submit"
            disabled={pending}
            className="text-btn-blue border-btn-blue"
          >
            Save
          </FormButton>
        )}
        {props.isNew === false && !props.category?.isSystem && (
          <FormButton
            type="button"
            disabled={pending}
            className="text-btn-red border-btn-red"
            onClick={onDeleteClick}
          >
            Delete
          </FormButton>
        )}
      </div>
    </Form>
  );
}
