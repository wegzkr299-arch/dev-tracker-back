const ApiError = require("../../../utils/apiErrors");
const TaskActivity = require('../schemas/taskActivity.schema') 
const TaskActivityRepo = require('../repositories/taskActivty.repository')
const mongoose = require("mongoose");
// START TASK
async function startTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return TaskActivityRepo.createStart({ developerId, projectId, taskId, source });
}

// END TASK
async function endTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return TaskActivityRepo.createEnd({ developerId, projectId, taskId, source });
}

// PAUSE TASK = END مؤقت
async function pauseTask({ developerId, projectId, taskId }) {
  return endTask({ developerId, projectId, taskId, source: "MANUAL" });
}

// RESUME TASK = START بعد PAUSE
async function resumeTask({ developerId, projectId, taskId }) {
  return startTask({ developerId, projectId, taskId, source: "MANUAL" });
}

// جلب حالة الـ task وحساب المدة
async function getTaskStatus({ developerId, taskId }) {
  const lastStart = await TaskActivityRepo.findLastStart({ developerId, taskId });
  if (!lastStart) return { isWorking: false, duration: "0h 0m" };

  const lastEnd = await TaskActivityRepo.findLastEndAfterStart({
    developerId,
    taskId,
    startDate: lastStart.createdAt
  });

  let isWorking = false;
  let duration = 0;

  if (!lastEnd) {
    isWorking = true;
    duration = new Date() - new Date(lastStart.createdAt);
  } else {
    duration = new Date(lastEnd.createdAt) - new Date(lastStart.createdAt);
  }

  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  return {
    isWorking,
    duration: `${hours}h ${minutes}m`,
    lastStart: lastStart.createdAt,
    lastEnd: lastEnd?.createdAt || null
  };
}
// جلب كل الـ sessions
async function getAllSessions({ developerId, taskId }) {
  return TaskActivityRepo.findAllSessions({ developerId, taskId });
}

async function getAllSessionsService({ developerId, projectId, taskId }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id")

  return TaskActiviTaskActivityRepoty.findAllSessions({ developerId, taskId })
}
const getWeeklyTotalHours = async (developerId) => {
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  // تأكد من ضبط بداية الأسبوع حسب رغبتك (هنا تبدأ من الأحد)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 

  const stats = await TaskActivity.aggregate([
    {
      $match: {
        developer: new mongoose.Types.ObjectId(developerId),
        createdAt: { $gte: startOfWeek }
      }
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$task",
        activities: { $push: { type: "$type", time: "$createdAt" } }
      }
    }
  ]);

  let totalMs = 0;

  stats.forEach(task => {
    const logs = task.activities;
    for (let i = 0; i < logs.length; i++) {
      if (logs[i].type === 'START') {
        const startTime = new Date(logs[i].time);
        let endTime;

        // لو فيه END بعد الـ START مباشرة، احسب الفرق
        if (logs[i + 1] && logs[i + 1].type === 'END') {
          endTime = new Date(logs[i + 1].time);
          i++; // تخطى الـ END في اللفة القادمة
        } else {
          // لو مفيش END (يعني التاسك لسه شغالة)، احسب الوقت حتى "الآن"
          endTime = new Date(); 
        }
        
        totalMs += (endTime - startTime);
      }
    }
  });

  const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);
  return totalHours;
};
module.exports = {
  startTask,
  endTask,
  pauseTask,
  resumeTask,
  getTaskStatus,
  getAllSessions,
  getAllSessionsService,
  getWeeklyTotalHours
};
