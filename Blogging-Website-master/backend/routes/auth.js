const express = require("express");
const router = express.Router();

// controller
const {
  signup,
  signin,
  signout,
  requireSignin,
  authMiddleware,
  forgotPassword,
  resetPassword,
  preSignup,
  googleLogin,
  facebookLogin,
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validators/index");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

router.post("/pre-signup", userSignupValidator, runValidation, preSignup);
router.post("/signup", signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

router.post("/google-login", googleLogin);

router.post("/facebook-login", facebookLogin);

// test
// router.get("/secret", requireSignin, (req, res) => {
//   res.json({
//     user: req.user,
//   });
// });

module.exports = router;
