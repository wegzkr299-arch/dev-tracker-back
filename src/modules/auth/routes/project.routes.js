const express = require('express');
const { createProjectDev, completedProjectDev, getAllArchivedProjects, getAllProjects, deleteProject } = require('../controllers/projectcontroller/project');
const { protect } = require('../../../middlewares/auth.middleware');
const { deleteOneProject } = require('../repositories/project.repository');
const projectRouter = express.Router();
projectRouter.post('/dev/projectdev/createprojectdev' , protect , createProjectDev); 
projectRouter.patch('/dev/projectdev/archiveprojectdev/:id' , protect , completedProjectDev)
projectRouter.get('/dev/projectdev/archivedprojects/history'  , protect , getAllArchivedProjects)
projectRouter.get('/dev/projectdev/projects' , protect , getAllProjects )
projectRouter.delete('/dev/projectdev/deleteProject/:id' , protect , deleteProject)
module.exports = {projectRouter}