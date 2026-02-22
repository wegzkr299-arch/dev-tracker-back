    const ApiError = require("../../../utils/apiErrors");
    const { changeDeveloperName } = require("../repositories/developer.repository");

    const changeUserName = async (developerId , name) => {
        if(!developerId) return new ApiError(404 ,  'Developer not found');
        if(!name) return new ApiError(401 , 'name is required');
        const updatedDeveloper = await changeDeveloperName(developerId , name);
        return updatedDeveloper
    }

    module.exports = {changeUserName}