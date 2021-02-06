const { findOne } = require("../models/user");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//user signup
exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: shortid.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(401).json({ message: "something went wrong" });
      }
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullname } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullname },
        });
      }
    });
  });
};

//user signin
exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    }
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullname } = user;
          res.status(200).json({
            token,
            user: { _id, firstName, lastName, email, role, fullname },
          });
      } else {
        return res.status(400).json({
          message: "Something went wrongg",
        });
      }
    } else {
      return res.status(400).json({
        message: "Sign up before login",
      });
    }
  });
};
