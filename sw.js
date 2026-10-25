// Service worker del Curso LOTO (SSGI OTEC)
// Si actualizas archivos de la app, cambia el número de VERSION para que los teléfonos descarguen la nueva versión.
const VERSION = "curso-loto-v1";
const CORE = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "img/s10_image15.jpg",
 "img/s10_image16.jpg",
 "img/s12_image18.jpg",
 "img/s12_image19.png",
 "img/s14_image22.png",
 "img/s16_image24.png",
 "img/s18_image26.jpg",
 "img/s1_image6.jpg",
 "img/s1_image7.jpg",
 "img/s21_image28.png",
 "img/s23_image32.png",
 "img/s24_image33.jpg",
 "img/s25_image36.jpg",
 "img/s31_image41.jpg",
 "img/s33_image43.jpg",
 "img/s34_image48.jpg",
 "img/s34_image50.jpg",
 "img/s35_image53.jpg",
 "img/s35_image54.jpg",
 "img/s35_image55.jpg",
 "img/s35_image56.jpg",
 "img/s35_image57.jpg",
 "img/s35_image58.jpg",
 "img/s36_image59.jpg",
 "img/s36_image60.png",
 "img/s36_image61.jpg",
 "img/s37_image63.png",
 "img/s38_image64.jpg",
 "img/s38_image65.jpg",
 "img/s38_image66.png",
 "img/s39_image67.jpg",
 "img/s39_image68.jpg",
 "img/s39_image69.jpg",
 "img/s39_image70.jpg",
 "img/s39_image71.jpg",
 "img/s39_image72.jpg",
 "img/s39_image73.jpg",
 "img/s40_image74.png",
 "img/s41_image75.jpg",
 "img/s41_image76.jpg",
 "img/s42_image77.png",
 "img/s43_image78.png",
 "img/s44_image79.png",
 "img/s44_image80.png",
 "img/s49_image104.jpg",
 "img/s52_image105.png",
 "img/s5_image11.png",
 "img/s6_image12.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Audio y video se transmiten desde internet (no se guardan en el teléfono)
  if (url.pathname.includes("/audio/") || url.pathname.includes("/video/") || req.headers.has("range")) return;
  // Página: primero internet (para recibir actualizaciones), si no hay conexión, la copia guardada
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put("index.html", cp)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  // Resto (imágenes, íconos, fuentes): primero la copia guardada
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok && (url.origin === location.origin || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com"))) { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); }
    return r;
  })));
});
