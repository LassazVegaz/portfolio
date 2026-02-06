import FloatingAction from "@/components/FloatingAction";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import categoriesService from "@/services/categories.service";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await categoriesService.getAllCategories();

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6 max-h-screen">
      <Header1>Categories</Header1>

      <div className="flex flex-col space-y-4 overflow-y-auto mb-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/money/categories/${cat.id}`}
            className="p-4 border border-gray-200 rounded-md"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <FloatingAction href="/admin/money/categories/new">+</FloatingAction>
    </PageContainer>
  );
}
