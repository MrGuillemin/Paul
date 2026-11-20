'use strict';
(() => {
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=window.RevisionMapData;let ticket=0;const cache=new Map();const base=()=>document.body.dataset.mapBase;
const state=()=>window.RevisionEngine.getState();

function decodePolyline(encoded){
 let pos=0,x=0,y=0,first=true,d='';
 function integer(){let n=0,shift=0,b;do{if(pos>=encoded.length)throw Error('Contour tronqué');b=encoded.charCodeAt(pos++)-63;n|=(b&31)<<shift;shift+=5;}while(b>=32);return n&1?~(n>>1):n>>1;}
 while(pos<encoded.length){const dx=integer(),dy=integer();x+=dx;y+=dy;if(first){d+=`M${x} ${y}l`;first=false;}else d+=`${dx},${dy} `;}
 return d+'Z';
}
function ensureShape(code){
 if(cache.has(code))return cache.get(code);
 const request=(async()=>{
  const file=code==='world'?'world.json':data.regions[code].file;
  const response=await fetch(base()+file);if(!response.ok)throw Error('Contour indisponible : '+file);const packed=await response.json();
  if(packed.codec!=='svg-grid-polyline-gzip-v1')throw Error('Format de carte inconnu');
  const bytes=Uint8Array.from(atob(packed.data),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const rings=JSON.parse(await new Response(stream).text());
  let defs=document.querySelector('#geo-definitions defs');
  if(!defs){const lib=document.createElementNS('http://www.w3.org/2000/svg','svg');lib.id='geo-definitions';lib.setAttribute('aria-hidden','true');lib.setAttribute('width','0');lib.setAttribute('height','0');lib.style.position='absolute';lib.style.overflow='hidden';defs=document.createElementNS(lib.namespaceURI,'defs');lib.appendChild(defs);document.body.appendChild(lib);}
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.id=code==='world'?'geo-world':'geo-shape-'+code;path.setAttribute('d',rings.map(decodePolyline).join(''));path.setAttribute('transform',`scale(${1/packed.scale})`);path.setAttribute('fill-rule','evenodd');path.setAttribute('vector-effect','non-scaling-stroke');defs.appendChild(path);
 })().catch(error=>{cache.delete(code);throw error;});cache.set(code,request);return request;
}

function regionName(code){return data.regions[code]?.label||'';}
function status(item){if(!item.answer)return 'Aucune zone sélectionnée.';const r=data.regions[item.answer];return item.result===null?`Zone ${r.zone} sélectionnée. Vérifie ta réponse.`:`Territoire choisi : ${r.label}.`;}
function widget(q,item,i){return `<div class="map-widget"><p class="small">Choisis une zone sur la carte, puis vérifie. Au clavier : Tab, puis Entrée ou Espace. Le zoom facilite les petits territoires sur téléphone.</p><button class="secondary" data-open-map="${i}" aria-expanded="false" aria-controls="map-holder-${i}">Afficher la carte</button><div id="map-holder-${i}" class="map-holder"></div><p id="map-status-${i}" class="map-status" aria-live="polite">${esc(status(item))}</p></div>`;}
function regionGroup(code,i,body){const r=data.regions[code];const item=state().sessions[state().current][i];const selected=item.answer===code;const solution=item.result===false&&item.errors>=2&&item.q.answer===code;const label=`Zone ${r.zone}${selected&&item.result!==null?' : '+r.label:''}`;return `<g class="map-region${selected?' selected':''}${solution?' solution':''}" role="button" tabindex="0" aria-pressed="${selected}" aria-label="${esc(label)}" data-map-code="${code}" data-question="${i}">${body}</g>`;}
function svg(q,i){
 let content='';
 if(q.map==='metro'){
  content=data.metro.map(code=>{const r=data.regions[code];return regionGroup(code,i,`<use href="#geo-shape-${code}"/><text class="map-letter" x="${r.labelPoint[0]}" y="${r.labelPoint[1]}" text-anchor="middle" dominant-baseline="central">${r.zone}</text>`);}).join('');
  return `<svg class="territory-map" viewBox="0 0 760 660" role="group" aria-label="Carte des treize régions métropolitaines, contours IGN 2026, projection Mercator">${content}</svg>`;
 }
 const positions=[[20,395],[260,395],[500,395],[140,565],[380,565]];
 let markers=data.drom.map((code,j)=>{const r=data.regions[code],p=r.worldPoint;const dx=j===0?-22:j===1?22:12,dy=j===0?-24:j===1?24:-12;return `<circle class="world-dot" cx="${p[0]}" cy="${p[1]}" r="3"/><path class="world-leader" d="M${p[0]} ${p[1]}l${dx} ${dy}"/><text class="world-label" x="${p[0]+dx}" y="${p[1]+dy-4}" text-anchor="middle">${r.zone}</text>`;}).join('');
 const panels=data.drom.map((code,j)=>{const r=data.regions[code],[x,y]=positions[j];return regionGroup(code,i,`<rect class="inset-background" x="${x}" y="${y}" width="200" height="150" rx="9"/><g transform="translate(${x+10} ${y+27})"><use href="#geo-shape-${code}"/></g><text class="inset-label" x="${x+15}" y="${y+22}">Zone ${r.zone}</text>`);}).join('');
 return `<svg class="territory-map" viewBox="0 0 720 735" role="group" aria-label="Localisation mondiale des cinq DROM et contours IGN agrandis à des échelles différentes. Les lettres relient chaque repère à son contour."><use class="world-base" href="#geo-world"/><path class="equator" d="M0 180H720"/>${markers}<text class="world-note" x="20" y="370">Repères aux chefs-lieux · contours agrandis ci-dessous, échelles différentes</text>${panels}</svg>`;
}
async function open(i){
  const myTicket=++ticket;
 const holder=document.querySelector('#map-holder-'+i);if(!holder)return;
 const already=holder.children.length>0;
 document.querySelectorAll('.map-holder').forEach(h=>h.replaceChildren());document.querySelectorAll('[data-open-map]').forEach(b=>{b.setAttribute('aria-expanded','false');b.textContent='Afficher la carte';});
 if(already)return;
 const st=state(),q=st.sessions[st.current][i].q;
 holder.innerHTML='<p class="map-loading" role="status">Chargement des contours géographiques…</p>';
 const loadingButton=document.querySelector(`[data-open-map="${i}"]`);loadingButton.setAttribute('aria-expanded','true');loadingButton.textContent='Masquer la carte';
 try {await Promise.all([...data[q.map].map(code=>ensureShape(code)),...(q.map==='drom'?[ensureShape('world')]:[])]);} catch(error) {
   if(myTicket!==ticket)return;holder.replaceChildren();const retryButton=document.querySelector(`[data-open-map="${i}"]`);retryButton.setAttribute('aria-expanded','false');retryButton.textContent='Afficher la carte';document.querySelector('#map-status-'+i).textContent='Les contours ne se sont pas chargés. Clique à nouveau sur Afficher la carte pour réessayer.';console.error(error);return;
 }
 if(myTicket!==ticket||!holder.isConnected)return;
 holder.innerHTML=`<div class="map-toolbar"><button class="secondary" data-zoom-map="${i}" aria-pressed="false">Agrandir la carte</button><span class="small">Les noms apparaissent après vérification.</span></div><div class="map-frame">${svg(q,i)}</div><p class="map-credit">Contours : <a href="https://cartes.gouv.fr/" target="_blank" rel="noopener noreferrer">IGN ADMIN EXPRESS COG 2026</a>, Licence ouverte. ${q.map==='drom'?'Planisphère de repérage : Natural Earth, domaine public. Les encadrés utilisent les contours IGN.':''}</p>`;
 const button=document.querySelector(`[data-open-map="${i}"]`);button.setAttribute('aria-expanded','true');button.textContent='Masquer la carte';
}
function refresh(i){const st=state();if(!st.bank)return;const item=st.sessions[st.current][i];if(item.q.type!=='map')return;const p=document.querySelector('#map-status-'+i);if(p)p.textContent=status(item);
 document.querySelectorAll(`#map-holder-${i} [data-map-code]`).forEach(g=>{const r=data.regions[g.dataset.mapCode],selected=item.answer===r.code;g.classList.toggle('selected',selected);const solution=item.result===false&&item.errors>=2&&item.q.answer===r.code;g.classList.toggle('solution',solution);g.setAttribute('aria-pressed',String(selected));g.setAttribute('aria-label',`Zone ${r.zone}${selected&&item.result!==null?' : '+r.label:''}`);});
}
function choose(g){const i=Number(g.dataset.question);window.RevisionEngine.setMapAnswer(i,g.dataset.mapCode);refresh(i);}
document.addEventListener('click',e=>{const g=e.target.closest('[data-map-code]');if(g){choose(g);return;}const b=e.target.closest('button');if(!b)return;if(b.dataset.openMap!==undefined)open(Number(b.dataset.openMap));else if(b.dataset.zoomMap!==undefined){const frame=b.closest('.map-holder').querySelector('.map-frame');const zoomed=frame.classList.toggle('zoomed');b.setAttribute('aria-pressed',String(zoomed));b.textContent=zoomed?'Vue entière':'Agrandir la carte';}});
document.addEventListener('keydown',e=>{const g=e.target.closest('[data-map-code]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(g);}});
document.addEventListener('revision:render',()=>{const first=document.querySelector('[data-open-map]');if(first)open(Number(first.dataset.openMap));});
window.RevisionMaps={widget,refresh,regionName,data};
})();
