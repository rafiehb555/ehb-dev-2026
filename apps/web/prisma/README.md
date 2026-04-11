# EHB Prisma Schema

**Phase 31–42 · PostgreSQL**

## Setup

1. Install Prisma (if not already):
   ```bash
   npm install prisma @prisma/client --save-dev
   ```

2. Add to `.env`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/EHB?schema=public"
   ```

3. Generate client and run first migration:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. (Optional) Seed 32 industries from app config:
   - Use `lib/industries.ts` data in a seed script; see [Prisma seeding](https://www.prisma.io/docs/guides/database/seed-database).

## Docs

- Full table design: `docs/EHB_DATABASE_ARCHITECTURE.md`
- Backend APIs: `docs/EHB_BACKEND_ARCHITECTURE.md`
