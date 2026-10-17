import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";
import { getUsers, getUserById, setUserRole, banUser, unbanUser, getPlatformStats } from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin)

router.get("/stats", getPlatformStats)
router.get("/users", getUsers)
router.get("/users/:id", getUserById)
router.patch("/users/:id/role", setUserRole)
router.post("/users/:id/ban", banUser)
router.post("/users/:id/unban", unbanUser)

export default router;