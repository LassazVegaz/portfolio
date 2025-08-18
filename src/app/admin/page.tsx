const TextBox = ({ className, ...props }: React.ComponentProps<"input">) => (
  <input
    readOnly
    className={`border-2 border-blue-600 outline-none py-0.5 px-1 text-right ${className}`}
    {...props}
  />
);

const TextBoxBorderless = ({
  className,
  ...props
}: React.ComponentProps<typeof TextBox>) => (
  <TextBox className={`border-none ${className}`} {...props} />
);

const Label = ({ className, ...props }: React.ComponentProps<"label">) => (
  <label className={`text-lg ${className}`} {...props} />
);

type TargetProps = { type: "profit" | "loss" };

const Target = (props: TargetProps) => {
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
};

export default function AdminPage() {
  return (
    <div className="px-20 py-2">
      <h1 className="text-3xl font-bold text-center">Stocks Calculator</h1>

      <div className="flex justify-center">
        <div className="mt-14 w-[400px] grid grid-cols-2 gap-y-2 items-center">
          <Label>Unit buying price</Label>
          <TextBox />
          <Label>Quantity</Label>
          <TextBox />
          <Label>Total buying price</Label>
          <TextBox />
          <Label>Cost</Label>
          <TextBoxBorderless value={1.09} />
        </div>
      </div>

      <div className="mt-14 grid xl:grid-cols-2 justify-center xl:justify-normal gap-y-20">
        <Target type="profit" />
        <Target type="loss" />
      </div>
    </div>
  );
}
