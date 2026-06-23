const CACHE_NAME = 'fincontrol-v1';

// ATENÇÃO: Substitua 'nome-do-seu-repositorio' pelo nome real da sua pasta no GitHub
const urlsToCache = [
  '/nome-do-seu-repositorio/',
  '/nome-do-seu-repositorio/index.html',
  '/nome-do-seu-repositorio/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Baixa e salva em cache os arquivos estruturais principais primeiro
      cache.addAll(urlsToCache);
      
      // Tenta baixar a imagem da logo de forma segura para não travar o app caso ela mude de nome
      return cache.add('/nome-do-seu-repositorio/logo.png')
        .catch(() => console.log("Aviso: logo.png não foi encontrada na raiz, pulando cache da imagem."));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna o arquivo do cache se encontrar, senão busca na internet
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remove caches antigos de versões anteriores do seu app se existirem
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
