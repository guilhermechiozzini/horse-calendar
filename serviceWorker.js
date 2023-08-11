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

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })