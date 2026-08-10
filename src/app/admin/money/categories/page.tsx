import FloatingAction from "@/components/FloatingAction";
import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import categoriesService from "@/services/categories.service";
import Link from "next/link";
import { Route } from "next";
import { formatMoney } from "@/features/money/money";

export default async function CategoriesPage() {
  const categories = await categoriesService.getAllCategories();
  const roots = categories.filter((category) => !category.parentId);

  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-4xl">
        <TopNavigator links={["home", "money"]} />
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="admin-eyebrow">Organise transactions</p>
            <h1 className="mt-2 text-3xl font-semibold">Categories</h1>
          </div>
          <span className="text-sm text-slate-400">{categories.length} total</span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {roots.map((category) => {
            const children = categories.filter(
              (candidate) => candidate.parentId === category.id,
            );
            return (
              <section key={category.id} className="admin-panel rounded-2xl p-5">
                <Link
                  href={`/admin/money/categories/${category.id}`}
                  className="flex items-center justify-between font-semibold hover:text-emerald-300"
                >
                  {category.name}
                  {category.isSystem && (
                    <span className="admin-badge">Default</span>
                  )}
                </Link>
                {!category.isSystem && (
                  <p className="mt-2 text-xs text-admin-muted">
                    {formatMoney(category.monthlyBudgetCents)} monthly budget
                  </p>
                )}
                {children.length > 0 && (
                  <div className="mt-4 grid gap-2">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/admin/money/categories/${child.id}`}
                        className="flex items-center justify-between rounded-lg border border-admin-line bg-white/4 px-3 py-2 text-sm hover:border-admin-accent/40"
                      >
                        {child.name}
                        <span className="text-xs text-admin-muted">
                          {formatMoney(child.monthlyBudgetCents)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        <FloatingAction href={"/admin/money/categories/new" as Route}>+</FloatingAction>
      </PageContainer>
    </main>
  );
}
