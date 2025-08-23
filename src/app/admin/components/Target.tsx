import { ChangeEventHandler } from "react";
import { Label, TextBox, TextBoxBorderless } from "./FormsRelated";

export type TargetInputs = {
  totalTarget: string;
  targetPU: string;
  targetPercentage: string;
  unitSellingPrice: string;
  totalSellingPrice: string;
};

type TargetProps = {
  type: "profit" | "loss";
  inputs: TargetInputs;
  onChange: (name: keyof TargetInputs, value: string) => void;
};

export default function Target({ inputs, ...props }: TargetProps) {
  const isProfit = props.type === "profit";

  const onFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    if (name in inputs) {
      props.onChange(name as keyof TargetInputs, value);
    }
  };

  return (
    <div
      className={`pl-[72px] xl:pl-0 ${!isProfit ? "xl:justify-self-end" : ""}`}
    >
      <div className="w-[480px] grid grid-cols-[400px_50px_auto] items-center gap-2">
        {/* if gap or any width related props are changing, mind the padding left of the parent */}
        <div className="grid grid-cols-2 items-center">
          <Label>
            {isProfit ? "Total expected profit" : "Total bearable loss"}
          </Label>
          <TextBox
            name="totalTarget"
            value={inputs.totalTarget}
            onChange={onFieldChange}
          />
        </div>
        <TextBox
          name="targetPercentage"
          value={inputs.targetPercentage}
          onChange={onFieldChange}
        />
        <Label>%</Label>
      </div>
      <div className="w-[400px] grid grid-cols-2 gap-y-2 items-center mt-2">
        <Label>{isProfit ? "Expected profit PU" : "Bearable loss PU"}</Label>
        <TextBox
          name="targetPU"
          value={inputs.targetPU}
          onChange={onFieldChange}
        />
        <Label>Unit selling price</Label>
        <TextBox
          name="unitSellingPrice"
          value={inputs.unitSellingPrice}
          onChange={onFieldChange}
        />
        <Label>Total selling price</Label>
        <TextBox
          name="totalSellingPrice"
          value={inputs.totalSellingPrice}
          onChange={onFieldChange}
        />
      </div>

      <div className="w-[400px] grid grid-cols-2 items-center mt-6">
        <Label>Cost</Label>
        <TextBoxBorderless value={1.09} readOnly />
        <Label className="text-sm">Platform fees</Label>
        <TextBoxBorderless value={0.99} className="text-sm" readOnly />
        <Label className="text-sm">Settlement fees</Label>
        <TextBoxBorderless value={0.003} className="text-sm" readOnly />
        <Label>Total cost</Label>
        <TextBoxBorderless value={1.09} readOnly />
      </div>
    </div>
  );
}
