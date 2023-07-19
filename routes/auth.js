const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");

const authControllers = require("../controllers/auth");
const { getUserByEmail, getUserByUsername } = require("../models/User");
const User = require("../models/User");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").not().isEmpty().withMessage("Please provide your name"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be minimum 6 characters long"),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .custom((value, { req }) => {
        return getUserByEmail(value).then((user) => {
          if (user)
            return Promise.reject("A user with same email already exists");
        });
      }),
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a username")
      .custom((value, { req }) => {
        return getUserByUsername(value).then((user) => {
          if (user)
            return Promise.reject("A user with same username already exists");
        });
      }),
  ],
  authControllers.signup
);

router.post(
  "/login",
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide a username")
      .custom((value, { req }) => {
        return User.getUserByUsername(value).then((user) => {
          if (!user)
            return Promise.reject("No account found with this username");
          req.user = user;
        });
      })
      .bail({level: 'request'}),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be minimum 6 characters long")
      .custom((value, { req }) => {
        if (req.user) {
          return bcrypt.compare(value, req.user.password).then((matched) => {
            if (!matched) return Promise.reject("Wrong Password");
          });
        }
      }),
  ],
  authControllers.login
);

router.post('/update-profile', isAuth, authControllers.updateProfile);

router.get('/profile/:userId', isAuth, authControllers.getProfile);

module.exports = router;
