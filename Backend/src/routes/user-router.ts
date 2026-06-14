import { Router } from "express";
import {
  logoutUsercontroller,
  registerUsercontroller,
  loginUsercontroller,
  updateUsercontroller,
} from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = Router();

router.post("/register-user", registerUsercontroller);
router.post("/login-user", loginUsercontroller);
router.get("/logout-user", logoutUsercontroller);

// Protect update user route
router.put("/update-user/:id", authMiddleware, updateUsercontroller);

export default router;
