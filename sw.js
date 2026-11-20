// Always tries the network first, so a new index.html on GitHub is used on the next open.
// The cache is only a fallback when the phone is offline.
const C='neet-mock-cache';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  const mine=u.origin===location.origin,cdn=u.hostname==='cdn.jsdelivr.net';
  if(r.method!=='GET'||!(mine||cdn))return;
  e.respondWith(fetch(mine?new Request(r,{cache:'no-store'}):r).then(res=>{
    if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(C).then(x=>x.put(r,c))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))));
});
