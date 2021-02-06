const express = require("express");
const router = express.Router();

const { signup, signin} = require("../controller/auth");

const { validateSignUpRequest,validateSignInRequest, isRequestValidated } = require('../validators/auth');

router.post("/signin",validateSignInRequest, isRequestValidated, signin);
router.post("/signup",validateSignUpRequest, isRequestValidated, signup);

module.exports = router;
