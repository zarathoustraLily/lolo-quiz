#!/bin/bash

# Naviguer vers le répertoire de l'application
cd /app

# Stash les modifications locales
git stash

# Tirer les dernières modifications depuis GitHub
git pull origin main

# Installer les nouvelles dépendances si nécessaire
npm install

# Redémarrer l'application
docker-compose restart app