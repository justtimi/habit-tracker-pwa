const CACHE_NAME = "habit-tracker-v2";

const STATIC_ASSETS =  [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  "/manifest.json",
  "/favicon.ico",
];

// install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});


self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (!req.url.startsWith("http")) return;
  if (req.url.startsWith("ws")) return;

  if (req.url.includes("manifest.json")) {
    event.respondWith(
      caches.match("/manifest.json").then((cached) => cached || fetch(req))
    );
    return;
  }

  if (req.url.includes("favicon.ico")) {
    event.respondWith(
      caches.match("/favicon.ico").then((cached) => cached || fetch(req))
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/")));
    return;
  }

  const isAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2");

  if (isAsset) {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req)
            .then((res) => {
              if (!res || res.status !== 200 || res.type !== "basic") return res;

              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
              return res;
            })
            .catch(() => cached)
        );
      })
    );
    return;
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});