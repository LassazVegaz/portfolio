/**
 * The main container of the page
 */
export default function PageContainer(props: React.ComponentProps<"div">) {
  return <div {...props} className={`py-4 ${props.className}`} />;
}
