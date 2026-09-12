import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { csvUpload } from "../config/multer.js";

import { uploadContactsCSV, getContacts, getContactById, updateContact, deleteContact } from "../controllers/contact.controller.js";

const router = Router()

router.use(requireAuth)

router.post("/upload", csvUpload.single("file"), uploadContactsCSV)
router.get("/", getContacts)
router.get("/:id", getContactById);
router.patch("/:id", updateContact)
router.delete("/:id",deleteContact)

export default router;