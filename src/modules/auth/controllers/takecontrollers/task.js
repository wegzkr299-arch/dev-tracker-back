const ApiError = require("../../../../utils/apiErrors");
const { createTaskSchema } = require("../../schemas/auth.schema");
const { createTaskService, completeTaskService, getProjectFinancialsService } = require("../../services/task.service");

const createDevtask = async (req, res , next) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) return next(new ApiError(400, error.details[0].message));
    const developerId = req.user._id;
    const projectId = req.params["id"];
    const data = req.body;
    const task = await createTaskService(developerId, projectId, data);
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};


const completeDevTask = async (req, res, next) => {
  try {
    const developerId = req.user._id;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const task = await completeTaskService(developerId, projectId, taskId);

    res.status(200).json({
      status: "success",
      task,
      message: "Task completed successfully",
    });
  } catch (err) {
    next(err);
  }
};



const getProjectFinancialsController = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const financials = await getProjectFinancialsService(projectId);

    res.status(200).json({
      status: "success",
      financials,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {createDevtask  ,completeDevTask , getProjectFinancialsController}