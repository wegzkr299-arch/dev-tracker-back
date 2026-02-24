const TaskActivity = require('../schemas/taskActivity.schema') 

// تسجيل START
async function createStart({ developerId, projectId, taskId, source = 'MANUAL' }) {
  return TaskActivity.create({
    developer: developerId,
    project: projectId,
    task: taskId,
    type: 'START',
    source
  });
}

// تسجيل END
async function createEnd({ developerId, projectId, taskId, source = 'MANUAL' }) {
  return TaskActivity.create({
    developer: developerId,
    project: projectId,
    task: taskId,
    type: 'END',
    source
  });
}

// آخر START لأي task/developer
async function findLastStart({ developerId, taskId }) {
  return TaskActivity.findOne({ developer: developerId, task: taskId, type: 'START' })
    .sort({ createdAt: -1 });
}

// آخر END بعد START معين
async function findLastEndAfterStart({ developerId, taskId, startDate }) {
  return TaskActivity.findOne({
    developer: developerId,
    task: taskId,
    type: 'END',
    createdAt: { $gt: startDate }
  }).sort({ createdAt: -1 });
}

// جلب كل الـ sessions (START → END)
async function findAllSessions({ developerId, taskId }) {
  const activities = await TaskActivity.find({ developer: developerId, task: taskId }).sort({ createdAt: 1 });
  const sessions = [];
  let currentStart = null;

  activities.forEach(act => {
    if (act.type === 'START') currentStart = act;
    else if (act.type === 'END' && currentStart) {
      sessions.push({ start: currentStart.createdAt, end: act.createdAt });
      currentStart = null;
    }
  });


  if (currentStart) sessions.push({ start: currentStart.createdAt, end: null });

  return sessions;
}


module.exports = {
  createStart,
  createEnd,
  findLastStart,
  findLastEndAfterStart,
  findAllSessions
};
