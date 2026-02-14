const express = require('express')
const TaskActivity = express.Router();
const { protect } = require('../../../middlewares/auth.middleware');
const { startTask, pauseTask, resumeTask, getTaskStatus, getAllSessions, getWeeklyTotalHours } = require('../controllers/takecontrollers/taskActivity');
TaskActivity.get("/projects/developer/tasks/weekly", protect, getWeeklyTotalHours);
TaskActivity.post("/projects/:projectId/tasks/:taskId/start", protect , startTask);
TaskActivity.post("/projects/:projectId/tasks/:taskId/pause", protect , pauseTask);
TaskActivity.post("/projects/:projectId/tasks/:taskId/resume" , protect , resumeTask)
TaskActivity.get("/projects/:projectId/tasks/:taskId/status" , protect , getTaskStatus);
TaskActivity.get("/projects/:projectId/tasks/:taskId/sessions" , protect ,getAllSessions);

module.exports = TaskActivity