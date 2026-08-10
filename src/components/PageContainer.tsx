/**
 * The main container of the page
 */
export default function PageContainer(props: React.ComponentProps<"div">) {
  const { className = "", ...rest } = props;
  return <div {...rest} className={`px-page py-page sm:px-6 ${className}`} />;
}
