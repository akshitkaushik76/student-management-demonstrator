const express = require('express');
const authcont =require('./authcontroller');
const router  = express.Router();
router.route('/signup').post(authcont.signup);
router.route('/login').post(authcont.login);
router.route('/forgotpassword').post(authcont.pswdforgot);
router.route('/resetPassword/:token').patch(authcont.resetPassword);
router.route('/updatepassword').patch(authcont.protect,authcont.updatepassword);//for updating the password it is important for the user to be logged in thats why protect
//reset password token is there too.

module.exports = router;