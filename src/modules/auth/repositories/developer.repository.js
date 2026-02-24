const mongoose = require('mongoose');
const Developer = require('../schemas/developer.schema');

const changeDeveloperName = async (developerId, newName) => {
    try {
  
        const updatedDev = await Developer.findByIdAndUpdate(
            developerId, 
            { name: newName }, 
            { new: true, runValidators: true }
        );
        
        return updatedDev;
    } catch (error) {
        console.error("Error updating developer name:", error);
        throw error;
    }
}


module.exports = { changeDeveloperName };