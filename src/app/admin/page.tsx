"use client";
import { ChangeEventHandler, useRef, useState } from "react";
import { Label, TextBox, TextBoxBorderless } from "./components/FormsRelated";
import Target, { TargetInputs } from "./components/Target";
import {
  bearableLossCalculator as lossCalculator,
  calculatePrimaryValues,
  PrimaryValues,
  State,
  expectedProfitCalculator as profitCalculator,
} from "./helpers/calculator";

export default function AdminPage() {
  const state = useRef<State>({
    primaryValues: {
      unitBuyingPrice: 0,
      quantity: 0,
      totalBuyingPrice: 0,
    },
    profitTargetValues: {
      totalTarget: 0,
      targetPU: 0,
      targetPercentage: 0,
      unitSellingPrice: 0,
      totalSellingPrice: 0,
    },
    lossTargetValues: {
      totalTarget: 0,
      targetPU: 0,
      targetPercentage: 0,
      unitSellingPrice: 0,
      totalSellingPrice: 0,
    },
  });

  const [primaryValues, setPrimaryValues] = useState({
    unitBuyingPrice: "0",
    quantity: "0",
    totalBuyingPrice: "0",
  });

  const [profitTarget, setProfitTarget] = useState<TargetInputs>({
    totalTarget: "0",
    targetPU: "0",
    targetPercentage: "0",
    unitSellingPrice: "0",
    totalSellingPrice: "0",
  });

  const [lossTarget, setLossTarget] = useState<TargetInputs>({
    totalTarget: "0",
    targetPU: "0",
    targetPercentage: "0",
    unitSellingPrice: "0",
    totalSellingPrice: "0",
  });

  const onProfitTargetChange = (name: keyof TargetInputs, value: string) => {
    state.current.profitTargetValues[name] = parseFloat(value);
    const expectedProfitPU = profitCalculator.calculateTargetPU(
      name,
      state.current.profitTargetValues[name],
      state.current.primaryValues
    );
    state.current.profitTargetValues = profitCalculator.calculateTargetValues(
      state.current.primaryValues,
      expectedProfitPU
    );

    setProfitTarget({
      totalTarget: state.current.profitTargetValues.totalTarget.toFixed(2),
      targetPU: state.current.profitTargetValues.targetPU.toFixed(2),
      targetPercentage:
        state.current.profitTargetValues.targetPercentage.toString(),
      unitSellingPrice:
        state.current.profitTargetValues.unitSellingPrice.toFixed(2),
      totalSellingPrice:
        state.current.profitTargetValues.totalSellingPrice.toFixed(2),
      [name]: value,
    });
  };

  const onLossTargetChange = (name: keyof TargetInputs, value: string) => {
    state.current.lossTargetValues[name] = parseFloat(value);
    const bearableLossPU = lossCalculator.calculateTargetPU(
      name,
      state.current.lossTargetValues[name],
      state.current.primaryValues
    );
    state.current.lossTargetValues = lossCalculator.calculateTargetValues(
      state.current.primaryValues,
      bearableLossPU
    );

    setLossTarget({
      totalTarget: state.current.lossTargetValues.totalTarget.toFixed(2),
      targetPU: state.current.lossTargetValues.targetPU.toFixed(2),
      targetPercentage:
        state.current.lossTargetValues.targetPercentage.toString(),
      unitSellingPrice:
        state.current.lossTargetValues.unitSellingPrice.toFixed(2),
      totalSellingPrice:
        state.current.lossTargetValues.totalSellingPrice.toFixed(2),
      [name]: value,
    });
  };

  const onPrimaryFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setPrimaryValues((prev) => ({ ...prev, [name]: value }));

    if (!(name in primaryValues)) return;
    const fieldName = name as keyof PrimaryValues;

    const fieldValue = parseFloat(value);
    if (isNaN(fieldValue)) return;

    state.current.primaryValues[fieldName] = fieldValue;
    calculatePrimaryValues[fieldName](state.current.primaryValues);
    setPrimaryValues(() => ({
      unitBuyingPrice: state.current.primaryValues.unitBuyingPrice.toFixed(2),
      quantity: state.current.primaryValues.quantity.toString(),
      totalBuyingPrice: state.current.primaryValues.totalBuyingPrice.toFixed(2),
      [fieldName]: value,
    }));

    state.current.profitTargetValues = profitCalculator.calculateTargetValues(
      state.current.primaryValues,
      state.current.profitTargetValues.targetPU
    );
    setProfitTarget({
      totalTarget: state.current.profitTargetValues.totalTarget.toFixed(2),
      targetPU: state.current.profitTargetValues.targetPU.toFixed(2),
      targetPercentage:
        state.current.profitTargetValues.targetPercentage.toString(),
      unitSellingPrice:
        state.current.profitTargetValues.unitSellingPrice.toFixed(2),
      totalSellingPrice:
        state.current.profitTargetValues.totalSellingPrice.toFixed(2),
    });

    state.current.lossTargetValues = lossCalculator.calculateTargetValues(
      state.current.primaryValues,
      state.current.lossTargetValues.targetPU
    );
    setLossTarget({
      totalTarget: state.current.lossTargetValues.totalTarget.toFixed(2),
      targetPU: state.current.lossTargetValues.targetPU.toFixed(2),
      targetPercentage:
        state.current.lossTargetValues.targetPercentage.toString(),
      unitSellingPrice:
        state.current.lossTargetValues.unitSellingPrice.toFixed(2),
      totalSellingPrice:
        state.current.lossTargetValues.totalSellingPrice.toFixed(2),
    });
  };

  return (
    <div className="px-20 py-2">
      <h1 className="text-3xl font-bold text-center">Stocks Calculator</h1>

      <div className="flex justify-center">
        <div className="mt-14 w-[400px] grid grid-cols-2 gap-y-2 items-center">
          <Label>Unit buying price</Label>
          <TextBox
            name="unitBuyingPrice"
            value={primaryValues.unitBuyingPrice}
            onChange={onPrimaryFieldChange}
          />
          <Label>Quantity</Label>
          <TextBox
            name="quantity"
            value={primaryValues.quantity}
            onChange={onPrimaryFieldChange}
          />
          <Label>Total buying price</Label>
          <TextBox
            name="totalBuyingPrice"
            value={primaryValues.totalBuyingPrice}
            onChange={onPrimaryFieldChange}
          />
          <Label>Cost </Label>
          <TextBoxBorderless value={1.09} readOnly />
        </div>
      </div>

      <div className="mt-14 grid xl:grid-cols-2 justify-center xl:justify-normal gap-y-20">
        <Target
          type="profit"
          inputs={profitTarget}
          onChange={onProfitTargetChange}
        />
        <Target type="loss" inputs={lossTarget} onChange={onLossTargetChange} />
      </div>
    </div>
  );
}
