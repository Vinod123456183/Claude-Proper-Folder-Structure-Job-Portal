import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  applyJobController,
  getApplicantsController,
  getAppliedJobsController,
  updateStatusController,
} from "../controllers/application-controller";
import { isStudent, isRecruiter } from "../middleware/role-middleware";

const router = Router();
router.post("/apply-job/:jobId", authMiddleware, isStudent, applyJobController);

router.get(
  "/applied-jobs",
  authMiddleware,
  isStudent,
  getAppliedJobsController,
);

// Recruiter visits a job's applicants page → jobId is in the URL
router.get(
  "/applicants/:jobId",
  authMiddleware,
  isRecruiter,
  getApplicantsController,
);

// Recruiter accepts/rejects from a dropdown → id in URL, status in body
router.put(
  "/update-status/:id",
  authMiddleware,
  isRecruiter,
  updateStatusController,
);

export default router;
