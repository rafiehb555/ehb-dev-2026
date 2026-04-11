import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";

// Industry keyword mapping
const KEYWORD_INDUSTRIES: Record<string, string> = {
  doctor: "health", clinic: "health", pharmacy: "health", hospital: "health",
  website: "it", app: "it", software: "it", developer: "it", coding: "it",
  teacher: "education", tutor: "education", course: "education", school: "education",
  delivery: "logistics", courier: "logistics", shipping: "logistics", rider: "logistics",
  lawyer: "law", legal: "law", contract: "law",
  finance: "finance", loan: "finance", investment: "finance",
};

// GET /api/search/suggest?q=doctor
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

    if (!q || q.length < 2) return ok({ suggestions: [], detectedIndustry: null });

    // Detect industry from keyword
    const detectedIndustry = Object.entries(KEYWORD_INDUSTRIES).find(([kw]) =>
      q.includes(kw)
    )?.[1] ?? null;

    // Search services
    const services = await prisma.providerService.findMany({
      where: {
        OR: [
          { service: { name: { contains: q, mode: "insensitive" } } },
          { service: { description: { contains: q, mode: "insensitive" } } },
        ],
        isActive: true,
        service: { isActive: true },
      },
      take: 5,
      select: { id: true, service: { select: { name: true } } },
    });

    const suggestions = [
      ...services.map((s) => ({ type: "service" as const, id: s.id, label: s.service.name })),
    ];

    // Also suggest: "People also searched"
    const related = getRelatedTerms(q);

    return ok({ suggestions, detectedIndustry, related });
  } catch (err) {
    return handleRouteError(err);
  }
}

function getRelatedTerms(q: string): string[] {
  const map: Record<string, string[]> = {
    doctor:    ["clinic near me", "telemedicine", "specialist"],
    website:   ["web app", "React developer", "UI designer"],
    delivery:  ["same day delivery", "courier service", "logistics"],
    teacher:   ["online tutor", "home tutor", "IELTS prep"],
  };
  const key = Object.keys(map).find((k) => q.includes(k));
  return key ? map[key] : [];
}
