import Form from "@/components/Form";
import {
  FieldContainer,
  FormButton,
  InputField,
  SelectField,
  SelectOption,
} from "@/components/FormFields";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default async function CategoryPage(
  props: Readonly<PageProps<"/admin/money/categories/[id]">>,
) {
  const { id } = await props.params;
  console.log(id);

  return (
    <PageContainer>
      <Header1>A Category</Header1>

      <Form>
        <FieldContainer label="Name">
          <InputField type="text" name="name" />
        </FieldContainer>

        <FieldContainer label="Parent category">
          <SelectField name="parent">
            <SelectOption value="">-- None --</SelectOption>
            <SelectOption value="1">Category 1</SelectOption>
            <SelectOption value="2">Category 2</SelectOption>
          </SelectField>
        </FieldContainer>

        <div className="flex justify-between mt-10">
          <FormButton>Cancel</FormButton>
          <FormButton className="text-btn-blue border-btn-blue">
            Save
          </FormButton>
          <FormButton className="text-btn-red border-btn-red">
            Delete
          </FormButton>
        </div>
      </Form>
    </PageContainer>
  );
}
