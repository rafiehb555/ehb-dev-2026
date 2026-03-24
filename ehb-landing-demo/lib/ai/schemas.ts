import { z } from "zod";

export const MemoryQuerySchema = z.object({
  message: z.string().trim().min(3).max(4000),
  traceId: z.string().trim().max(120).optional(),
});

