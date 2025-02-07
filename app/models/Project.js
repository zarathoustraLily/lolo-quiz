const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  username: { type: String, required: true },
  projectName: { type: String, required: true },
  projectDbName: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;