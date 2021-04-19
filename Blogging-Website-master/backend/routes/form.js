const express = require("express");
const router = express.Router();

// validators
const { runValidation } = require("../validators/index");
const { contactFormValidator } = require("../validators/form");

// controller
const { contactForm, contactBlogAuthorForm } = require("../controllers/form");

router.post("/contact", contactFormValidator, runValidation, contactForm);
router.post(
  "/contact-blog-author",
  contactFormValidator,
  runValidation,
  contactBlogAuthorForm
);

module.exports = router;
