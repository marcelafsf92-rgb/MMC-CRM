// MMC CRM — Service Worker
// v2: bypassa Supabase/BrasilAPI e requisições não-GET (nunca cacheia POST),
// navigate network-first, atualiza cache de assets. Evita "salva mas some".
const V='mmc-crm-v5';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['/','/index.html','/manifest.json']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.includes('supabase')||u.hostname.includes('brasilapi')||u.hostname.includes('mmc-rastreio'))return;
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));return}
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r&&r.status===200){const rc=r.clone();caches.open(V).then(ca=>ca.put(e.request,rc))}return r}).catch(()=>caches.match('/index.html'))));
});
