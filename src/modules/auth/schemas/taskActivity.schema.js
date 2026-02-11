const mongoose = require("mongoose");
const taskActivitySchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true,
    index: true
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasks',
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ['START', 'END'],
    required: true
  },

  source: {
    type: String,
    enum: ['STATUS_CHANGE', 'TIMER', 'MANUAL'],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('TaskActivity', taskActivitySchema);
