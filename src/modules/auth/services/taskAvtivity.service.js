const ApiError = require("../../../utils/apiErrors");
const TaskActivity = require('../schemas/taskActivity.schema') 
const mongoose = require("mongoose");
// START TASK
async function startTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return TaskActivity.createStart({ developerId, projectId, taskId, source });
}

// END TASK
async function endTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return TaskActivity.createEnd({ developerId, projectId, taskId, source });
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
  const lastStart = await taskActivityRepo.findLastStart({ developerId, taskId });
  if (!lastStart) return { isWorking: false, duration: "0h 0m" };

  const lastEnd = await TaskActivity.findLastEndAfterStart({
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
  return TaskActivity.findAllSessions({ developerId, taskId });
}

async function getAllSessionsService({ developerId, projectId, taskId }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id")

  return TaskActivity.findAllSessions({ developerId, taskId })
}

const getWeeklyTotalHours = async (developerId) => {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
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
    for (let i = 0; i < logs.length - 1; i++) {
      
      if (logs[i].type === 'START' && logs[i+1].type === 'END') {
        totalMs += (new Date(logs[i+1].time) - new Date(logs[i].time));
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
