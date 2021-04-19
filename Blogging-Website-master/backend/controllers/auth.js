const User = require("../models/user");
const Blog = require("../models/blog");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const emailData = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `Password Activation Link`,
      html: `
          <p>Please use the following link to activate your account:</p>
          <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
          <hr/>
          <p>This email may contain sensitive information</p>
      `,
    };
    sgMail.send(emailData).then((sent) => {
      return res.json({
        message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
      });
    });
  });
};

// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken",
//       });
//     }
// let username = shortId.generate();
// let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//     let newUser = new User({ name, email, password, profile, username });
//     newUser.save((err, success) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//         });
//       }
//       res.json({
//         message: "Signup success! Please signin",
//       });
//     });
//   });
// };

exports.signup = (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired Link. Signup again",
        });
      }
      const { name, email, password } = jwt.decode(token);

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });
      user.save((err, user) => {
        if (err) {
          return res.json(401).json({
            error: errorHandler(err),
          });
        }
        return res.json({
          message: "Signup Success. Please signin",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try Again",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // cehck user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exists.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    // generate token nd send to client
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { expiresIn: "1h" });
    const { _id, username, name, email, role } = user;

    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout Success!!!",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  // gives user id
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin area. Access denied!!!",
      });
    }

    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString(); // requireSignin => req.profile

    if (!authorizedUser) {
      return res.status(400).json({
        error: "Not Authorized",
      });
    }
    next();
  });
};

// forgot, reset password

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exists",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });
    // email
    const emailData = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `Password Reset Link`,
      html: `
          <p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr/>
          <p>This email may contain sensitive information</p>
      `,
    };

    // populating db => resetpass link
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sgMail.send(emailData).then((sent) => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min`,
          });
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Try again",
        });
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: "Something went wrong. Try later",
          });
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log(response)
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            // console.log(user)
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.cookie("token", token, { expiresIn: "1d" });
            const { _id, email, name, role, username } = user;
            return res.json({
              token,
              user: { _id, email, name, role, username },
            });
          } else {
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti;
            user = new User({ name, email, profile, username, password });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );
              res.cookie("token", token, { expiresIn: "1h" });
              const { _id, email, name, role, username } = data;
              return res.json({
                token,
                user: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again.",
        });
      }
    });
};

// fb

exports.facebookLogin = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
