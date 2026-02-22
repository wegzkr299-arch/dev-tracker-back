const express = require('express');
const { updateUserName } = require('../controllers/developercotroller/developer.controller');
const { protect } = require('../../../middlewares/auth.middleware');
const developerRouter = express.Router();
developerRouter.patch('/changeusername' , protect ,updateUserName)
module.exports = {developerRouter};
