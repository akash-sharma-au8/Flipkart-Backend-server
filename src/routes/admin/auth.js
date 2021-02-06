const express = require('express');
const router = express.Router()

const {signup,signin,signout} = require('../../controller/admin/auth')
const { validateSignUpRequest, validateSignInRequest, isRequestValidated } = require('../../validators/auth');
const {requireSignin} = require('../../common-middleware')

router.post('/admin/signin',validateSignInRequest, isRequestValidated, signin)
router.post('/admin/signup', validateSignUpRequest, isRequestValidated, signup);
router.post('/admin/signout',signout)


module.exports = router;
