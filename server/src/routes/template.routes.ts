import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { getTemplates, createTemplates, updateTemplate, deleteTemplates } from "../controllers/template.controller.js";

const router = Router()

router.use(requireAuth)

router.get("/", getTemplates)
router.post("/", createTemplates)
router.patch("/:id", updateTemplate)
router.delete("/:id", deleteTemplates)

export default router;