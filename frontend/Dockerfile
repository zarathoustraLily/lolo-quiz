FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Ajouter la variable d'environnement pour résoudre l'erreur OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install axios bootstrap react react-bootstrap react-dom react-router-dom react-scripts
RUN npm install @babel/plugin-proposal-private-property-in-object
RUN npm install --save-dev workbox-webpack-plugin

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Construire l'application React
RUN npm run build

# Démarrer l'application
CMD ["npm", "start"]