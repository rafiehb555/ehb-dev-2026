/**
 * Seed demo users and 32 industries (aligned with lib/industry/config.ts).
 * Run: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { INDUSTRY_DB_SEED } from "../lib/industry/industrySeedList";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("EhbDemo2026!", 12);

  const seeds = [
    { name: "Demo Buyer", email: "demo-buyer@ehb.local", role: "USER" as const },
    { name: "Demo Seller", email: "demo-seller@ehb.local", role: "SELLER" as const },
    { name: "Demo Admin", email: "demo-admin@ehb.local", role: "SUPER_ADMIN" as const },
  ];

  for (const u of seeds) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: u.name, role: u.role },
      });
    } else {
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
        },
      });
    }
  }

  console.log("Seeded users:", seeds.map((s) => s.email).join(", "));

  for (const row of INDUSTRY_DB_SEED) {
    const existing = await prisma.industry.findUnique({ where: { slug: row.slug } });
    if (existing) {
      await prisma.industry.update({
        where: { id: existing.id },
        data: {
          name: row.name,
          description: row.description,
          sortOrder: row.sortOrder,
        },
      });
    } else {
      await prisma.industry.create({
        data: {
          slug: row.slug,
          name: row.name,
          description: row.description,
          sortOrder: row.sortOrder,
        },
      });
    }
  }

  console.log("Seeded industries:", INDUSTRY_DB_SEED.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
