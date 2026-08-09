/**
 * The main container of the page
 */
export default function PageContainer(props: React.ComponentProps<"div">) {
  const { className = "", ...rest } = props;
  return <div {...rest} className={`px-5 py-5 sm:px-6 ${className}`} />;
}
