const mongoose = require('mongoose');
const Project = require('../models/Project'); // Importer le modèle Project

// Middleware pour connecter dynamiquement à la base de données de l'utilisateur
const connectToUserDatabase = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized'); // Vérifier si l'utilisateur est authentifié
  }

  const username = req.user.username; // Récupérer le nom d'utilisateur de l'utilisateur connecté
  const projectName = req.params.projectName; // Récupérer le nom du projet à partir des paramètres de la requête

  // Récupérer l'information de la base de données du projet
  const project = await Project.findOne({ username, projectName });
  if (!project) {
    return res.status(404).send('Project not found'); // Si le projet n'existe pas, retourner une erreur 404
  }

  // Construire l'URI de connexion à la base de données spécifique au projet
  const projectDbUri = `mongodb://db:27017/${project.projectDbName}`;
  if (mongoose.connection.readyState === 0) {
    // Si aucune connexion n'est active, se connecter à la base de données
    await mongoose.connect(projectDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  next(); // Passer au middleware suivant
};

module.exports = connectToUserDatabase; // Exporter le middleware