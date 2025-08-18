import { Label, TextBox, TextBoxBorderless } from "./FormsRelated";

type TargetProps = { type: "profit" | "loss" };

export default function Target(props: TargetProps) {
  const isProfit = props.type === "profit";

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
          <TextBox />
        </div>
        <TextBox />
        <Label>%</Label>
      </div>
      <div className="w-[400px] grid grid-cols-2 gap-y-2 items-center mt-2">
        <Label>{isProfit ? "Expected profit PU" : "Bearable loss PU"}</Label>
        <TextBox />
        <Label>Unit selling price</Label>
        <TextBox />
        <Label>Total selling price</Label>
        <TextBox />
      </div>

      <div className="w-[400px] grid grid-cols-2 items-center mt-6">
        <Label>Cost</Label>
        <TextBoxBorderless value={1.09} />
        <Label className="text-sm">Platform fees</Label>
        <TextBoxBorderless value={0.99} className="text-sm" />
        <Label className="text-sm">Settlement fees</Label>
        <TextBoxBorderless value={0.003} className="text-sm" />
        <Label>Total cost</Label>
        <TextBoxBorderless value={1.09} />
      </div>
    </div>
  );
}
