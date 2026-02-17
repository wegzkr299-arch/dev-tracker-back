
const ApiError = require("../../../../utils/apiErrors")
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


const getWeeklyProductivity = async (req, res, next) => {
  try {
    // 1. استخراج الـ developerId (الأفضل يكون من الـ auth middleware لضمان الحماية)
    const developerId = req.user?._id || req.params.developerId;

    if (!developerId) {
      return next(new ApiError(400, "Developer ID is required"));
    }

    // 2. استدعاء الـ Service (اللي فيها الـ Aggregation القوي)
    const stats = await taskService.getWeeklyProductivityStats(developerId);

    // 3. التحقق من وجود بيانات (لو مفيش شغل خالص الأسبوع ده)
    if (!stats || stats.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No activities found for the last 7 days",
        data: [] 
      });
    }

    // 4. الرد بنجاح
    res.status(200).json({
      status: "success",
      count: stats.length,
      data: stats
    });

  } catch (error) {
    // 5. التعامل مع الأخطاء غير المتوقعة (مثل خطأ في الـ Database)
    console.error("Error in getWeeklyProductivity Controller:", error);
    next(new ApiError(500, "Internal Server Error while fetching productivity stats"));
  }
};

module.exports = {
  startTask,
  pauseTask,
  resumeTask,
  getTaskStatus,
  getAllSessions,
  getWeeklyTotalHours,
  getWeeklyProductivity
}
