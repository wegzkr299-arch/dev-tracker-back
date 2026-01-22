const Project = require("../schemas/project.schema");

const createProject = async ({
  name,
  clientName,
  hourlyRate,
  description,
  owner,
}) => {
  return await Project.create({
    name,
    clientName,
    hourlyRate,
    description,
    owner,
  });
};
const isProjectExists = async (name, ownerId) => {
  const isExists = await Project.findOne({ name, owner: ownerId });
  return isExists;
};

const completeProject = async (ownerId, projectId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: ownerId },
    {
      status: "completed",
      isArchived: true,
      archivedAt: new Date(),
    },
    { new: true },
  );

  if (!project) throw new ApiError(404, "Project not found or not authorized");

  return project;
};

const getArchivedProjects = async (ownerId, page, limit) => {
  return await Project.find({
    owner: ownerId,
    isArchived: true,
  })
    .sort({ archivedAt: -1 })
    .limit(limit)
    .skip(page * limit);
};

const findAllProjects = async (ownerId, page, limit) => {


  return await Project.find({
    owner: ownerId,
    isArchived: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(page * limit)
}


module.exports = { createProject, isProjectExists, completeProject, getArchivedProjects , findAllProjects};
