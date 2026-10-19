import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { csvUpload } from "../config/multer.js";

import { uploadContactsCSV, getContacts, getContactById, updateContact, deleteContact } from "../controllers/contact.controller.js";
import { analyzeContactProfile } from "../controllers/profileAnalyzer.controller.js";
import { generateContactMessage, getContactMessage } from "../controllers/message.controller.js";
import { generateContactIcebreakers, getContactIcebreakers } from "../controllers/icebreaker.controller.js";
import { aiBurstLimiter,aiDailyLimiter } from "../middlewares/aiRateLimiter.middleware.js";
const router = Router()

router.use(requireAuth)

router.post("/upload", csvUpload.single("file"), uploadContactsCSV)
router.get("/", getContacts)
router.get("/:id", getContactById);
router.post("/:id/analyze",aiBurstLimiter,aiDailyLimiter, analyzeContactProfile)
router.post("/:id/messages/generate",aiBurstLimiter,aiDailyLimiter, generateContactMessage)
router.get("/:id/messages", getContactMessage)
router.post("/:id/icebreakers/generate",aiBurstLimiter,aiDailyLimiter, generateContactIcebreakers);
router.get("/:id/icebreakers",getContactIcebreakers)
router.patch("/:id", updateContact)
router.delete("/:id",deleteContact)

export default router;