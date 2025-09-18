import express from "express";  
import {body, query} from "express-validator";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import {
  createLead,
  deleteLead,
  getLeads,
  getSingleLead,
  summaryStats,
  updateLead,
} from "../controllers/lead.controller.js";
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("sortBy")
      .optional()
      .isIn([
        "first_name",
        "last_name",
        "email",
        "company",
        "status",
        "source",
        "score",
        "lead_value",
        "created_at",
        "updated_at",
      ])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Sort order must be asc or desc"),
  ],
  getLeads
);

// GET /leads/:id - Get single lead by ID
router.get("/:id", getSingleLead);

// POST /leads - Create new lead
router.post(
  "/",
  [
    body("first_name")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters"),
    body("last_name")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required")
      .isLength({ max: 255 })
      .withMessage("Email must not exceed 255 characters"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10, max: 20 })
      .withMessage("Phone number must be between 10 and 20 characters"),
    body("company")
      .trim()
      .notEmpty()
      .withMessage("Company is required")
      .isLength({ min: 1, max: 200 })
      .withMessage("Company name must be between 1 and 200 characters"),
    body("city")
      .trim()
      .notEmpty()
      .withMessage("City is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("City must be between 1 and 100 characters"),
    body("state")
      .trim()
      .notEmpty()
      .withMessage("State is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("State must be between 1 and 100 characters"),
    body("source")
      .isIn([
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ])
      .withMessage(
        "Source must be one of: website, facebook_ads, google_ads, referral, events, other"
      ),
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "lost", "won"])
      .withMessage(
        "Status must be one of: new, contacted, qualified, lost, won"
      ),
    body("score")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Score must be an integer between 0 and 100"),
    body("lead_value")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Lead value must be a positive number"),
    body("is_qualified")
      .optional()
      .isBoolean()
      .withMessage("is_qualified must be a boolean"),
    body("last_activity_at")
      .optional()
      .isISO8601()
      .withMessage("last_activity_at must be a valid ISO 8601 date"),
  ],
  createLead
);

// PUT /leads/:id - Update existing lead
router.put(
  "/:id",
  [
    body("first_name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name cannot be empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters"),
    body("last_name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Last name cannot be empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required")
      .isLength({ max: 255 })
      .withMessage("Email must not exceed 255 characters"),
    body("phone")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Phone number cannot be empty")
      .isLength({ min: 10, max: 20 })
      .withMessage("Phone number must be between 10 and 20 characters"),
    body("company")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Company cannot be empty")
      .isLength({ min: 1, max: 200 })
      .withMessage("Company name must be between 1 and 200 characters"),
    body("city")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("City cannot be empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("City must be between 1 and 100 characters"),
    body("state")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("State cannot be empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("State must be between 1 and 100 characters"),
    body("source")
      .optional()
      .isIn([
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ])
      .withMessage(
        "Source must be one of: website, facebook_ads, google_ads, referral, events, other"
      ),
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "lost", "won"])
      .withMessage(
        "Status must be one of: new, contacted, qualified, lost, won"
      ),
    body("score")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Score must be an integer between 0 and 100"),
    body("lead_value")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Lead value must be a positive number"),
    body("is_qualified")
      .optional()
      .isBoolean()
      .withMessage("is_qualified must be a boolean"),
    body("last_activity_at")
      .optional()
      .isISO8601()
      .withMessage("last_activity_at must be a valid ISO 8601 date"),
  ],
  updateLead
);

// DELETE /leads/:id - Delete lead
router.delete("/:id", deleteLead);

// GET /leads/stats/summary - Get leads statistics
router.get("/stats/summary", summaryStats);

export default router;
