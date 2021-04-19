const { check } = require("express-validator");

exports.contactFormValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Please, enter a valid email"),
  check("message")
    .isLength({ min: 10 })
    .withMessage("Message should be of min 10 characters long"),
];
