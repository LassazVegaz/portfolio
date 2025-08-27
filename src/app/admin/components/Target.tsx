import { ChangeEventHandler, Fragment } from "react";
import { Label, TextBox, TextBoxBorderless } from "./FormsRelated";
import { TargetOutputs, TargetInputs } from "../types";

export type OnChange = (name: keyof TargetInputs, value: string) => void;

type TargetProps = {
  type: "profit" | "loss";
  targetDetails: TargetOutputs;
  onChange: OnChange;
};

export default function Target({ targetDetails, ...props }: TargetProps) {
  const isProfit = props.type === "profit";

  const onFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    if (name in targetDetails) {
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
            value={targetDetails.totalTarget}
            onChange={onFieldChange}
          />
        </div>
        <TextBox
          name="targetPercentage"
          value={targetDetails.targetPercentage}
          onChange={onFieldChange}
        />
        <Label>%</Label>
      </div>
      <div className="w-[400px] grid grid-cols-2 gap-y-2 items-center mt-2">
        <Label>{isProfit ? "Expected profit PU" : "Bearable loss PU"}</Label>
        <TextBox
          name="targetPU"
          value={targetDetails.targetPU}
          onChange={onFieldChange}
        />
        <Label>Unit selling price</Label>
        <TextBox
          name="unitSellingPrice"
          value={targetDetails.unitSellingPrice}
          onChange={onFieldChange}
        />
        <Label>Total selling price</Label>
        <TextBox
          name="totalSellingPrice"
          value={targetDetails.totalSellingPrice}
          onChange={onFieldChange}
        />
      </div>

      <div className="w-[400px] grid grid-cols-2 items-center mt-6">
        <Label>Selling cost</Label>
        <TextBoxBorderless value={targetDetails.sellingCost} readOnly />
        <Label>Total cost</Label>
        <TextBoxBorderless value={targetDetails.totalCost} readOnly />
        {targetDetails.costDetails.map((fee) => (
          <Fragment key={fee.name}>
            <Label className="text-sm">{fee.name}</Label>
            <TextBoxBorderless value={fee.value} className="text-sm" readOnly />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
