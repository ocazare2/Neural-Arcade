// Neural Arcade Service Worker — cache-first for static, network-first for API
const CACHE_NAME = "neural-arcade-v6";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/logo.svg", "/icon-192.png", "/manifest.json", "/robots.txt", "/sitemap.xml"]).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first with cache fallback
  if (req.mode === "navigate" || url.pathname === "/") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // API: network-only; per-client rate-limit responses must never be cached
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(req).catch(() => new Response("{\"error\":\"service unavailable\"}", { status: 503, headers: { "Content-Type": "application/json" } }))
    );
    return;
  }

  // Static assets: cache-first
  if (url.pathname.startsWith("/_next/static") || /\.(png|jpg|svg|gif|webp|woff2?|ttf|css|js)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        });
      })
    );
    return;
  }

  // Everything else: network with cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || new Response("", { status: 503 })))
  );
});
