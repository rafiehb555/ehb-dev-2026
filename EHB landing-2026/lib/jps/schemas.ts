import { z } from "zod";

const JpsStatusSchema = z.enum(["Verified", "Review", "Basic"]);

export const JpsProfileImportSchema = z.object({
  id: z.string().min(2).max(120),
  name: z.string().min(2).max(120),
  designation: z.string().min(2).max(120),
  industry: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  status: JpsStatusSchema,
  experience: z.string().min(2).max(120),
  education: z.string().min(2).max(160),
  certifications: z.array(z.string().min(2).max(160)).max(20),
  skills: z.array(z.string().min(2).max(120)).min(1).max(30),
  services: z.array(z.string().min(2).max(120)).min(1).max(30),
  jobs: z.array(z.string().min(2).max(120)).min(1).max(30),
  stlLevel: z.string().min(2).max(40),
});

export const JpsSkillCategorySchema = z.object({
  category: z.string().min(2).max(120),
  exampleSkills: z.array(z.string().min(2).max(120)).min(1).max(30),
});

export const JpsDesignationLevelSchema = z.object({
  level: z.number().int().min(1).max(50),
  title: z.string().min(2).max(120),
});

export const JpsImportPayloadSchema = z
  .object({
    profiles: z.array(JpsProfileImportSchema).min(1).max(500),
    skillCategories: z.array(JpsSkillCategorySchema).min(1).max(100),
    designationLadders: z.record(z.string().min(2).max(120), z.array(JpsDesignationLevelSchema).min(1).max(50)),
    systemNotes: z.array(z.string().min(4).max(500)).min(1).max(50),
  })
  .superRefine((payload, ctx) => {
    const seen = new Map<string, number>();

    payload.profiles.forEach((profile, index) => {
      const normalizedId = profile.id.trim().toLowerCase();
      const previousIndex = seen.get(normalizedId);
      if (previousIndex !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["profiles", index, "id"],
          message: `Duplicate profile id found. This id is already used at profiles[${previousIndex}].`,
        });
        return;
      }
      seen.set(normalizedId, index);
    });
  });

export type JpsImportPayload = z.infer<typeof JpsImportPayloadSchema>;
