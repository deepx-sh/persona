import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { deleteMessage } from "../controllers/message.controller.js";

const router = Router()
router.use(requireAuth)
router.delete("/:messageId", deleteMessage)

export default router;