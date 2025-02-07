# Quiz DCG/DSCG PWA

Application Progressive Web App (PWA) pour la préparation aux examens DCG et DSCG.

## Technologies utilisées

- Frontend: React.js (PWA)
- Backend: Node.js
- Base de données: MongoDB
- Conteneurisation: Docker

## Structure du projet

```
.
├── frontend/          # Application React PWA
├── app/              # Serveur Node.js
└── docker-compose.yml # Configuration Docker
```

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd quiz-dcg-dscg
```

2. Lancer l'application en développement :
```bash
docker-compose up -d
```

3. Lancer l'application en production :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Fonctionnalités

- Interface adaptative (desktop/mobile)
- Mode hors ligne
- Questions de quiz par catégorie
- Suivi des progrès
- Installation possible sur l'écran d'accueil

## Déploiement

L'application peut être déployée sur :
- AWS Lightsail
- Heroku
- DigitalOcean
- Tout serveur supportant Docker 