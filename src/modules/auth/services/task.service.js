const ApiError = require("../../../utils/apiErrors");
const { getOneActiveProjects } = require("../repositories/project.repository");
const { creatTaske, findTaskById, getProjectFinancials, findAllTasksByProjectId, deleteCompletedTasks } = require("../repositories/task.repository");
const projectSchema = require("../schemas/project.schema");
const taskActivityService = require('./taskAvtivity.service')

const createTaskService = async (developerId, projectId, data) => {
  if (!developerId || !projectId)
    throw new ApiError(401, "Unauthorized: missing developer or project id"); 
  const project = await getOneActiveProjects(developerId, projectId);
  if (!project) throw new ApiError(404, "Project not found");
  const task = await creatTaske({ ...data, project: projectId});
  return task;
};


const completeTaskService = async (developerId, projectId, taskId) => {
  if (!developerId || !projectId || !taskId) 
    throw new ApiError(401, "Unauthorized: missing developer, project or task id");

  const task = await findTaskById(taskId);
  if (!task || String(task.project._id) !== String(projectId) || String(task.project.owner) !== String(developerId))
    throw new ApiError(404, "Task not found or you are not allowed");

  if (source === "USER") {
    const { autoCompleteQueue } = require('../../../utils/taskQueue');
    const job = await autoCompleteQueue.getJob(taskId);
    if (job) await job.remove();
  }

  const status = await taskActivityService.getTaskStatus({ developerId, taskId });
  
  if (status.isWorking) {
    await taskActivityService.endTask({
      developerId,
      projectId,
      taskId,
      source: "STATUS_CHANGE"
    });
  }

  task.status = "done";
  task.completedAt = new Date();
  
  task.earnedMoney = (task.spentHours || 0) * task.project.hourlyRate;

  await task.save();
  return task;
};

const getProjectFinancialsService = async (projectId) => {
  return getProjectFinancials(projectId);
};

const getAllTasks = async (projectId , developerId) => {
    if (!developerId || !projectId)
    throw new ApiError(401, "Unauthorized: missing developer or project id");

    const project = await projectSchema.findOne({ 
        _id: projectId,   
        owner: developerId 
    });

    if (!project) {
        throw new ApiError(403, "You don't have permission to access tasks for this project");
    }
    const tasks = await findAllTasksByProjectId(projectId);
    return tasks
}

const deleteAllTasks = async(projectId  , developerId) => {
    if (!developerId || !projectId)
    throw new ApiError(401, "Unauthorized: missing developer or project id");
    
    const project = await projectSchema.findOne({ 
        _id: projectId,   
        owner: developerId 
    });

    if (!project) {
        throw new ApiError(403, "You don't have permission to access tasks for this project");
    }
    const deletedTask = await deleteCompletedTasks(projectId);
    
    return deletedTask;
}




module.exports = { createTaskService , completeTaskService , getProjectFinancialsService  , getAllTasks , deleteAllTasks};
