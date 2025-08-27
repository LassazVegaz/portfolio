"use client";
import { ChangeEventHandler, useRef, useState } from "react";
import { Label, TextBox, TextBoxBorderless } from "./components/FormsRelated";
import Target, { OnChange } from "./components/Target";
import {
  bearableLossCalculator as lossCalculator,
  calculatePrimaryValues,
  expectedProfitCalculator as profitCalculator,
} from "./helpers/calculator";
import { PrimaryInputs, PrimaryOutputs, State, TargetOutputs } from "./types";
import { primaryMapper, targetMapper } from "./helpers/mappers";

const defaultTargetOutput: TargetOutputs = {
  totalTarget: "0",
  targetPU: "0",
  targetPercentage: "0",
  unitSellingPrice: "0",
  totalSellingPrice: "0",
  sellingCost: "0",
  totalCost: "0",
  costDetails: [],
};

const defaultState: State = {
  primaryValues: {
    unitBuyingPrice: 0,
    quantity: 0,
    totalBuyingPrice: 0,
    buyingCost: 0,
    costDetails: [],
  },
  profitTargetValues: {
    totalTarget: 0,
    targetPU: 0,
    targetPercentage: 0,
    unitSellingPrice: 0,
    totalSellingPrice: 0,
    sellingCost: 0,
    totalCost: 0,
    costDetails: [],
  },
  lossTargetValues: {
    totalTarget: 0,
    targetPU: 0,
    targetPercentage: 0,
    unitSellingPrice: 0,
    totalSellingPrice: 0,
    sellingCost: 0,
    totalCost: 0,
    costDetails: [],
  },
};

const defaultPrimaryOutputs: PrimaryOutputs = {
  unitBuyingPrice: "0",
  quantity: "0",
  totalBuyingPrice: "0",
  buyingCost: "0",
  costDetails: [],
};

export default function AdminPage() {
  const state = useRef<State>(defaultState);

  const [primaryOutputs, setPrimaryOutputs] = useState(defaultPrimaryOutputs);

  const [profitTarget, setProfitTarget] = useState(defaultTargetOutput);
  const [lossTarget, setLossTarget] = useState(defaultTargetOutput);

  const onProfitTargetChange: OnChange = (name, value) => {
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

    setProfitTarget(targetMapper(state.current.profitTargetValues));
  };

  const onLossTargetChange: OnChange = (name, value) => {
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

    setLossTarget(targetMapper(state.current.lossTargetValues));
  };

  const onPrimaryFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setPrimaryOutputs((prev) => ({ ...prev, [name]: value }));

    if (!(name in primaryOutputs)) return;
    const fieldName = name as keyof PrimaryInputs;

    const fieldValue = parseFloat(value);
    if (isNaN(fieldValue)) return;

    state.current.primaryValues[fieldName] = fieldValue;
    calculatePrimaryValues(fieldName, state.current.primaryValues);
    setPrimaryOutputs(primaryMapper(state.current.primaryValues));

    state.current.profitTargetValues = profitCalculator.calculateTargetValues(
      state.current.primaryValues,
      state.current.profitTargetValues.targetPU
    );
    setProfitTarget(targetMapper(state.current.profitTargetValues));

    state.current.lossTargetValues = lossCalculator.calculateTargetValues(
      state.current.primaryValues,
      state.current.lossTargetValues.targetPU
    );
    setLossTarget(targetMapper(state.current.lossTargetValues));
  };

  return (
    <div className="px-20 py-2">
      <h1 className="text-3xl font-bold text-center">Stocks Calculator</h1>

      <div className="flex justify-center">
        <div className="mt-14 w-[400px] grid grid-cols-2 gap-y-2 items-center">
          <Label>Unit buying price</Label>
          <TextBox
            name="unitBuyingPrice"
            value={primaryOutputs.unitBuyingPrice}
            onChange={onPrimaryFieldChange}
          />
          <Label>Quantity</Label>
          <TextBox
            name="quantity"
            value={primaryOutputs.quantity}
            onChange={onPrimaryFieldChange}
          />
          <Label>Total buying price</Label>
          <TextBox
            name="totalBuyingPrice"
            value={primaryOutputs.totalBuyingPrice}
            onChange={onPrimaryFieldChange}
          />
          <Label>Cost </Label>
          <TextBoxBorderless value={primaryOutputs.buyingCost} readOnly />
        </div>
      </div>

      <div className="mt-14 grid xl:grid-cols-2 justify-center xl:justify-normal gap-y-20">
        <Target
          type="profit"
          targetDetails={profitTarget}
          onChange={onProfitTargetChange}
        />
        <Target
          type="loss"
          targetDetails={lossTarget}
          onChange={onLossTargetChange}
        />
      </div>
    </div>
  );
}
