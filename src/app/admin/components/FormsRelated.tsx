export const TextBox = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <input
    className={`border-2 border-blue-600 outline-none py-0.5 px-1 text-right ${className}`}
    {...props}
  />
);

export const TextBoxBorderless = ({
  className,
  ...props
}: React.ComponentProps<typeof TextBox>) => (
  <TextBox className={`border-none ${className}`} {...props} />
);

export const Label = ({
  className,
  ...props
}: React.ComponentProps<"label">) => (
  <label className={`text-lg ${className}`} {...props} />
);
