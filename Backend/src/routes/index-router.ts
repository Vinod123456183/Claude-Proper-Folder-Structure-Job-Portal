import { Router } from "express";
import { Log } from "../controllers/index-controller";

const router = Router();

router.get("/as", Log);

export default router;