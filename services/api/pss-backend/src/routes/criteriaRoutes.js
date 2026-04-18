import { Router } from "express";
import { getCriteriaSet, getCriteriaByPlatform, CRITERIA_CATALOGUE } from "../modules/criteria/criteriaStore.js";

const router = Router();

/** GET /criteria — list all sets (catalogue keys + meta) */
router.get("/", (req, res) => {
  const list = Object.entries(CRITERIA_CATALOGUE).map(([name, set]) => ({
    name,
    platformId: set.platformId,
    entityType: set.entityType,
    version: set.version,
    itemCount: set.items.length,
  }));
  res.json({ ok: true, sets: list });
});

/** GET /criteria/:setName — full item list for a set */
router.get("/:setName", (req, res) => {
  const set = getCriteriaSet(req.params.setName);
  if (!set) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true, set });
});

/** GET /criteria/for/:platformId/:entityType — resolve by platform+entity */
router.get("/for/:platformId/:entityType", (req, res) => {
  const set = getCriteriaByPlatform(req.params.platformId, req.params.entityType);
  if (!set) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true, set });
});

export default router;
