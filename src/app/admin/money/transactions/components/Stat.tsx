import cn from "classnames";

export default function Stat({
  label,
  value,
  tone,
}: Readonly<{
  label: string;
  value: string;
  tone?: "positive" | "negative";
}>) {
  return (
    <div className="admin-stat-card">
      <span>{label}</span>
      <strong
        className={cn({
          "text-emerald-300": tone === "positive",
          "text-rose-300": tone === "negative",
        })}
      >
        {value}
      </strong>
    </div>
  );
}
