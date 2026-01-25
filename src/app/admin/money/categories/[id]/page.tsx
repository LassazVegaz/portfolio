import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import ClientForm from "./components/ClientForm";

export default async function CategoryPage(
  props: Readonly<PageProps<"/admin/money/categories/[id]">>,
) {
  const { id } = await props.params;

  return (
    <PageContainer>
      <Header1>A Category</Header1>

      <ClientForm id={id} />
    </PageContainer>
  );
}
