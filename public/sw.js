/* KinSignal guest guidance offline shell. NEVER cache personal cases or account routes. */
const CACHE="kinsignal-public-guidance-v1";
const PUBLIC_ROUTES=["/offline","/privacy","/learn"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC_ROUTES)));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("kinsignal-")&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET"||req.mode!=="navigate")return;
 const u=new URL(req.url);
 if(u.origin!==self.location.origin||u.pathname.startsWith("/account")||u.pathname.startsWith("/cases")||u.pathname.startsWith("/api"))return;
 event.respondWith(fetch(req).catch(async()=>{const hit=await caches.match(req);return hit||await caches.match("/offline")||Response.error();}));
});
