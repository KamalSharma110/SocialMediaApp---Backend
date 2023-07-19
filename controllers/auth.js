const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const { name, username, email } = req.body;
      const user = new User(name, username, email, hashedPassword);
      return user.createUser();
    })
    .then(() => res.sendStatus(201))
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = jwt.sign(req.user, "supersecretkey");
  const { password, _id: id, ...other } = req.user;

  res.status(200).json({ token, currentUser: { id, ...other } });
};

exports.updateProfile = (req, res, next) => {
  const profileImage = req.files.profileImage?.at(0).path.replace("\\", "/");
  const coverImage = req.files.coverImage?.at(0).path.replace("\\", "/");
  
  if (profileImage) req.body.profileImage = profileImage;
  else delete req.body.profileImage;
  if (coverImage) req.body.coverImage = coverImage;
  else delete req.body.coverImage;

  User.updateProfile(req.user._id, req.body)
    .then(() =>
      res.status(200).json({ message: "Updated profile successfully!" })
    )
    .catch((err) => next(err));
};

exports.getProfile = (req, res, next) => {
  User.getProfile(req.params.userId)
    .then((result) => {
      const { username, profileImage, coverImage, location, occupation } =
        result;

      res
        .status(200)
        .json({ username, profileImage, coverImage, location, occupation });
    })
    .catch((err) => next(err));
};
