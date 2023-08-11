const staticHorseCalendar = "horse-calendar"
const assets = [
  "/horse-calendar/",
  "/horse-calendar/index.html",
  "/horse-calendar/css/style.css",
  "/horse-calendar/js/main.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticHorseCalendar).then(cache => {
      cache.addAll(assets)
      console.log(assets);
    })
  )
})

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
  
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