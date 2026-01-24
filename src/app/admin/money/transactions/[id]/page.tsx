import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

type FieldProps = { label: string; children?: React.ReactNode };

const FieldContainer = (props: FieldProps) => (
  <div>
    <div>{props.label}</div>
    {props.children}
  </div>
);

const SelectField = (props: React.ComponentProps<"select">) => (
  <select
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  />
);

const InputField = (props: React.ComponentProps<"input">) => (
  <input
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  />
);

export default function MoneyViewPage() {
  return (
    <PageContainer className="px-5">
      <Header1>A Transaction</Header1>

      <div className="mt-10 grid grid-cols-1 gap-4">
        <FieldContainer label="Amount">
          <InputField type="text" name="amount" />
        </FieldContainer>
        <FieldContainer label="Flow">
          <SelectField name="flow">
            <option value="in">In</option>
            <option value="out">Out</option>
          </SelectField>
        </FieldContainer>
        <FieldContainer label="Category">
          <SelectField name="category">
            <option value="salary">Salary</option>
            <option value="groceries">Groceries</option>
            <option value="entertainment">Entertainment</option>
          </SelectField>
        </FieldContainer>
        <FieldContainer label="Time">
          <InputField type="datetime-local" name="time" />
        </FieldContainer>
      </div>
    </PageContainer>
  );
}
