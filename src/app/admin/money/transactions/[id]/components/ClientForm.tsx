"use client";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import Form from "@/components/Form";
import {
  FieldContainer,
  InputField,
  FormButton,
} from "@/components/FormFields";
import { createAction, updateAction, deleteAction } from "../actions";
import { Transaction } from "@/generated/prisma/browser";
import ValidationException from "@/exceptions/validation.exception";

type FormEntries = {
  [k in keyof Pick<
    Transaction,
    "amount" | "title" | "comments" | "time"
  >]: string;
};

type ClientFormProps = {
  isNew: boolean;
  transaction?: Transaction | null;
};

const handleKnownExceptions = (error: unknown) => {
  let handled = false;

  if (error instanceof ValidationException) {
    alert(error.message);
    handled = true;
  }

  return handled;
};

const validateFormEntries = (entries: FormEntries) => {
  if (Number.isNaN(Number.parseFloat(entries.amount)))
    throw new ValidationException("Amount must be a valid number");
};

const _onSaveClick = async (form: HTMLFormElement, id?: string) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries()) as FormEntries;
  validateFormEntries(entries);

  if (id) {
    await updateAction(id, entries);
  } else {
    const createdId = await createAction(entries);
    id = createdId;
  }
  return id;
};

export default function ClientForm(props: Readonly<ClientFormProps>) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  const onSaveClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      if (!form.current!.checkValidity()) return;
      e.preventDefault();
      setPending(true);
      try {
        const id = await _onSaveClick(form.current!, props.transaction?.id);
        if (props.isNew) router.push(`/admin/money/transactions/${id}`);
      } catch (error) {
        if (!handleKnownExceptions(error)) {
          console.error("Failed to save transaction:", error);
          alert("An error occurred while saving the transaction.");
        }
      } finally {
        setPending(false);
      }
    },
    [props.isNew, props.transaction?.id, router],
  );

  const onDeleteClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setPending(true);
      try {
        await deleteAction(props.transaction!.id);
        router.push("/admin/money/transactions");
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        alert("An error occurred while deleting the transaction.");
      } finally {
        setPending(false);
      }
    },
    [router, props.transaction],
  );

  return (
    <Form ref={form} className="mt-10 grid grid-cols-1 gap-4">
      <FieldContainer label="Amount">
        <InputField type="text" name="amount" required />
      </FieldContainer>
      <FieldContainer label="Title">
        <InputField type="text" name="title" required />
      </FieldContainer>
      <FieldContainer label="Comments">
        <InputField type="text" name="comments" />
      </FieldContainer>
      <FieldContainer label="Time">
        <InputField type="datetime-local" name="time" required />
      </FieldContainer>

      <div className="flex justify-between mt-10">
        <FormButton type="button" onClick={router.back} disabled={pending}>
          Cancel
        </FormButton>
        <FormButton
          type="submit"
          className="text-btn-blue border-btn-blue"
          onClick={onSaveClick}
          disabled={pending}
        >
          Save
        </FormButton>
        {!props.isNew && (
          <FormButton
            type="submit"
            className="text-btn-red border-btn-red"
            onClick={onDeleteClick}
            disabled={pending}
          >
            Delete
          </FormButton>
        )}
      </div>
    </Form>
  );
}
