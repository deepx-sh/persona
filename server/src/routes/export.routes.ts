import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { exportContacts, exportMessages } from "../controllers/export.controller.js";

const router = Router();

router.use(requireAuth)

router.get("/contacts", exportContacts)
router.get("/messages", exportMessages)

export default router;