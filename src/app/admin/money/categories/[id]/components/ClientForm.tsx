"use client";
import { useRouter } from "next/navigation";
import {
  FieldContainer,
  FormButton,
  InputField,
  SelectField,
  SelectOption,
} from "@/components/FormFields";
import Form from "@/components/Form";
import { formAction } from "../actions";
import { useActionState } from "react";

type ClientFormProps = {
  id: string;
};

export default function ClientForm(props: Readonly<ClientFormProps>) {
  const router = useRouter();
  const [, action, isPending] = useActionState(formAction, null);

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.id} />

      <FieldContainer label="Name">
        <InputField type="text" name="name" />
      </FieldContainer>

      <FieldContainer label="Parent category">
        <SelectField name="parentId">
          <SelectOption value="">-- None --</SelectOption>
          <SelectOption value="1">Category 1</SelectOption>
          <SelectOption value="2">Category 2</SelectOption>
        </SelectField>
      </FieldContainer>

      <div className="flex justify-between mt-10">
        <FormButton disabled={isPending} onClick={router.back}>
          Cancel
        </FormButton>
        <FormButton
          name="save"
          type="submit"
          disabled={isPending}
          className="text-btn-blue border-btn-blue"
        >
          Save
        </FormButton>
        <FormButton
          name="delete"
          type="submit"
          disabled={isPending}
          className="text-btn-red border-btn-red"
        >
          Delete
        </FormButton>
      </div>
    </Form>
  );
}
