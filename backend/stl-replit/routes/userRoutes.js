import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateUserSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/user/:id", requireAuth, getUser);
router.put("/user", requireAuth, validateBody(updateUserSchema), updateUser);

export default router;

