import { productsApi } from "@/lib/api";
import ProductDetailClient from "./product-detail-client";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await productsApi.getBySlug(params.slug);

  return <ProductDetailClient product={product} />;
}
