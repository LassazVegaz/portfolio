import { notFound } from "next/navigation";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import ClientForm from "./components/ClientForm";
import categoriesService from "@/services/categories.service";

/**
 * Get all cetegories excluding the current category.
 * If currentId is provided, also exclude its child categories.
 */
const getCategories = async (currentId?: string) => {
  const categories = currentId
    ? await categoriesService.getNonChildCategories(currentId)
    : await categoriesService.getAllCategories();

  return categories
    .filter((cat) => cat.id !== currentId)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
};

export default async function CategoryPage(
  props: Readonly<PageProps<"/admin/money/categories/[id]">>,
) {
  const { id } = await props.params;
  const isNew = id === "new";

  const category = isNew ? null : await categoriesService.getCategoryById(id);

  if (!isNew && !category) notFound();

  const hasChildCategories = isNew
    ? undefined
    : await categoriesService.hasChildCategories(id);

  const categories = await getCategories(isNew ? undefined : id);

  return (
    <PageContainer>
      <Header1>A Category</Header1>

      <ClientForm
        category={category}
        isNew={isNew}
        categories={categories}
        hasChildCategories={hasChildCategories}
      />
    </PageContainer>
  );
}
