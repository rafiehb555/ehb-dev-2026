import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { MarketplaceOrderSchema } from "@/lib/marketplace/schemas";
import { writeAuditLog } from "@/lib/audit";
import { syncApplicationRisk } from "@/lib/fraud/orchestration";
import { resolveGosellrProduct } from "@/lib/marketplace/gosellrProductSync";

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = MarketplaceOrderSchema.parse(await req.json());

    if (body.kind === "PRODUCT") {
      const product = await resolveGosellrProduct(body.itemId);
      if (!product || !product.isActive) return fail(404, "NOT_FOUND", "Product not found");
      const qty = body.quantity ?? 1;
      if (product.stock < qty) return fail(409, "OUT_OF_STOCK", "Insufficient stock");

      const order = await prisma.order.create({
        data: {
          buyerId: auth.user.userId,
          sellerId: product.sellerId,
          productId: product.id,
          quantity: qty,
          price: product.price,
          status: "PENDING",
        },
      });

      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: qty } },
      });

      const lineTotal = product.price * qty;
      const needsReview = lineTotal > 500;
      let dmoApplicationId: string | null = null;
      if (needsReview) {
        const dmoApp = await prisma.application.create({
          data: {
            type: "ORDER_REVIEW" as any,
            status: "NEW",
            sourceSystem: "AUTOMATION",
            priority: "HIGH",
            applicantId: auth.user.userId,
            sourceRefId: order.id,
            payload: {
              source: "MARKETPLACE_ORDER",
              orderId: order.id,
              sellerId: product.sellerId,
              thresholdReason: "High value order",
              amount: lineTotal,
            },
          },
          select: { id: true },
        });
        dmoApplicationId = dmoApp.id;
        await syncApplicationRisk(dmoApp.id, auth.user.userId);
      }

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
          dmoApplicationId,
        },
      });
      return ok({ orderId: order.id, kind: body.kind, status: order.status, dmoApplicationId }, { status: 201 });
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

