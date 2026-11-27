'use strict';
(() => {
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const integer=value=>/^\d+$/.test(String(value).trim())?BigInt(String(value).trim()):null;
 function format(text){return String(text).split(/(\[\[[\d?]+\/[\d?]+\]\])/g).map(s=>{const m=s.match(/^\[\[([\d?]+)\/([\d?]+)\]\]$/);return m?`<span class="ext-fraction" role="img" aria-label="${m[1]==='?'?'à compléter':m[1]} sur ${m[2]==='?'?'à compléter':m[2]}"><span aria-hidden="true">${m[1]}</span><span aria-hidden="true">${m[2]}</span></span>`:escape(s);}).join('');}
 function fresh(q){return ['multi','grid'].includes(q.kind)?[]:['rational','division','mixed','fields'].includes(q.kind)?Array(q.kind==='rational'||q.kind==='division'?2:q.kind==='mixed'?3:q.expected.length).fill(''):'';}
 function correct(q,answer){
  if(q.kind==='multi')return Array.isArray(answer)&&answer.length===q.answer.length&&new Set(answer).size===answer.length&&answer.every(v=>q.answer.includes(v));
  if(q.kind==='single')return answer===q.answer;
  if(q.kind==='grid')return Array.isArray(answer)&&new Set(answer).size===answer.length&&answer.every(n=>Number.isInteger(n)&&n>=0&&n<q.visual.total)&&answer.length===q.visual.target;
  if(q.kind==='rank')return String(answer)===String(q.answer);
  if(q.kind==='number'){const n=integer(answer);return n!==null&&n===BigInt(q.expected);}
  if(q.kind==='condition'){
   const value=integer(answer);if(value===null||value<=0n)return false;
   const numerator=q.side==='numerator'?value:BigInt(q.n),denominator=q.side==='denominator'?value:BigInt(q.d);
   return q.relation==='<'?numerator<denominator:q.relation==='>'?numerator>denominator:numerator===denominator;
  }
  if(!Array.isArray(answer))return false;const ints=answer.map(integer);if(ints.some(n=>n===null))return false;
  if(q.kind==='fields')return ints.length===q.expected.length&&ints.every((v,i)=>v===BigInt(q.expected[i]));
  if(q.kind==='rational'){if(ints.length!==2)return false;const[n,d]=ints;return d>0n&&n*BigInt(q.target[1])===d*BigInt(q.target[0]);}
  if(q.kind==='division'){if(ints.length!==2)return false;const[quotient,remainder]=ints,n=BigInt(q.n),d=BigInt(q.d);return remainder<d&&quotient*d+remainder===n;}
  if(q.kind==='mixed'){if(ints.length!==3)return false;const[whole,numerator,denominator]=ints,n=BigInt(q.n),d=BigInt(q.d);return denominator>0n&&numerator<denominator&&whole===n/d&&numerator*d===(n%d)*denominator;}
  return false;
 }
 function empty(q,answer){if(['grid','multi'].includes(q.kind))return answer.length===0;if(Array.isArray(answer))return answer.some(v=>String(v).trim()==='');return String(answer).trim()==='';}
 function hint(q,answer){if(q.kind==='division'&&integer(answer[1])!==null&&integer(answer[1])>=BigInt(q.d))return `Le reste doit être inférieur à ${q.d}. Cherche d’abord combien de groupes complets tu peux former.`;if(['rational','mixed'].includes(q.kind)&&Array.isArray(answer)&&integer(answer.at(-1))===0n)return 'Le dénominateur ne peut pas être zéro.';if(q.kind==='condition'&&integer(answer)===0n)return 'La consigne demande un entier strictement positif : zéro ne convient pas ici.';return q.hint;}
 function field(i,j,label,value){return `<div><label for="extended-${i}-${j}">${escape(label)}</label><input id="extended-${i}-${j}" type="text" inputmode="numeric" autocomplete="off" data-answer="${i}" data-sub="${j}" value="${escape(value)}"></div>`;}
 function render(q,item,i){
  if(q.visual&&!q.visual.interactive){const columns=q.visual.total===4?2:10;return `<div class="ext-visual" role="img" aria-label="${q.visual.filled} parts coloriées sur ${q.visual.total} parts égales"><div class="ext-grid ${q.visual.total===10?'ext-tenths':''}" style="--ext-columns:${columns}">${Array.from({length:q.visual.total},(_,j)=>`<span class="ext-cell ${j<q.visual.filled?'is-filled':''}" aria-hidden="true">${j<q.visual.filled?'✓':''}</span>`).join('')}</div></div>`+render({...q,visual:null},item,i);}
  if(q.kind==='multi'||q.kind==='single')return `<p class="small">${q.kind==='multi'?'Sélectionne toutes les écritures correctes. Plusieurs réponses sont attendues.':'Choisis une réponse.'}</p><div class="ext-options">${item.options.map((value,j)=>`<button type="button" class="secondary ext-option" data-extension-action="${q.kind}" data-question="${i}" data-option="${j}" aria-pressed="${q.kind==='multi'?item.answer.includes(value):item.answer===value}">${format(value)}</button>`).join('')}</div>`;
  if(q.kind==='number'||q.kind==='condition')return `<label for="extended-${i}">Ta réponse${q.kind==='condition'?' (entier positif)':''}</label><input id="extended-${i}" data-answer="${i}" type="text" inputmode="numeric" autocomplete="off" value="${escape(item.answer)}">`;
  if(['rational','division','mixed','fields'].includes(q.kind)){
   const labels=q.kind==='rational'?['Numérateur','Dénominateur']:q.kind==='division'?['Quotient q','Reste r']:q.kind==='mixed'?['Partie entière','Numérateur du reste','Dénominateur du reste']:q.labels;
   return `<div class="ext-fields">${labels.map((label,j)=>field(i,j,label,item.answer[j])).join('')}</div>${['rational','mixed'].includes(q.kind)?'<p class="small">Les fractions équivalentes sont acceptées. Le dénominateur doit être positif.</p>':''}`;
  }
  if(q.kind==='grid'){
   const count=item.answer.length,total=q.visual.total,columns=total===4?2:10;
   return `<p class="small">Colorie les parts au clic ou au clavier. Tu peux aussi saisir leur nombre.</p><label for="grid-count-${i}">Nombre de cases coloriées</label><input id="grid-count-${i}" type="text" inputmode="numeric" data-extension-count="${i}" value="${count}"><p class="small" data-extension-count-label="${i}" aria-live="polite">${count} / ${total} cases coloriées</p><button class="secondary" type="button" data-extension-action="zoom" data-question="${i}">Agrandir la grille</button><div class="ext-grid-frame"><div class="ext-grid ${total===10?'ext-tenths':''}" style="--ext-columns:${columns}">${Array.from({length:total},(_,j)=>`<button type="button" class="ext-cell ${item.answer.includes(j)?'is-filled':''}" data-extension-action="cell" data-question="${i}" data-cell="${j}" aria-label="Case ${j+1} sur ${total}" aria-pressed="${item.answer.includes(j)}">${item.answer.includes(j)?'✓':''}</button>`).join('')}</div></div>`;
  }
  if(q.kind==='rank'){
   const icon=q.row==='voitures'?'<path d="M7 25h46v13H7Zm8 0 6-13h20l7 13Z"/><circle cx="18" cy="40" r="6"/><circle cx="44" cy="40" r="6"/>':q.row==='enfants'?'<circle cx="30" cy="10" r="7"/><path d="M30 19v16m0-9L16 34m14-8 14 8M30 35 19 49m11-14 11 14" fill="none" stroke="currentColor" stroke-width="4"/>':'<rect x="11" y="10" width="38" height="35" rx="5"/>';
   return `<p class="small">Sens de lecture : de gauche à droite →. Sur téléphone, fais défiler la rangée si nécessaire.</p><div class="ext-rank-row" role="group" aria-label="${escape(q.row)}, de gauche à droite">${Array.from({length:q.length},(_,j)=>`<button type="button" class="secondary" data-extension-action="rank" data-question="${i}" data-rank="${j+1}" aria-label="Position ${j+1} en partant de la gauche" aria-pressed="${String(item.answer)===String(j+1)}"><svg viewBox="0 0 60 55" width="48" height="44" aria-hidden="true">${icon}</svg><span>${String.fromCharCode(65+j)}</span></button>`).join('')}</div>`;
  }
  return '';
 }
 function generate(ex,rng=Math.random){
  if(ex.generator!=='euclidean')return ex.questions;
  const fixed=[[54,5],[23,4],[37,6],[45,8],[28,7]],seen=new Set(fixed.map(([n,d])=>n+'-'+d)),pool=[];
  for(let d=2;d<=12;d++)for(let whole=1;whole<=12;whole++)for(let remainder=0;remainder<d;remainder++){const n=d*whole+remainder;if(!seen.has(n+'-'+d))pool.push([n,d]);}
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return [...fixed,...pool.slice(0,55)].map(([n,d])=>({id:`m4-division-generated-${n}-${d}`,type:'extended',kind:'division',format:'math',prompt:`Calcule le quotient et le reste de ${n} : ${d}.`,n,d,hint:'Cherche les groupes complets ; le reste doit être inférieur au diviseur.',explanation:`${n} = ${d} × ${Math.floor(n/d)} + ${n%d} ; q = ${Math.floor(n/d)}, r = ${n%d}, et ${n%d} < ${d}.`}));
 }
 const plugin={fresh,correct,empty,hint,render,format,integer,generate};
 if(typeof module!=='undefined')module.exports=plugin;
 if(typeof window!=='undefined'){window.RevisionExtensionTypes=plugin;window.RevisionEngine.registerType('extended',plugin);}
})();
