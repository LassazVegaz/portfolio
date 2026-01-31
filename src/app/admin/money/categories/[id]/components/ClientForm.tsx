"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FieldContainer,
  FormButton,
  InputField,
  SelectField,
  SelectOption,
} from "@/components/FormFields";
import { formAction } from "../actions";
import Form from "@/components/Form";
import { Category } from "@/generated/prisma/browser";

type ClientFormProps = {
  isNew: boolean;
  category?: Category;
  categories: Pick<Category, "id" | "name">[];
};

export default function ClientForm(props: Readonly<ClientFormProps>) {
  const submitter = useRef<HTMLButtonElement | null>(null);
  const [parentId, setParentId] = useState(props.category?.parentId ?? "");
  const router = useRouter();
  const [error, action, pending] = useActionState(formAction, null);

  useEffect(() => {
    console.log("parent id:", props.category?.parentId);

    setParentId(props.category?.parentId ?? "");
  }, [props.category?.parentId]);

  if (error) alert(error);

  return (
    <Form
      action={(f) => {
        f.append(submitter.current!.name, submitter.current!.value);
        return action(f);
      }}
    >
      <input type="hidden" name="id" value={props.category?.id} />

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
          {props.categories.map((cat) => (
            <SelectOption key={cat.id} value={cat.id}>
              {cat.name}
            </SelectOption>
          ))}
        </SelectField>
      </FieldContainer>

      <div className="flex justify-between mt-10">
        <FormButton
          type="button"
          disabled={pending}
          onClick={() => router.back()}
        >
          Cancel
        </FormButton>
        <FormButton
          name="actionType"
          value="save"
          type="submit"
          disabled={pending}
          className="text-btn-blue border-btn-blue"
          onClick={(e) => (submitter.current = e.currentTarget)}
        >
          Save
        </FormButton>
        {props.isNew === false && (
          <FormButton
            name="actionType"
            value="delete"
            type="submit"
            disabled={pending}
            className="text-btn-red border-btn-red"
            onClick={(e) => (submitter.current = e.currentTarget)}
          >
            Delete
          </FormButton>
        )}
      </div>
    </Form>
  );
}
