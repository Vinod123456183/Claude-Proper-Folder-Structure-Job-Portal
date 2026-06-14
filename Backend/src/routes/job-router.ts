// ═══════════════════════════════════════════════
// job-router.ts
// ═══════════════════════════════════════════════
import { Router } from "express";
import {
  createJobController,
  getAllJobsController,
  getJobsByCompanyController,
  getJobByIdController,
  updateJobController,
} from "../controllers/job-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { isRecruiter } from "../middleware/role-middleware";

const router = Router();

// Protected (recruiter only)
router.post("/create-job", authMiddleware, isRecruiter, createJobController);
router.put("/update-job/:id", authMiddleware, isRecruiter, updateJobController);

// Public
router.get("/all-jobs", getAllJobsController);
router.get("/jobs-by-company/:companyId", getJobsByCompanyController);
router.get("/job-by-id/:jobId", getJobByIdController);

export default router;
