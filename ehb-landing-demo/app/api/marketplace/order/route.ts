import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { MarketplaceOrderSchema } from "@/lib/marketplace/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = MarketplaceOrderSchema.parse(await req.json());

    if (body.kind === "PRODUCT") {
      const product = await prisma.product.findUnique({
        where: { id: body.itemId },
        select: { id: true, sellerId: true, price: true, stock: true, isActive: true },
      });
      if (!product || !product.isActive) return fail(404, "NOT_FOUND", "Product not found");
      if (product.stock < (body.quantity ?? 1)) return fail(409, "OUT_OF_STOCK", "Insufficient stock");

      const order = await prisma.order.create({
        data: {
          buyerId: auth.user.userId,
          sellerId: product.sellerId,
          productId: product.id,
          quantity: body.quantity ?? 1,
          price: product.price,
          status: "PENDING",
        },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "MARKETPLACE_ORDER_CREATED",
        targetType: "OTHER",
        targetId: order.id,
        metadata: {
          kind: body.kind,
          itemId: body.itemId,
          quantity: body.quantity ?? 1,
          notes: body.notes ?? null,
        },
      });
      return ok({ orderId: order.id, kind: body.kind, status: order.status }, { status: 201 });
    }

    const provider = await prisma.providerService.findUnique({
      where: { id: body.itemId },
      select: { id: true, userId: true, serviceId: true, isActive: true },
    });
    if (!provider || !provider.isActive) return fail(404, "NOT_FOUND", "Provider service not found");

    const app = await prisma.application.create({
      data: {
        type: "SERVICE",
        status: "NEW",
        applicantId: auth.user.userId,
        payload: {
          source: "MARKETPLACE_SERVICE_ORDER",
          providerServiceId: provider.id,
          providerUserId: provider.userId,
          serviceId: provider.serviceId,
          quantity: body.quantity ?? 1,
          notes: body.notes ?? null,
        },
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "MARKETPLACE_SERVICE_ORDER_CREATED",
      targetType: "APPLICATION",
      targetId: app.id,
      metadata: { providerServiceId: provider.id, quantity: body.quantity ?? 1, notes: body.notes ?? null },
    });

    return ok({ orderId: app.id, kind: body.kind, status: app.status }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

