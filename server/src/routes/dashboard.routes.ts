import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";


const router = Router()

router.use(requireAuth)
router.get("/stats", getDashboardStats)

export default router;