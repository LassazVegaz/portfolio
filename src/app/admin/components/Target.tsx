import { ChangeEventHandler } from "react";
import { Label, TextBox, TextBoxBorderless } from "./FormsRelated";
import { TargetOutputs, TargetInputs } from "../types";

export type OnChange = (name: keyof TargetInputs, value: string) => void;

type TargetProps = {
  type: "profit" | "loss";
  targetDetails: TargetOutputs;
  showTargetPU: boolean;
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
    <div className={`${!isProfit ? "xl:justify-self-end" : ""}`}>
      <div className="grid grid-cols-2 gap-y-2 items-center max-w-[400px] w-full">
        <Label>
          {isProfit ? "Total expected profit" : "Total bearable loss"}
        </Label>
        <TextBox
          name="totalTarget"
          value={targetDetails.totalTarget}
          onChange={onFieldChange}
        />
        <Label>
          {isProfit ? "Profit as a percentage" : "Profit as a percentage"}
        </Label>
        <TextBox
          name="targetPercentage"
          value={targetDetails.targetPercentage}
          onChange={onFieldChange}
        />
        {props.showTargetPU && (
          <>
            <Label>
              {isProfit ? "Expected profit PU" : "Bearable loss PU"}
            </Label>
            <TextBox
              name="targetPU"
              value={targetDetails.targetPU}
              onChange={onFieldChange}
            />
          </>
        )}
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

      <div className="max-w-[400px] w-full grid grid-cols-2 items-center mt-6">
        <Label>Selling cost</Label>
        <TextBoxBorderless value={targetDetails.sellingCost} readOnly />
        <Label>Total cost</Label>
        <TextBoxBorderless value={targetDetails.totalCost} readOnly />
        <Label>Total selling price {isProfit ? "AC" : "BC"}</Label>
        <TextBoxBorderless value={targetDetails.totalSellingPriceAC} readOnly />
        <Label>Unit selling price {isProfit ? "AC" : "BC"}</Label>
        <TextBoxBorderless value={targetDetails.unitSellingPriceAC} readOnly />
      </div>
    </div>
  );
}
