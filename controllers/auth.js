const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
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
    return res.status(422).json({errors: errors.array()});
  }

  const token = jwt.sign(req.user, "supersecretkey", { expiresIn: "1h" });
  res.status(200).json({ token, _id: req.user._id.toString()});
};
