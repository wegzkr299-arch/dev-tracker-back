const ApiError = require("../../../../utils/apiErrors");
const { changUser } = require("../../schemas/auth.schema");
const { changeUserName } = require("../../services/developer.service");
const updateUserName = async (req, res, next) => {
  try {
    const { error } = changUser.validate(req.body);
    if (error) return next(new ApiError(400, error.details[0].message));
    const developerId = req.user._id;
    const {name} = req.body;
    const changedUser = await changeUserName(developerId, name);
    res.status(200).json(
    {   
        message:'name updated successfully',
    developer: {
        id: changedUser._id,
        name: changedUser.name,
        email: changedUser.email,
        role: changUser.role,
      },

    })
  } catch (error) {
    next(error);
  }
};

module.exports = {updateUserName}
