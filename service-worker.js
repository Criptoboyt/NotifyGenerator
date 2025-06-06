/**
 * @license
 * Copyright 2025 CriptoBoyt. Todos os direitos reservados.
 *
 * Este código é de propriedade de CriptoBoyt.
 * Qualquer uso, modificação ou distribuição deve respeitar os termos da licença MIT
 * ou outra licença aplicável definida para este projeto.
 */

const CACHE_NAME = 'notification-generator-v2'; // Nome do cache (mudei para v2 para forçar a atualização no celular)
const urlsToCache = [
  './', // Cache do arquivo index.html (a página principal)
  'index.html', // Garante que index.html seja cacheado se acessado diretamente
  'manifest.json', // Cache do arquivo de manifesto
  'https://cdn.tailwindcss.com', // Cache do CDN do Tailwind CSS
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap', // Cache da fonte do Google Fonts
  // NOVOS: URLs das logos das plataformas para cache offline
  'https://i.ibb.co/8nqXygT5/LOGO-KIWIFY-PNG-OFC.png', // Logo Kiwify
  'https://i.ibb.co/11DqF1w/LOGO-CAKTO-PNG-OFC.png', // Logo Cakto
  'https://i.ibb.co/6Rm5tvjW/LOGO-KIRVANO-PNG-OFC.png', // Logo Kirvano
  'https://i.ibb.co/Z1ksXk08/LOGO-LASTLINK-PNG-OFC.png'  // Logo Lastlink
];

// Evento de instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Evento de instalação.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto, adicionando URLs para cache.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Falha ao adicionar URLs ao cache durante a instalação:', error);
      })
  );
});

// Evento de 'fetch' - intercepta requisições de rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorne-o
        if (response) {
          console.log('Service Worker: Recurso encontrado no cache:', event.request.url);
          return response;
        }
        // Caso contrário, faça a requisição de rede
        console.log('Service Worker: Recurso não encontrado no cache, buscando na rede:', event.request.url);
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Service Worker: Erro durante o fetch:', error);
        // Opcional: Retornar uma página offline personalizada se a rede falhar
        // return caches.match('/offline.html'); 
      })
  );
});

// Evento de ativação do Service Worker (limpeza de caches antigos)
self.addEventListener('activate', event => {
  console.log('Service Worker: Evento de ativação.');
  const cacheWhitelist = [CACHE_NAME]; // Apenas o cache atual deve ser mantido

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName); // Deleta caches que não estão na lista branca
          }
        })
      );
    })
  );
});