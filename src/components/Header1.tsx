/**
 * Main header of a page
 */
export default function Header1(props: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={`text-2xl sm:text-3xl font-bold text-center ${props.className}`}
    />
  );
}
