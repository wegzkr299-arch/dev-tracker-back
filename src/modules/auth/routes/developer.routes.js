const express = require('express');
const { updateUserName, otpToChangePassword, changePassword } = require('../controllers/developercotroller/developer.controller');
const { protect } = require('../../../middlewares/auth.middleware');
const forgotPasswordLimiter = require('../../../middlewares/rateLimit.middleware');
const developerRouter = express.Router();
developerRouter.patch('/changeusername' , protect ,updateUserName)
developerRouter.post('/forgotpassword' ,otpToChangePassword)
developerRouter.post('/changepassword' , changePassword)
module.exports = {developerRouter};
