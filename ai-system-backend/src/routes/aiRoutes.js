const express = require("express");
const { postChat, getMemory, postMemoryUpdate } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", postChat);
router.get("/memory", getMemory);
router.post("/memory/update", postMemoryUpdate);

module.exports = router;
