import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import TopNavigator from "@/components/HomeButton";
import ClientForm from "./components/ClientForm";
import categoriesService from "@/services/categories.service";

/**
 * Only top-level, non-system categories can be parents. This keeps the
 * hierarchy to the two levels supported by the product.
 */
const getCategories = async (currentId?: string) => {
  const categories = await categoriesService.getAvailableParents(currentId);

  return categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
};

export default async function CategoryPage(
  props: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const { id } = await props.params;
  const isNew = id === "new";

  const category = isNew ? null : await categoriesService.getCategoryById(id);

  if (!isNew && !category) notFound();

  const categories = await getCategories(isNew ? undefined : id);

  return (
    <main className="admin-shell min-h-screen">
    <PageContainer className="mx-auto max-w-2xl">
      <TopNavigator links={["home", "money"]} />
      <p className="admin-eyebrow mt-10">Money settings</p>
      <h1 className="mt-2 text-3xl font-semibold">
        {isNew ? "New category" : category?.name}
      </h1>

      <ClientForm
        category={category}
        isNew={isNew}
        categories={categories}
      />
    </PageContainer>
    </main>
  );
}
