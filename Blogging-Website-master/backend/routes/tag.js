const express = require("express");
const router = express.Router();

// validators
const { runValidation } = require("../validators/index");
const { tagCreateValidator } = require("../validators/tag");

// controller
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/tag");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
