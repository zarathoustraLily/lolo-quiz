const CACHE_NAME = 'quiz-dcg-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Installation du service worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Mise en cache globale');
        return cache.addAll(urlsToCache.map(url => new Request(url, {mode: 'no-cors'})));
      })
      .catch(error => {
        console.error('[Service Worker] Erreur de mise en cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Récupération:', event.request.url);
  
  // Ne pas mettre en cache les requêtes POST
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Utilisation du cache pour:', event.request.url);
          return response;
        }

        console.log('[Service Worker] Récupération depuis le réseau pour:', event.request.url);
        return fetch(event.request.clone())
          .then(response => {
            // Vérifier si nous avons reçu une réponse valide
            if (!response || response.status !== 200) {
              return response;
            }

            // Cloner la réponse car elle va être consommée par le navigateur
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('[Service Worker] Mise en cache de:', event.request.url);
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('[Service Worker] Erreur de mise en cache:', error);
              });

            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Erreur de récupération:', error);
            // Retourner une réponse d'erreur personnalisée
            return new Response('Erreur de connexion. Vérifiez votre connexion internet.');
          });
      })
  );
}); 