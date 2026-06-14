import { Router } from "express";
import {
  addCompanyController,
  displayAllCompaniesController,
  updateCompanyController,
  displayCompanyByCompanyID,
  displayCompaniesByRecruiterID,
} from "../controllers/company-controller";
import { isRecruiter } from "../middleware/role-middleware";
import { authMiddleware } from "../middleware/auth-middleware";

const router = Router();

// -------------------- PRIVATE ROUTES --------------------
// Only authenticated recruiters can add a company
router.post(
  "/add-company",
  authMiddleware, // Private: requires valid JWT
  isRecruiter, // Private: must be a recruiter
  addCompanyController,
);

// Only authenticated recruiters can update a company
router.patch(
  "/update-company/:id",
  authMiddleware, // Private: requires valid JWT
  isRecruiter, // Private: must be a recruiter
  updateCompanyController,
);

router.get(
  "/display-company-by-recruiter-id/:userId",
  authMiddleware,
  isRecruiter,
  displayCompaniesByRecruiterID,
);

// -------------------- PUBLIC ROUTES --------------------
// Anyone can view all companies
router.get(
  "/display-all-companies",
  displayAllCompaniesController, // Public
);

// Anyone can view a company by ID
router.get(
  "/display-company-by-id/:id",
  displayCompanyByCompanyID, // Public
);

export default router;
