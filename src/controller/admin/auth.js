const { findOne } = require("../../models/user");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require('shortid')

//user signup
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "Admin already exists",
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
      role: "admin",
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(401).json({ message: "something went wrong" });
      }
      if (data) {
        return res.status(201).json({
          message: "Admin created successfully",
        });
      }
    });
  });
};

//user signin
exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async(error, user) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    }
    if (user) {
      const isPassword = await user.authenticate(req.body.password)

      if (isPassword && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        const { firstName, lastName, email, password, role, fullname } = user;
        res.cookie("token", token, { expiresIn: "1h" });
        res.status(200).json({
          token,
          user: { firstName, lastName, email, password, role, fullname },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({
        message: "Sign up before login",
      });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully",
  });
};
