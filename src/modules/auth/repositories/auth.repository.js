const Developer = require("../schemas/developer.schema");

const isExists = async (email) => {
  const dev = await Developer.findOne({ email }).lean().select("_id");
  return !!dev;
};

const findUserByEmail = async (email) => {
   return Developer.findOne({ email })
};

const createDev = async (name, email, password) => {
  return await Developer.create({ name, email, password });
   
};

const findUserById = async (devId) => {
  return Developer.findById(devId);
}
module.exports = { isExists, createDev  , findUserByEmail , findUserById}; 
