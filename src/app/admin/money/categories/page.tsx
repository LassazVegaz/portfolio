import FloatingAction from "@/components/FloatingAction";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default function CategoriesPage() {
  return (
    <PageContainer>
      <Header1>Categories</Header1>

      <FloatingAction href={{ pathname: "/admin/money/categories/new" }}>
        +
      </FloatingAction>
    </PageContainer>
  );
}
