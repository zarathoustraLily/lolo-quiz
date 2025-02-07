const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // Ajoutez un champ pour le rôle
  dataFolders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataFolder' }]
});

module.exports = mongoose.model('User', userSchema);