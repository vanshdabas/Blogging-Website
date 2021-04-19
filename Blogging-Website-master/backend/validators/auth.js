const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Please, enter a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be of atleast 6 characters long"),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Please, enter a valid email"),
  check("password").isLength({ min: 6 }).withMessage("Invalid Password"),
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Please, enter a valid email"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be of atleast 6 characters long"),
];
