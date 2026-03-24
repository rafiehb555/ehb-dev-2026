import { z } from "zod";

export const MarketplaceKindSchema = z.enum(["SERVICE_PROVIDER", "PRODUCT"]);

export const MarketplaceListQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  type: z.enum(["ALL", "SERVICES", "PRODUCTS"]).default("ALL"),
  industry: z.string().trim().min(1).max(120).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(1).max(1000).optional(),
  minStlLevel: z.coerce.number().int().min(0).max(5).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
});

export const MarketplaceOrderSchema = z.object({
  kind: MarketplaceKindSchema,
  itemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export const MarketplaceReviewSchema = z.object({
  kind: MarketplaceKindSchema,
  itemId: z.string().cuid(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(3000).optional(),
});

