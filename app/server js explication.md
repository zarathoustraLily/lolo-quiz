Bien sûr, voici un commentaire détaillé en français pour vous aider à comprendre ce que fait ce code :

```javascript
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express'); // Importer le framework web Express
const cors = require('cors'); // Importer le middleware CORS pour permettre les requêtes cross-origin
const mongoose = require('mongoose'); // Importer Mongoose pour interagir avec MongoDB
const passport = require('passport'); // Importer Passport pour l'authentification
const session = require('express-session'); // Importer le middleware de session pour gérer les sessions utilisateur
const bcrypt = require('bcryptjs'); // Importer bcrypt pour le hachage des mots de passe
const User = require('./models/User'); // Importer le modèle utilisateur pour interagir avec la base de données MongoDB
const { ensureAuthenticated, ensureRole } = require('./middlewares/auth'); // Importer les middlewares pour vérifier l'authentification et les rôles des utilisateurs
const authRoutes = require('./routes/auth'); // Importer les routes d'authentification

const app = express(); // Créer une instance de l'application Express
const PORT = process.env.PORT || 5000; // Définir le port sur lequel le serveur écoute, en utilisant la variable d'environnement PORT ou 5000 par défaut

// Middleware
app.use(cors()); // Activer CORS pour permettre les requêtes cross-origin
app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true })); // Configurer les sessions en utilisant la variable d'environnement pour le secret de session
app.use(passport.initialize()); // Initialiser Passport pour l'authentification
app.use(passport.session()); // Utiliser les sessions Passport
require('./config/passport')(passport); // Configurer Passport avec la stratégie locale

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // Connexion à la base de données MongoDB en utilisant la variable d'environnement pour l'URI de connexion

// Utiliser les routes d'authentification
app.use('/auth', authRoutes); // Toutes les routes définies dans authRoutes seront accessibles sous le chemin /auth

// Routes
app.post('/register', async (req, res) => {
  // Route pour l'inscription des utilisateurs
  const { username, password, role } = req.body; // Extraction des données de la requête
  const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe avec un facteur de coût de 10
  const newUser = new User({ username, password: hashedPassword, role }); // Création d'un nouvel utilisateur avec le nom d'utilisateur, le mot de passe haché et le rôle
  await newUser.save(); // Sauvegarde de l'utilisateur dans la base de données
  res.send('User registered'); // Réponse envoyée au client indiquant que l'utilisateur a été enregistré
});

app.post('/login', passport.authenticate('local', {
  // Route pour la connexion des utilisateurs
  successRedirect: '/dashboard', // Redirection vers le tableau de bord en cas de succès
  failureRedirect: '/login', // Redirection vers la page de connexion en cas d'échec
  failureFlash: true // Affichage des messages d'erreur en cas d'échec
}));

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  // Route pour accéder au tableau de bord
  res.send('Welcome to your dashboard'); // Réponse envoyée au client indiquant l'accès au tableau de bord
});

app.get('/scenario', ensureAuthenticated, ensureRole('scenario'), (req, res) => {
  // Route pour accéder à la section "scenario"
  res.send('Access to scenario'); // Réponse envoyée au client indiquant l'accès à la section "scenario"
});

app.get('/storyboard', ensureAuthenticated, ensureRole('storyboarder'), (req, res) => {
  // Route pour accéder à la section "storyboard"
  res.send('Access to storyboard'); // Réponse envoyée au client indiquant l'accès à la section "storyboard"
});

app.get('/comptabilite', ensureAuthenticated, ensureRole('comptabilite'), (req, res) => {
  // Route pour accéder à la section "comptabilité"
  res.send('Access to comptabilite'); // Réponse envoyée au client indiquant l'accès à la section "comptabilité"
});

app.get('/planning', ensureAuthenticated, ensureRole('planning'), (req, res) => {
  // Route pour accéder à la section "planning"
  res.send('Access to planning'); // Réponse envoyée au client indiquant l'accès à la section "planning"
});

app.listen(PORT, () => {
  // Démarrage du serveur sur le port spécifié
  console.log(`Server is running on port ${PORT}`); // Affichage d'un message dans la console indiquant que le serveur est en cours d'exécution
});
```

### Explication détaillée :

1. **Chargement des variables d'environnement** :
   - `require('dotenv').config();` : Charge les variables d'environnement depuis un fichier 

.env

.

2. **Importation des modules nécessaires** :
   - `express` : Framework web pour Node.js.
   - `cors` : Middleware pour activer CORS (Cross-Origin Resource Sharing).
   - `mongoose` : Bibliothèque pour interagir avec MongoDB.
   - `passport` : Middleware pour l'authentification.
   - `session` : Middleware pour gérer les sessions.
   - `bcryptjs` : Bibliothèque pour le hachage des mots de passe.
   - `User` : Modèle utilisateur pour interagir avec la collection d'utilisateurs dans MongoDB.
   - `ensureAuthenticated`, `ensureRole` : Middlewares pour vérifier l'authentification et les rôles des utilisateurs.
   - `authRoutes` : Routes d'authentification.

3. **Configuration de l'application Express** :
   - `const app = express();` : Crée une instance de l'application Express.
   - `const PORT = process.env.PORT || 5000;` : Définit le port sur lequel le serveur écoute, en utilisant la variable d'environnement `PORT` ou 5000 par défaut.

4. **Middleware** :
   - `app.use(cors());` : Active CORS pour permettre les requêtes cross-origin.
   - `app.use(express.json());` : Middleware pour parser les requêtes JSON.
   - `app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));` : Configure les sessions en utilisant la variable d'environnement pour le secret de session.
   - `app.use(passport.initialize());` : Initialise Passport pour l'authentification.
   - `app.use(passport.session());` : Utilise les sessions Passport.
   - `require('./config/passport')(passport);` : Configure Passport avec la stratégie locale.

5. **Connexion à MongoDB** :
   - `mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });` : Connexion à la base de données MongoDB en utilisant la variable d'environnement pour l'URI de connexion.

6. **Utilisation des routes d'authentification** :
   - `app.use('/auth', authRoutes);` : Toutes les routes définies dans `authRoutes` seront accessibles sous le chemin `/auth`.

7. **Définition des routes** :
   - **Route d'inscription (`/register`)** :
     - `app.post('/register', async (req, res) => { ... });` : Définit une route POST pour l'inscription des utilisateurs.
     - `const { username, password, role } = req.body;` : Extrait les données de la requête.
     - `const hashedPassword = await bcrypt.hash(password, 10);` : Hache le mot de passe avec un facteur de coût de 10.
     - `const newUser = new User({ username, password: hashedPassword, role });` : Crée un nouvel utilisateur avec le nom d'utilisateur, le mot de passe haché et le rôle.
     - `await newUser.save();` : Sauvegarde l'utilisateur dans la base de données.
     - `res.send('User registered');` : Répond au client en indiquant que l'utilisateur a été enregistré.

   - **Route de connexion (`/login`)** :
     - `app.post('/login', passport.authenticate('local', { ... }));` : Définit une route POST pour la connexion des utilisateurs.
     - `successRedirect: '/dashboard',` : Redirige vers le tableau de bord en cas de succès.
     - `failureRedirect: '/login',` : Redirige vers la page de connexion en cas d'échec.
     - `failureFlash: true` : Affiche des messages d'erreur en cas d'échec.

   - **Route du tableau de bord (`/dashboard`)** :
     - `app.get('/dashboard', ensureAuthenticated, (req, res) => { ... });` : Définit une route GET pour accéder au tableau de bord.
     - `res.send('Welcome to your dashboard');` : Répond au client en indiquant l'accès au tableau de bord.

   - **Routes pour les différentes sections** :
     - `app.get('/scenario', ensureAuthenticated, ensureRole('scenario'), (req, res) => { ... });` : Définit une route GET pour accéder à la section "scenario".
     - `app.get('/storyboard', ensureAuthenticated, ensureRole('storyboarder'), (req, res) => { ... });` : Définit une route GET pour accéder à la section "storyboard".
     - `app.get('/comptabilite', ensureAuthenticated, ensureRole('comptabilite'), (req, res) => { ... });` : Définit une route GET pour accéder à la section "comptabilité".
     - `app.get('/planning', ensureAuthenticated, ensureRole('planning'), (req, res) => { ... });` : Définit une route GET pour accéder à la section "planning".

8. **Démarrage du serveur** :
   - `app.listen(PORT, () => { ... });` : Démarre le serveur sur le port spécifié.
   - `console.log(`Server is running on port ${PORT}`);` : Affiche un message dans la console indiquant que le serveur est en cours d'exécution.

Ce code configure un serveur Express avec des routes pour l'inscription, la connexion et l'accès à différentes sections de l'application, en utilisant des middlewares pour l'authentification et la gestion des rôles. Les informations sensibles telles que les secrets de session et les URI de connexion à la base de données sont stockées dans des variables d'environnement pour améliorer la sécurité.