const ApiError = require("../../../utils/apiErrors");
const { getOneActiveProjects } = require("../repositories/project.repository");
const { creatTaske, findTaskById, getProjectFinancials } = require("../repositories/task.repository");

const createTaskService = async (developerId, projectId, data) => {
  if (!developerId || !projectId)
    throw new ApiError(401, "Unauthorized: missing developer or project id");
    if(!data) throw new ApiError(401 , "Missing Fields")
  const project = await getOneActiveProjects(developerId, projectId);
  if (!project) throw new ApiError(404, "Project not found");
  const task = await creatTaske({ ...data, project: projectId});
  return task;
};

const completeTaskService = async (developerId, projectId, taskId) => {
  const task = await findTaskById(taskId);
  if(!developerId) throw new ApiError(401 , "Unathourized")

  if (!task || String(task.project._id) !== String(projectId) || String(task.project.owner) !== String(developerId))
    throw new ApiError(404, "Task not found or you are not allowed");

  task.status = "done";
  task.completedAt = new Date();
  task.earnedMoney = (task.spentHours || 0) * task.project.hourlyRate;

  await task.save();
  return task;
};

const getProjectFinancialsService = async (projectId) => {
  return getProjectFinancials(projectId);
};


module.exports = { createTaskService , completeTaskService , getProjectFinancialsService };
