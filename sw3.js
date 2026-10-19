const V='brd3-v7',FILES=['v3.html','manifest3.json','icon3-192.png','icon3-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith('brd3-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 if(/\.(txt|csv|json)$/.test(u.pathname)&&!/manifest3\.json$/.test(u.pathname))return;
 e.respondWith((async()=>{
  const hit=await caches.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>null);
  return hit||(await net)||(await caches.match('v3.html'));
 })());
});
