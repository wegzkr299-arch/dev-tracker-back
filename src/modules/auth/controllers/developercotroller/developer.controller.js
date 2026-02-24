const ApiError = require("../../../../utils/apiErrors");
const { changeDeveloperName } = require("../../repositories/developer.repository");
const { changUser, changPass, mailSchema, registerSchema, changePassSchema } = require("../../schemas/auth.schema");
const { forgotPasswordDev, changeDeveloperPassword } = require("../../services/auth.service");
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

const otpToChangePassword = async (req, res , next) => {
try {
    const {error} = mailSchema.validate(req.body);
if (error) {
  return next(new ApiError(400, error.details[0].message));
}
  const {email} = req.body;
  const {message}  = await forgotPasswordDev(email);
  res.status(200).json({message})
} catch (error) {
  next(error)
}
}

const changePassword = async(req, res , next) => {
  try {
    const {error} = changePassSchema.validate(req.body); 
    if(error){
      return next(new ApiError(400 , error.details[0].message));
    }
    const {email , otp , newPassword} = req.body;
    const message = await changeDeveloperPassword(email , otp , newPassword) 
    res.status(200).json({message})
  } catch (error) {
    next(error)
  }
}



module.exports = {updateUserName , otpToChangePassword , changePassword}
