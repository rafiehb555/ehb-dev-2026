/**
 * Quick Mongo connectivity + replica-set hint for Prisma transactions.
 * Run: npm run db:check
 */
import { prisma } from "../lib/prisma";

type PrismaMongo = {
  $runCommandRaw?: (cmd: Record<string, unknown>) => Promise<unknown>;
};

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("FAIL: DATABASE_URL is not set. Add it to .env (Mongo connection string).");
    process.exit(1);
  }

  await prisma.$connect();
  console.log("OK: Prisma connected.");

  const ext = prisma as unknown as PrismaMongo;
  if (typeof ext.$runCommandRaw === "function") {
    const ping = await ext.$runCommandRaw({ ping: 1 });
    console.log("OK: ping", JSON.stringify(ping));

    try {
      const hello = (await ext.$runCommandRaw({ hello: 1 })) as Record<string, unknown>;
      if (hello?.setName) {
        console.log("OK: replica set:", String(hello.setName));
      } else {
        console.warn(
          "WARN: No replica set name in hello response — Prisma transactions may fail. Use MongoDB Atlas or a local replica set."
        );
      }
    } catch (e) {
      console.warn("WARN: could not run hello:", e instanceof Error ? e.message : e);
    }
  } else {
    await prisma.user.count();
    console.log("OK: database reachable (count query).");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
