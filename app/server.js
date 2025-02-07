require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const User = require('./models/User'); // Importer le modèle User
const Project = require('./models/Project'); // Importer le modèle Project
const { ensureAuthenticated, ensureRole } = require('./middlewares/auth'); // Importer les middlewares d'authentification
const authRoutes = require('./routes/auth'); // Importer les routes d'authentification
const connectToUserDatabase = require('./middlewares/connectToUserDatabase'); // Importer le middleware pour connecter à la base de données utilisateur
const taskRoutes = require('./tasks'); // Importer les routes de la micro-application de gestion des tâches

const app = express();
const PORT = process.env.PORT || 5000;

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

// Lire les informations de la base de données à partir du fichier CSV
let dbUris = {};
fs.createReadStream('./data/databases.csv')
  .pipe(csv())
  .on('data', (row) => {
    dbUris[row.name] = row.uri; // Stocker les URI des bases de données dans un objet
  })
  .on('end', () => {
    // Vérifier si l'URI de la base de données principale est défini
    if (!dbUris['main_db']) {
      console.error('URI de la base de données principale non défini');
      process.exit(1);
    }

    // Connecter à la base de données principale
    mongoose.connect(dbUris['main_db'], {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log('Connecté à la base de données principale');
    }).catch((err) => {
      console.error('Erreur de connexion à la base de données principale:', err);
      process.exit(1);
    });

    // Middleware
    app.use(cors()); // Activer CORS pour permettre les requêtes cross-origin
    app.use(express.json()); // Activer le parsing des requêtes JSON
    app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true })); // Configurer les sessions
    app.use(passport.initialize()); // Initialiser Passport pour l'authentification
    app.use(passport.session()); // Utiliser les sessions avec Passport
    require('./config/passport'); // Charger la configuration de Passport

    // Utiliser les routes d'authentification
    app.use('/auth', authRoutes);

    // Routes pour les projets
    app.post('/register', async (req, res) => {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hasher le mot de passe
      const newUser = new User({ username, password: hashedPassword, role }); // Créer un nouvel utilisateur
      await newUser.save(); // Sauvegarder l'utilisateur dans la base de données

      // Créer un répertoire pour l'utilisateur
      const userDir = path.join(__dirname, 'data', username);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true }); // Créer le répertoire si il n'existe pas
      }

      res.send('User registered'); // Envoyer une réponse indiquant que l'utilisateur a été enregistré
    });

    app.post('/create-project', ensureAuthenticated, async (req, res) => {
      const { projectName } = req.body;
      const username = req.user.username;

      // Créer un sous-répertoire pour le projet
      const projectDir = path.join(__dirname, 'data', username, projectName);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true }); // Créer le répertoire si il n'existe pas
      }

      // Ajouter l'information de la base de données du projet dans la base de données principale
      const projectDbName = `user_${username}_${projectName}`;
      const newProject = new Project({ username, projectName, projectDbName });
      await newProject.save(); // Sauvegarder le projet dans la base de données principale

      res.send('Project created'); // Envoyer une réponse indiquant que le projet a été créé
    });

    // Utiliser le middleware pour connecter à la base de données utilisateur
    app.use('/project/:projectName', ensureAuthenticated, connectToUserDatabase);

    // Utiliser les routes de la micro-application de gestion des tâches
    app.use('/project/:projectName', taskRoutes);

    app.get('/dashboard', ensureAuthenticated, (req, res) => {
      res.send('Welcome to your dashboard'); // Route pour le tableau de bord
    });

    app.get('/scenario', ensureAuthenticated, ensureRole('scenario'), (req, res) => {
      res.send('Access to scenario'); // Route pour le scénario
    });

    app.get('/storyboard', ensureAuthenticated, ensureRole('storyboarder'), (req, res) => {
      res.send('Access to storyboard'); // Route pour le storyboard
    });

    app.get('/comptabilite', ensureAuthenticated, ensureRole('comptabilite'), (req, res) => {
      res.send('Access to comptabilite'); // Route pour la comptabilité
    });

    app.get('/planning', ensureAuthenticated, ensureRole('planning'), (req, res) => {
      res.send('Access to planning'); // Route pour le planning
    });


    // Nouvelle route pour lister les répertoires et sous-répertoires dans components/quiz
    app.get('/api/quiz-directories', (req, res) => {
      const quizPath = path.join(__dirname, '../frontend/src/components/quiz');
      console.log('Quiz Path:', quizPath); // Ajoutez cette ligne pour vérifier le chemin
      const getDirectories = (srcPath) => {
        return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
      };
      const directories = getDirectories(quizPath);
      console.log('Directories:', directories); // Ajoutez cette ligne pour vérifier les répertoires
      res.json(directories);
    });

    // Route pour obtenir une question aléatoire d'un dossier
    app.get('/api/quiz/question', (req, res) => {
      const directory = req.query.directory;
      // Correction du chemin pour pointer vers le bon répertoire dans le frontend
      const quizPath = path.join(__dirname, '../frontend/src/components/quiz/Questions', directory);
      console.log('Searching CSV files in:', quizPath); // Pour déboguer

      try {
        // Recherche récursive des fichiers CSV dans le dossier et ses sous-dossiers
        const findCsvFiles = (dir) => {
          let results = [];
          const items = fs.readdirSync(dir);
          
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              results = results.concat(findCsvFiles(fullPath));
            } else if (item.endsWith('.csv')) {
              results.push(fullPath);
            }
          }
          
          return results;
        };

        const csvFiles = findCsvFiles(quizPath);
        console.log('Found CSV files:', csvFiles); // Pour déboguer

        if (csvFiles.length === 0) {
          return res.status(404).json({ error: 'No CSV files found' });
        }

        // Choisir un fichier CSV au hasard
        const randomFile = csvFiles[Math.floor(Math.random() * csvFiles.length)];
        console.log('Selected file:', randomFile); // Pour déboguer

        // Lire le fichier CSV
        const rows = [];
        fs.createReadStream(randomFile)
          .pipe(csv())
          .on('data', (row) => rows.push(row))
          .on('end', () => {
            if (rows.length === 0) {
              return res.status(404).json({ error: 'No questions found in CSV file' });
            }

            // Choisir une ligne au hasard
            const randomRow = rows[Math.floor(Math.random() * rows.length)];
            console.log('Selected row:', randomRow); // Pour déboguer
            
            // Extraire la question et les réponses
            const question = randomRow[0];
            const correctAnswer = randomRow[1];
            const wrongAnswers = [
              randomRow[2],
              randomRow[3],
              randomRow[4],
              randomRow[5]
            ].filter(Boolean); // Enlever les réponses vides

            res.json({
              question,
              correctAnswer,
              wrongAnswers
            });
          })
          .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).json({ error: 'Failed to read CSV file' });
          });
      } catch (error) {
        console.error('Error reading quiz files:', error);
        res.status(500).json({ error: 'Failed to read quiz files' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`); // Démarrer le serveur
    });
  });

  
// Gestion des erreurs pour les promesses non gérées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application spécifique de journalisation, nettoyage ou sortie
});