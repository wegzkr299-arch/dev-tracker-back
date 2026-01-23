// src/modules/projects/services/project.service.js
const ApiError = require("../../../utils/apiErrors");
const { createProject, isProjectExists, completeProject, getArchivedProjects, getAllProjects, findAllProjects, deleteOneProject, getOneProject } = require("../repositories/project.repository");

const createDevProject = async ({ name, clientName, hourlyRate, description, developerId }) => {
  if (!developerId) throw new ApiError(404, "Developer not found");
    const isMatchedProject = await isProjectExists(name , developerId);
    if(isMatchedProject) throw new ApiError(401 ,"this project is Already exists");
  const project = await createProject({ name, clientName, hourlyRate, description, owner: developerId });
  return project;
};


const completedDevProject = async(developerId , projectId) => {
if (!developerId) throw new ApiError(404, "Developer not found");
if(!projectId) throw new ApiError(404 , "Project Not Found");
 const deletedProject = await completeProject(developerId , projectId);
   if (!deletedProject)
    throw new ApiError(404, "Project not found or not authorized");

return deletedProject;

}

const getDevProjectArchived = async (developerId, page, limit) => {
  if (!developerId)
    throw new ApiError(404, "Developer not found");

  return await getArchivedProjects(developerId, page, limit);
};

const getAllDevProjects = async (developerId, page, limit) => {
    if (!developerId)
    throw new ApiError(404, "Developer not found");

  return await findAllProjects(developerId, page, limit);
}

const deleteDevProject = async(developerId , projectId) => {
  if(!developerId) throw new ApiError(404 , "developer not found")
  const oneProject = await getOneProject(projectId)
  if(!oneProject) throw new ApiError(404 , "project not found")
if(oneProject.isArchived === false) throw new ApiError(401 , "you can delete projects in history only")
  const project = await deleteOneProject(developerId , projectId);
  if(!project) throw new ApiError(404 ,"project not found")
  
  return project

}

module.exports = { createDevProject  , completedDevProject , getDevProjectArchived , getAllDevProjects , deleteDevProject};
