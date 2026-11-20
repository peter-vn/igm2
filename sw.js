// Offline shell for Idle Guild Master.
// index.html: network first (updates arrive at once), cache when offline. Hashed assets (data-*.json, img/sprites-*): cache first, they never change.
const C = "igm-c2-8ac66a83-d75cc9", ASSETS = ["data-8ac66a83.json", "img/sprites-5b028ec0.json", "img/sprites-bdb3dfd5.wasm"];
const KEY = (r) => (r.mode === "navigate" ? "./index.html" : r);
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(C).then((c) => c.addAll(["./index.html", "./manifest.webmanifest", "./icon-192.png", ...ASSETS.map((a) => "./" + a)]).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (/\/(data-[0-9a-f]{8}\.json|img\/sprites-[0-9a-f]{8}\.(wasm|json))$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); } return res; })));
    return;
  }
  const net = fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put(KEY(r), cp)); } return res; });
  const cached = () => caches.match(KEY(r)).then((m) => m || (r.mode === "navigate" ? caches.match("./index.html") : undefined));
  e.respondWith(r.mode === "navigate"
    ? Promise.race([net.catch(() => null), new Promise((ok) => setTimeout(() => ok(null), 4000))]).then((res) => res || cached().then((m) => m || net))
    : net.catch(() => cached().then((m) => m || Response.error())));
});
