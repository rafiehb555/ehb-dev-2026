/**
 * Criteria catalogue — seed data for all 7 EHB platforms.
 * Each criteria_set is versioned; platforms refer to them by name (e.g. gs_product_v4).
 */

export const CRITERIA_CATALOGUE = {
  gs_product_v4: {
    platformId: "gosellr",
    entityType: "product",
    version: 4,
    items: [
      { id: "c1", title: "Title ≥ 20 chars", required: true, weight: 1 },
      { id: "c2", title: "≥ 3 product images, all ≥ 800px", required: true, weight: 1 },
      { id: "c3", title: "Verified seller identity (PSS)", required: true, weight: 1 },
      { id: "c4", title: "Seller profile complete", required: true, weight: 1 },
      { id: "c5", title: "Category classification valid", required: true, weight: 1 },
      { id: "c6", title: "SKU / GTIN provided", required: false, weight: 1 },
      { id: "c7", title: "Stock quantity declared", required: false, weight: 1 },
      { id: "c8", title: "Return policy attached", required: false, weight: 1 },
      { id: "c9", title: "Shipping zones configured", required: false, weight: 1 },
      { id: "c10", title: "Brand / origin proof", required: false, weight: 1 },
      { id: "c11", title: "Category licence (medical, food, etc)", required: false, weight: 2 },
      { id: "c12", title: "AML screening clean", required: true, weight: 2 },
      { id: "c13", title: "Halal / organic certificate", required: false, weight: 1 },
      { id: "c14", title: "Business registration (NTN)", required: false, weight: 1 },
      { id: "c15", title: "GST compliance record", required: false, weight: 1 },
    ],
  },
  ols_lawyer_v2: {
    platformId: "ols",
    entityType: "lawyer_profile",
    version: 2,
    items: [
      { id: "l1", title: "Bar Council licence uploaded", required: true, weight: 2 },
      { id: "l2", title: "PSS identity verified", required: true, weight: 1 },
      { id: "l3", title: "Practice areas declared", required: true, weight: 1 },
      { id: "l4", title: "Office address proof", required: true, weight: 1 },
      { id: "l5", title: "Clean disciplinary record", required: true, weight: 2 },
      { id: "l6", title: "Years of practice ≥ 2", required: false, weight: 1 },
      { id: "l7", title: "Court appearance history", required: false, weight: 1 },
      { id: "l8", title: "Chambers / firm affiliation", required: false, weight: 1 },
      { id: "l9", title: "LL.B certificate validated", required: true, weight: 1 },
      { id: "l10", title: "Coin lock tier ≥ 2", required: false, weight: 2 },
    ],
  },
  hps_doctor_v3: {
    platformId: "hps",
    entityType: "doctor_profile",
    version: 3,
    items: [
      { id: "d1", title: "PMDC licence verified", required: true, weight: 2 },
      { id: "d2", title: "MBBS certificate validated", required: true, weight: 2 },
      { id: "d3", title: "Speciality board certification", required: false, weight: 2 },
      { id: "d4", title: "PSS identity verified", required: true, weight: 1 },
      { id: "d5", title: "Clinic / hospital affiliation", required: true, weight: 1 },
      { id: "d6", title: "Insurance / malpractice proof", required: false, weight: 1 },
      { id: "d7", title: "Years in practice", required: false, weight: 1 },
      { id: "d8", title: "Patient reviews ≥ 4.0", required: false, weight: 1 },
      { id: "d9", title: "Consultation fee declared", required: true, weight: 1 },
      { id: "d10", title: "Telehealth readiness check", required: false, weight: 1 },
    ],
  },
  jps_freelancer_v2: {
    platformId: "jps",
    entityType: "freelancer_profile",
    version: 2,
    items: [
      { id: "j1", title: "PSS identity verified", required: true, weight: 1 },
      { id: "j2", title: "Skill set declared", required: true, weight: 1 },
      { id: "j3", title: "Portfolio links (≥ 3)", required: true, weight: 1 },
      { id: "j4", title: "Education / certifications", required: false, weight: 1 },
      { id: "j5", title: "Work history ≥ 6 months", required: false, weight: 1 },
      { id: "j6", title: "AML screening clean", required: true, weight: 2 },
      { id: "j7", title: "Rate card published", required: true, weight: 1 },
      { id: "j8", title: "Language proficiency test", required: false, weight: 1 },
      { id: "j9", title: "Coin lock tier ≥ 1", required: false, weight: 1 },
      { id: "j10", title: "Client reviews ≥ 4.5", required: false, weight: 1 },
    ],
  },
  wms_service_v1: {
    platformId: "wms",
    entityType: "service_listing",
    version: 1,
    items: [
      { id: "w1", title: "PSS identity verified", required: true, weight: 1 },
      { id: "w2", title: "Service category valid", required: true, weight: 1 },
      { id: "w3", title: "Trade licence (if applicable)", required: false, weight: 2 },
      { id: "w4", title: "Coverage area declared", required: true, weight: 1 },
      { id: "w5", title: "Pricing transparency", required: true, weight: 1 },
      { id: "w6", title: "Insurance / bond", required: false, weight: 1 },
      { id: "w7", title: "Tools / equipment list", required: false, weight: 1 },
      { id: "w8", title: "Customer reviews ≥ 4.0", required: false, weight: 1 },
    ],
  },
  obs_course_v1: {
    platformId: "obs",
    entityType: "course_listing",
    version: 1,
    items: [
      { id: "o1", title: "Instructor PSS verified", required: true, weight: 1 },
      { id: "o2", title: "Instructor credentials", required: true, weight: 2 },
      { id: "o3", title: "Curriculum complete", required: true, weight: 1 },
      { id: "o4", title: "Learning outcomes declared", required: true, weight: 1 },
      { id: "o5", title: "Minimum 10h content", required: false, weight: 1 },
      { id: "o6", title: "Sample lecture uploaded", required: true, weight: 1 },
      { id: "o7", title: "Quiz / assessment included", required: false, weight: 1 },
      { id: "o8", title: "Certificate template", required: false, weight: 1 },
    ],
  },
  agts_travel_v1: {
    platformId: "agts",
    entityType: "travel_service",
    version: 1,
    items: [
      { id: "t1", title: "PSS identity verified", required: true, weight: 1 },
      { id: "t2", title: "PTDC / tourism licence", required: true, weight: 2 },
      { id: "t3", title: "Vehicle / asset registration", required: false, weight: 1 },
      { id: "t4", title: "Insurance proof", required: true, weight: 1 },
      { id: "t5", title: "Itinerary template", required: true, weight: 1 },
      { id: "t6", title: "Driver / guide credentials", required: false, weight: 1 },
      { id: "t7", title: "Safety certification", required: false, weight: 1 },
      { id: "t8", title: "Customer reviews ≥ 4.0", required: false, weight: 1 },
    ],
  },
};

export function getCriteriaSet(setName) {
  return CRITERIA_CATALOGUE[setName] || null;
}

export function getCriteriaByPlatform(platformId, entityType) {
  const match = Object.values(CRITERIA_CATALOGUE).find(
    (c) => c.platformId === platformId && c.entityType === entityType
  );
  return match || null;
}
