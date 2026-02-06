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
import { Category } from "@/generated/prisma/browser";
import {
  createAction,
  getCategoriesForDropdown,
  updateAction,
  deleteAction,
} from "../actions";

type ClientFormProps = {
  isNew: boolean;
  category?: Category | null;
  hasChildCategories?: boolean;
  categories: Pick<Category, "id" | "name">[];
};

type FormEntries = { [k in keyof Pick<Category, "name" | "parentId">]: string };

const _onSaveClick = async (form: HTMLFormElement, id?: string) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries()) as FormEntries;
  const data = {
    name: entries.name,
    parentId: entries.parentId === "" ? null : entries.parentId,
  };

  if (id) await updateAction(id, data);
  else id = await createAction(data);

  return id;
};

export default function ClientForm(props: Readonly<ClientFormProps>) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [parentId, setParentId] = useState(props.category?.parentId ?? "");
  const [categories, setCategories] = useState(props.categories);
  const [pending, setPending] = useState(false);

  const onSaveClick = useCallback(async () => {
    setPending(true);
    try {
      const newId = await _onSaveClick(form.current!, props.category?.id);
      if (props.isNew) {
        router.push(`/admin/money/categories/${newId}`);
      } else {
        const cats = await getCategoriesForDropdown(newId);
        setCategories(cats);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert(error.message);
      else alert("An error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  }, [props.category, props.isNew, router]);

  const onDeleteClick = useCallback(async () => {
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
    <Form ref={form}>
      <FieldContainer label="Name">
        <InputField
          type="text"
          name="name"
          defaultValue={props.category?.name ?? ""}
          required
        />
      </FieldContainer>

      <FieldContainer label="Parent category">
        <SelectField
          name="parentId"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <SelectOption value="">-- None --</SelectOption>
          {categories.map((cat) => (
            <SelectOption key={cat.id} value={cat.id}>
              {cat.name}
            </SelectOption>
          ))}
        </SelectField>
      </FieldContainer>

      <div className="flex justify-between mt-10">
        <FormButton type="button" disabled={pending} onClick={router.back}>
          Cancel
        </FormButton>
        <FormButton
          type="submit"
          disabled={pending}
          className="text-btn-blue border-btn-blue"
          onClick={onSaveClick}
        >
          Save
        </FormButton>
        {props.isNew === false && (
          <FormButton
            type="button"
            disabled={pending || props.hasChildCategories}
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
