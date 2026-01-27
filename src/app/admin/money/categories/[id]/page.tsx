import { notFound } from "next/navigation";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import ClientForm from "./components/ClientForm";
import categoriesService from "@/services/categories.service";

export default async function CategoryPage(
  props: Readonly<PageProps<"/admin/money/categories/[id]">>,
) {
  const { id } = await props.params;

  const category =
    id === "new" ? undefined : await categoriesService.getCategoryById(id);

  if (category === null) notFound();

  return (
    <PageContainer>
      <Header1>A Category</Header1>

      <ClientForm category={category} isNew={id === "new"} />
    </PageContainer>
  );
}
