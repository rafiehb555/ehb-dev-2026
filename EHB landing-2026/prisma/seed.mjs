/**
 * Seed demo users for local/dev DB checkout (valid Mongo ObjectIds).
 * Run: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("EhbDemo2026!", 12);

  const seeds = [
    { name: "Demo Buyer", email: "demo-buyer@ehb.local", role: "USER" },
    { name: "Demo Seller", email: "demo-seller@ehb.local", role: "SELLER" },
    { name: "Demo Admin", email: "demo-admin@ehb.local", role: "SUPER_ADMIN" },
  ];

  // Avoid upsert (Mongo standalone often lacks replica-set transactions).
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

  console.log("Seeded:", seeds.map((s) => s.email).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
