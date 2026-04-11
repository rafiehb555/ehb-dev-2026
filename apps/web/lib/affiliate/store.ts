import { z } from "zod";
import { AppDataScope } from "@prisma/client";
import { readPersistentAppData, supportsDatabaseAppData, writePersistentAppData } from "@/lib/appDataStore";

const CommissionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fromUser: z.string(),
  amount: z.number(),
  type: z.string(),
  createdAt: z.string(),
  sourcePaymentId: z.string().optional(),
});

const AffiliateStoreSchema = z.object({
  referralCodes: z.record(z.string(), z.string()).default({}),
  referredBy: z.record(z.string(), z.string()).default({}),
  commissions: z.array(CommissionSchema).default([]),
});

export type AffiliateStore = z.infer<typeof AffiliateStoreSchema>;
export type AffiliateCommission = z.infer<typeof CommissionSchema>;

function parseStore(input: unknown): AffiliateStore {
  return AffiliateStoreSchema.parse(input);
}

export async function readAffiliateStore(): Promise<AffiliateStore> {
  if (!supportsDatabaseAppData()) return parseStore({});
  const rec = await readPersistentAppData(AppDataScope.OTHER, parseStore);
  return rec?.payload ?? parseStore({});
}

export async function writeAffiliateStore(payload: AffiliateStore, actorId?: string | null) {
  if (!supportsDatabaseAppData()) return;
  await writePersistentAppData({
    scope: AppDataScope.OTHER,
    payload,
    parse: parseStore,
    reason: "affiliate-store-update",
    actorId: actorId ?? null,
  });
}

export function buildReferralCode(name: string, userId: string) {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6);
  return `${base || "EHB"}${userId.slice(-4).toUpperCase()}`;
}

