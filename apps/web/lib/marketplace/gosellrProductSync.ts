import { prisma } from "@/lib/prisma";
import { getGosellrProductById } from "@/lib/marketplace/gosellrProducts";

async function demoSellerId(): Promise<string> {
  const seller = await prisma.user.findFirst({
    where: { role: { in: ["SELLER", "PROVIDER"] } },
    select: { id: true },
  });
  if (seller) return seller.id;
  const anyUser = await prisma.user.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
  if (!anyUser) throw new Error("No users in database — register a user first.");
  return anyUser.id;
}

/**
 * Resolves a Product row for GoSellr checkout: by Mongo id, by slug, or creates from static catalog.
 */
export async function resolveGosellrProduct(itemId: string) {
  const byId = await prisma.product.findUnique({
    where: { id: itemId },
    select: { id: true, sellerId: true, price: true, stock: true, isActive: true, slug: true },
  });
  if (byId?.isActive) return byId;

  const bySlug = await prisma.product.findFirst({
    where: { slug: itemId },
    select: { id: true, sellerId: true, price: true, stock: true, isActive: true, slug: true },
  });
  if (bySlug?.isActive) return bySlug;

  const demo = getGosellrProductById(itemId);
  if (!demo) return null;

  const sellerId = await demoSellerId();
  const created = await prisma.product.create({
    data: {
      sellerId,
      name: demo.name,
      slug: demo.id,
      description: demo.short,
      category: demo.category,
      price: demo.priceUsd,
      stock: 999,
      imageUrl: demo.image,
      rating: demo.rating,
      isActive: true,
    },
    select: { id: true, sellerId: true, price: true, stock: true, isActive: true, slug: true },
  });
  return created;
}
