
const taskService = require("../../services/taskAvtivity.service")

const startTask = async (req, res, next) => {
  try {
    const developerId = req.user._id
    const { projectId, taskId } = req.params

    const task = await taskService.startTask({
      developerId,
      projectId,
      taskId
    })

    res.json({ success: true, task })
  } catch (err) {
    next(err)
  }
}

const pauseTask = async (req, res, next) => {
  try {
    const developerId = req.user._id
    const { projectId, taskId } = req.params
    await taskService.pauseTask({ developerId, projectId, taskId })
    res.json({ success: true, message: "Task paused successfully" })
  } catch (err) {
    next(err)
  }
}

const resumeTask = async (req, res, next) => {
  try {
    const developerId = req.user._id
    const { projectId, taskId } = req.params

    await taskService.resumeTask({ developerId, projectId, taskId })
    res.json({ success: true, message: "Task resumed successfully" })
  } catch (err) {
    next(err)
  }
}



const getTaskStatus = async (req, res, next) => {
  try {
    const developerId = req.user._id
    const { projectId, taskId } = req.params
    const status = await taskService.getTaskStatus({ developerId, projectId, taskId })
    res.json({ success: true, status })
  } catch (err) {
    next(err)
  }
}

const getAllSessions = async (req, res, next) => {
  try {
    const developerId = req.user._id
    const { projectId, taskId } = req.params
    const sessions = await taskService.getAllSessionsService({ developerId, projectId, taskId })
    res.json({ success: true, sessions })
  } catch (err) {
    next(err)
  }
}

const getWeeklyTotalHours = async (req, res, next) => {
  try {
    const developerId = req.user._id;

    // بنادي الـ service اللي إنت لسه كاتبها
    const totalHours = await taskService.getWeeklyTotalHours(developerId);

    res.status(200).json({
      success: true,
      data: {
        totalHours: parseFloat(totalHours), // عشان يرجع رقم مش String
        unit: "hours",
        label: "This Week"
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startTask,
  pauseTask,
  resumeTask,
  getTaskStatus,
  getAllSessions,
  getWeeklyTotalHours
}
