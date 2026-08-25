// Neural Arcade Service Worker — cache-first for static, network-first for navigation
const CACHE_NAME = "neural-arcade-v1.0.0";
const PRECACHE_URLS = [
  "/",
  "/logo.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/og-image.png",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
];

async function precacheIndependently() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(PRECACHE_URLS.map(async (path) => {
    try {
      const response = await fetch(path, { cache: "reload" });
      if (response.ok) await cache.put(path, response);
      else console.warn(`[Neural Arcade] No se pudo precargar ${path}: HTTP ${response.status}`);
    } catch (error) {
      console.warn(`[Neural Arcade] No se pudo precargar ${path}`, error);
    }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    await precacheIndependently();
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || url.pathname === "/") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) ?? (await caches.match("/")) ?? new Response("", { status: 503 });
      }
    })());
    return;
  }

  // Per-client rate-limit responses must never be cached.
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ error: "service unavailable" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        },
      )),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static") || /\.(png|jpg|svg|gif|webp|woff2?|ttf|css|js)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    })());
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => (await caches.match(request)) ?? new Response("", { status: 503 })),
  );
});
