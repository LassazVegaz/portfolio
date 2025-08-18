import { Label, TextBox, TextBoxBorderless } from "./components/FormsRelated";
import Target from "./components/Target";

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
