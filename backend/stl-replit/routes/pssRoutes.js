import express from "express";
import { getPss, getPssRisk, updatePssVerification } from "../controllers/pssController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { pssVerificationSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/pss/:userId", requireAuth, getPss);
router.patch("/pss/:userId/verification", requireAuth, validateBody(pssVerificationSchema), updatePssVerification);
router.get("/pss/:userId/risk", requireAuth, getPssRisk);

export default router;

