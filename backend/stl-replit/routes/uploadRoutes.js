import express from "express";
import multer from "multer";
import { uploadCrbDocument, uploadKycDocument } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});

const upload = multer({ storage });
const router = express.Router();

router.post("/upload/kyc", requireAuth, upload.single("file"), uploadKycDocument);
router.post("/upload/crb", requireAuth, upload.single("file"), uploadCrbDocument);

export default router;

