import { twMerge } from "tailwind-merge";

type FieldContainerProps = { label: string; children?: React.ReactNode };

export const FieldContainer = (props: FieldContainerProps) => (
  <div>
    <div>{props.label}</div>
    {props.children}
  </div>
);

export const SelectField = (props: React.ComponentProps<"select">) => (
  <select
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  />
);

export const SelectOption = (props: React.ComponentProps<"option">) => (
  <option className="bg-white text-black" {...props} />
);

export const InputField = (props: React.ComponentProps<"input">) => (
  <input
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  />
);

export const FormButton = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <button
    className={twMerge(
      "border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 min-w-20",
      className,
    )}
    {...props}
  />
);
