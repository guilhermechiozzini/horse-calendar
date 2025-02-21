const staticHorseCalendar = "horse-calendar-11"
const staticHorseCalendarnew = "horse-calendar-12"
const assets = [
  "/horse-calendar/",
  "/horse-calendar/index.html",
  "/horse-calendar/css/style.css",
  "/horse-calendar/js/main.js",
  "/horse-calendar/js/remedios.js",
  "/horse-calendar/remedios/index.html",
  "/horse-calendar/pagamentos/index.html",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticHorseCalendarnew).then(cache => {
      cache.addAll(assets)
      console.log(assets);
    })
  )
})

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
      caches.keys().then(function(cacheNames) {
        cacheNames.forEach(function(cacheName){
          if(cacheName == staticHorseCalendar){
            console.log("vai deletar cache antigo");
            caches.delete(cacheName);
          }
        })        
      });
      const cache = await caches.open(staticHorseCalendarnew);
  
      // Get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
          try {
            // If the resource was not in the cache, try the network.
            const fetchResponse = await fetch(event.request);
  
            // Save the resource in the cache and return it.
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          } catch (e) {
            // The network failed.
          }
      }
    })());
  });