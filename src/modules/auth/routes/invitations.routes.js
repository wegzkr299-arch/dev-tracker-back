const express = require('express');
const { sendInvite, getMyInvitations, respondToInvitation, getTeamMembers } = require('../controllers/teamscontrollers/teams');
const { protect } = require('../../../middlewares/auth.middleware');
const invitaionsRouter = express.Router();
invitaionsRouter.post('/sendinvitaions' ,protect ,sendInvite);
invitaionsRouter.get('/getallinetations' ,protect ,getMyInvitations);
invitaionsRouter.post("/respond/:invitationId",protect , respondToInvitation)
invitaionsRouter.get("/members", protect, getTeamMembers)
module.exports = {invitaionsRouter}