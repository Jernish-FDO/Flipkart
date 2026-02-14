import { productsApi, categoriesApi } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent, Skeleton } from "@repo/ui";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const categoryId = searchParams.category as string | undefined;
  const search = searchParams.search as string | undefined;

  const [productsData, categories] = await Promise.all([
    productsApi.getAll({ page, pageSize: 12, categoryId, search }),
    categoriesApi.getAll(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/products"
                    className="text-sm hover:text-primary block py-1"
                  >
                    All Products
                  </a>
                </li>
                {categories?.map((category: any) => (
                  <li key={category.id}>
                    <a
                      href={`/products?category=${category.id}`}
                      className="text-sm hover:text-primary block py-1"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              {search ? `Search Results for "${search}"` : 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {productsData.total} products found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.data?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {productsData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/products?page=${p}${categoryId ? `&category=${categoryId}` : ''}${search ? `&search=${search}` : ''}`}
                  className={`px-4 py-2 rounded-md ${
                    p === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
