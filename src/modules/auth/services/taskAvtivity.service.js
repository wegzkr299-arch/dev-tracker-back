const ApiError = require("../../../utils/apiErrors");
const taskActivityRepo = require("../repositories/taskActivty.repository"); 

// START TASK
async function startTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return taskActivityRepo.createStart({ developerId, projectId, taskId, source });
}

// END TASK
async function endTask({ developerId, projectId, taskId, source = "MANUAL" }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  return taskActivityRepo.createEnd({ developerId, projectId, taskId, source });
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

  const lastEnd = await taskActivityRepo.findLastEndAfterStart({
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
  return taskActivityRepo.findAllSessions({ developerId, taskId });
}

async function getAllSessionsService({ developerId, projectId, taskId }) {
  if (!developerId || !projectId || !taskId)
    throw new ApiError(401, "Unauthorized: missing developer, project or task id")

  return taskActivityRepo.findAllSessions({ developerId, taskId })
}
module.exports = {
  startTask,
  endTask,
  pauseTask,
  resumeTask,
  getTaskStatus,
  getAllSessions,
  getAllSessionsService
};
