FROM node:14

# Installer cron pour les mises à jour automatiques
RUN apt-get update && apt-get install -y cron

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install bcrypt dotenv jsonwebtoken passport passport-local csv-parser
RUN npm install bcryptjs mongoose express-session validator
RUN npm install dotenv
RUN npm install express cors

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Copier le fichier databases.csv
COPY data/databases.csv ./data/databases.csv

# Copier le script de mise à jour
COPY update_code.sh /app/update_code.sh
RUN chmod +x /app/update_code.sh

# Installer nodemon pour le redémarrage automatique
RUN npm install -g nodemon

# Ajouter le script de mise à jour au crontab
RUN echo "0 * * * * /app/update_code.sh" >> /etc/crontab





# Exposer le port sur lequel l'application s'exécute
EXPOSE 5000

# Démarrer cron et l'application
CMD cron && nodemon server.js