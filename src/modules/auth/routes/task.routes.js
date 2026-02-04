const express = require('express');
const { createDevtask, completeDevTask, getProjectFinancialsController } = require('../controllers/takecontrollers/task');
const { protect } = require('../../../middlewares/auth.middleware');
const taskRouter =  express.Router();
taskRouter.post('/dev/tasks/createtask/:id' , protect ,createDevtask)
taskRouter.patch('/dev/:projectId/tasks/:taskId/complete', protect , completeDevTask)
taskRouter.get('/dev/:projectId/financials' , protect ,getProjectFinancialsController)
module.exports = taskRouter;