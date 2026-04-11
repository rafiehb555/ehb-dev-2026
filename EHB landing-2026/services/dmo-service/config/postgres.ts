import { Pool } from "pg";

export const pgPool = new Pool({
  host: process.env.POSTGRES_HOST ?? "postgres",
  user: process.env.POSTGRES_USER ?? "ehb",
  password: process.env.POSTGRES_PASSWORD ?? "ehb123",
  database: process.env.POSTGRES_DB ?? "ehb_db",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  max: 10,
});
