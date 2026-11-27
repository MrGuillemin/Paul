'use strict';
(() => {
const types={};
function mount({root=document,prefix='',bankURL=document.body.dataset.bank,passive=false}={}){
const $=s=>root.querySelector(s.replace(/#([a-zA-Z][\w-]*)/g,(_,id)=>'#'+prefix+id));
const markup=html=>prefix?html.replace(/(id|for|aria-labelledby|aria-describedby)="([^"]*)"/g,(_,attr,value)=>attr+'="'+value.split(' ').map(id=>prefix+id).join(' ')+'"'):html;
const setHTML=(element,html)=>element.innerHTML=markup(html);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Reutilise le melange Fisher-Yates deja partage par les autres matieres.
const shuffle=source=>window.shuffle(source);
const norm=(s,strict=false)=>{let out=String(s).normalize('NFKC').toLowerCase().trim().replace(/[’ʼ]/g,"'").replace(/[‐‑‒–—−]/g,'-').replace(/\s*-\s*/g,'-').replace(/\s+/g,' ');if(!strict)out=out.normalize('NFD').replace(/[\u0300-\u036f]/g,'');return out;};
let bank,current=0,sessions=[];
const formatted=(s,q)=>q?.format==='math'&&types.extended?types.extended.format(s):esc(s);
const renew=(ex,previous=[])=>{if(ex.generator&&types.extended?.generate)ex.questions=types.extended.generate(ex);return draw(ex.questions,previous,ex.sessionSize||10,ex);};
const fresh=ex=>renew(ex);
function draw(questions,previous=[],size=10,recipe={}){
 let plan=recipe.blueprint;
 if(recipe.balanceBuckets){plan={};const buckets=shuffle(recipe.balanceBuckets);buckets.forEach((skill,i)=>plan[skill]=Math.floor(size/buckets.length)+(i<size%buckets.length?1:0));}
 let selected=plan?shuffle(Object.entries(plan).flatMap(([skill,count])=>shuffle(questions.filter(q=>q.skill===skill)).slice(0,count))):shuffle(questions).slice(0,size);
 const old=new Set(previous.map(i=>i.q.id));
 if(selected.every(q=>old.has(q.id))){const unused=shuffle(questions.filter(q=>!old.has(q.id)));if(unused.length){const q=unused[0],index=plan?selected.findIndex(item=>item.skill===q.skill):selected.length-1;if(index>=0)selected[index]=q;}}
 return selected.map(q=>({q,options:shuffle(q.options||[]),fieldOptions:q.fieldOptions?q.fieldOptions.map(shuffle):null,pool:q.type==='order'?shuffle(q.words.map((_,i)=>i)):[],answer:types[q.type]?.fresh?types[q.type].fresh(q):q.type==='decompose'?q.parts.map(()=>''):q.type==='order'?[]:'',result:null,errors:0,message:'',tone:'',revealed:false,rubric:[]}));
}
function isCorrect(q,answer){
 if(types[q.type])return types[q.type].correct(q,answer);
 if(q.type==='decompose')return answer.length===q.answers.length&&answer.every((a,i)=>norm(a)===norm(q.answers[i]));
 if(q.type==='tokens')return String(answer)===String(q.answer);
 if(q.type==='order'){if(answer.length!==q.words.length||new Set(answer).size!==answer.length||answer.some(i=>!Number.isInteger(i)||i<0||i>=q.words.length))return false;const phrase=answer.map(i=>q.words[i]).join(' ');return [q.answer,...(q.aliases||[])].some(a=>norm(a)===norm(phrase));}
 if(q.type==='self')return null;
 const answers=[q.answer,...(q.aliases||[])];
 return answers.some(a=>{const got=norm(answer,q.strict);const expected=norm(a,q.strict);return got===expected||(/^\d[\d ]*$/.test(expected)&&/^\d[\d ]*$/.test(got)&&got.replace(/ /g,'')===expected.replace(/ /g,''));});
}
function empty(item){if(types[item.q.type])return types[item.q.type].empty(item.q,item.answer);if(item.q.type==='order')return item.answer.length!==item.q.words.length;if(item.q.type==='decompose')return item.answer.some(a=>!a);return String(item.answer).trim()==='';}
function stats(index){const items=sessions[index];return {correct:items.filter(i=>i.result===true).length,auto:items.filter(i=>i.q.type!=='self').length,checked:items.filter(i=>i.result!==null).length,self:items.filter(i=>i.q.type==='self'&&i.result!==null).length,understood:items.filter(i=>i.result==='yes').length};}
function update(){
 const all=sessions.map((_,i)=>stats(i));const score=all.reduce((a,s)=>a+s.correct,0),total=all.reduce((a,s)=>a+s.auto,0),checked=all.reduce((a,s)=>a+s.checked,0);
 $('#score').textContent=`${score} / ${total} réponses correctes`;
 $('#progress').max=sessions.reduce((n,s)=>n+s.length,0);$('#progress').value=checked;
 $('#progress-text').textContent=`${checked} / ${sessions.reduce((n,s)=>n+s.length,0)} questions vérifiées ou autoévaluées · Une question ne rapporte qu’un point.`;
 $('#position').textContent=`Exercice ${current+1} sur ${bank.exercises.length}`;
 const s=all[current];$('#local-score').textContent=`Cette série : ${s.correct} / ${s.auto} réponses correctes${sessions[current].some(i=>i.q.type==='self')?` · ${s.self} réponse(s) autoévaluée(s), hors score`:''}`;
 $('#steps').querySelectorAll('[data-exercise]').forEach((b,i)=>{b.toggleAttribute('aria-current',i===current);if(i===current)b.setAttribute('aria-current','step');b.textContent=`${i+1}${all[i].checked===sessions[i].length?' ✓':''}`;});
}
function feedback(i){const item=sessions[current][i];return `<p class="feedback ${item.tone}" id="feedback-${i}" aria-live="polite" aria-atomic="true">${formatted(item.message,item.q)}</p>`;}
function options(item,i,select=false){return item.options.map(value=>select?`<option value="${esc(value)}" ${item.answer===value?'selected':''}>${esc(value)}</option>`:`<label class="choice"><input type="radio" name="q${i}" data-answer="${i}" value="${esc(value)}" ${item.answer===value?'checked':''}>${formatted(value,item.q)}</label>`).join('');}
function questionHTML(item,i){
 const q=item.q;let body='';
 if(q.type==='choice')body=`<fieldset><legend>${i+1}. ${formatted(q.prompt,q)}</legend>${q.context?`<p class="context">${formatted(q.context,q)}</p>`:''}<div class="choices">${options(item,i)}</div></fieldset>`;
 else{
  body=`<h3 id="prompt-${i}">${i+1}. ${formatted(q.prompt,q)}</h3>${q.context?`<p class="context">${formatted(q.context,q)}</p>`:''}`;
  if(types[q.type])body+=types[q.type].render(q,item,i,{esc,formatted});
  if(q.type==='map')body+=window.RevisionMaps.widget(q,item,i);
  if(q.illustration)body+=`<svg class="food-illustration" viewBox="0 0 120 100" aria-hidden="true"><use href="${document.body.dataset.mapBase}foods.svg#${esc(q.illustration)}"/></svg>`;
  if(q.type==='select')body+=`<label class="small" for="answer-${i}">Choisir une réponse</label><select id="answer-${i}" data-answer="${i}"><option value="">Choisir…</option>${options(item,i,true)}</select>`;
  if(q.type==='text')body+=`<label class="small" for="answer-${i}">Ta réponse</label><input type="text" id="answer-${i}" data-answer="${i}" value="${esc(item.answer)}" autocomplete="off" spellcheck="false" ${/^\d[\d ]*$/.test(q.answer)?'inputmode="numeric"':''}>`;
  if(q.type==='tokens')body+=`<div class="word-row" role="group" aria-labelledby="prompt-${i}">${q.words.map((w,j)=>`<button class="word secondary" data-token="${i}" data-index="${j}" aria-pressed="${String(item.answer)===String(j)}">${esc(w)}</button>`).join('')}</div>`;
  if(q.type==='decompose')body+=`${q.fieldOptions?'<p class="small">Chaque champ est vérifié séparément. L’association rapporte un point lorsque toutes les réponses sont correctes.</p>':''}<div class="decomposition">${q.parts.map((part,j)=>`<div><label for="part-${i}-${j}">${esc(part)}</label><select id="part-${i}-${j}" data-answer="${i}" data-sub="${j}"><option value="">Choisir…</option>${(item.fieldOptions?.[j]||item.options).map(o=>`<option value="${esc(o)}" ${item.answer[j]===o?'selected':''}>${esc(o)}</option>`).join('')}</select><span class="small" id="field-feedback-${i}-${j}" aria-live="polite">${item.result===null?'':norm(item.answer[j])===norm(q.answers[j])?'✓ Correct':'↻ À revoir'}</span></div>`).join('')}</div>`;
  if(q.type==='order')body+=`<p class="small">Clique sur les mots dans l’ordre. Clique sur un mot déjà placé pour le retirer.</p><div class="built" id="built-${i}" aria-live="polite">${item.answer.length?item.answer.map((j,k)=>`<button class="word secondary" data-remove="${i}" data-position="${k}" aria-label="Retirer ${esc(q.words[j])}">${esc(q.words[j])}</button>`).join(''):'Ta construction apparaîtra ici.'}</div><div class="word-row">${item.pool.map(j=>`<button class="word secondary" data-place="${i}" data-index="${j}" ${item.answer.includes(j)?'disabled':''}>${esc(q.words[j])}</button>`).join('')}</div>`;
  if(q.type==='self')body+=`<label class="small" for="answer-${i}">Rédige une phrase avec tes mots.</label><textarea id="answer-${i}" data-answer="${i}">${esc(item.answer)}</textarea><button class="secondary" data-reveal="${i}">Voir les éléments attendus</button>${item.revealed?`<div class="model"><h4>Éléments attendus</h4><p>${esc(q.model)}</p><p>Compare les idées, sans chercher à recopier la phrase.</p>${q.criteria.map((c,j)=>`<label class="rubric"><input type="checkbox" data-rubric="${i}" data-index="${j}" ${item.rubric.includes(j)?'checked':''}>${esc(c)}</label>`).join('')}<div class="row"><button data-assess="${i}" data-value="yes" aria-pressed="${item.result==='yes'}">J’ai compris</button><button class="secondary" data-assess="${i}" data-value="no" aria-pressed="${item.result==='no'}">À revoir</button></div></div>`:''}`;
 }
 return `<article class="new-question" id="question-${i}">${body}${feedback(i)}<div class="question-actions">${q.type!=='self'?`<button class="secondary" data-check="${i}">Vérifier</button>`:''}<button class="secondary" data-retry="${i}">Réessayer</button></div></article>`;
}
function graph(){return `<aside class="document"><h3>Document étudié : le réseau ferré</h3><svg class="rail-chart" viewBox="0 0 700 210" role="img" aria-label="Longueur du réseau ferré français : 2 859 kilomètres en 1849 et 32 601 kilomètres en 1899. Les barres sont proportionnelles."><text x="10" y="57">1849</text><text x="10" y="142">1899</text><rect x="80" y="25" width="${500*2859/32601}" height="45"/><rect x="80" y="110" width="500" height="45"/><text x="${90+500*2859/32601}" y="55">2 859 km</text><text x="590" y="140">32 601 km</text><text x="80" y="190">Longueur en kilomètres · 50 ans entre les deux mesures</text></svg><table><caption>Valeurs du document fourni</caption><thead><tr><th scope="col">Année</th><th scope="col">Longueur du réseau</th></tr></thead><tbody><tr><th scope="row">1849</th><td>2 859 km</td></tr><tr><th scope="row">1899</th><td>32 601 km</td></tr></tbody></table></aside>`;}
function render(focus=false){
 const ex=bank.exercises[current];$('#summary').hidden=true;
 setHTML($('#exercise'),`<p class="eyebrow">EXERCICE ${current+1} / ${bank.exercises.length} · SÉRIE DE ${sessions[current].length} PARMI ${ex.questions.length}</p><h2 id="exercise-title">${esc(ex.title)}</h2>${ex.poolNote?`<p class="pool-note">${esc(ex.poolNote)}</p>`:''}${ex.graph?graph():''}${sessions[current].map(questionHTML).join('')}<p id="local-score" class="local-score" aria-live="polite"></p><div class="row"><button id="verify-all">Vérifier la série</button><button class="secondary" id="new-series">Nouvelle série</button></div>`);
 $('#previous').disabled=current===0;$('#next').disabled=false;$('#next').textContent=current===bank.exercises.length-1?'Voir le bilan →':'Suivant →';update();document.dispatchEvent(new CustomEvent('revision:render'));if(focus)$('#exercise').focus();
}
function syncFeedback(i){const it=sessions[current][i],el=$(`#feedback-${i}`);el.className='feedback '+it.tone;if(it.q.format==='math')setHTML(el,formatted(it.message,it.q));else el.textContent=it.message;if(it.q.type==='decompose')it.q.parts.forEach((_,j)=>{const select=$(`#part-${i}-${j}`),status=$(`#field-feedback-${i}-${j}`);if(it.result===null){select.removeAttribute('aria-invalid');status.textContent='';}else{const correct=norm(it.answer[j])===norm(it.q.answers[j]);select.setAttribute('aria-invalid',String(!correct));status.textContent=correct?'✓ Correct':'↻ À revoir';}});window.RevisionMaps?.refresh(i);}
function invalidate(i){const it=sessions[current][i];it.result=null;it.message='';it.tone='';if(it.q.type==='self')it.revealed=false;syncFeedback(i);$('#summary').hidden=true;update();}
function errorHint(item){
 const q=item.q;
 if(types[q.type]?.hint)return types[q.type].hint(q,item.answer)||q.hint||'Relis la consigne et réessaie.';
 if(q.strict&&q.format!=='language'){const value=norm(item.answer,true);if(/milles/.test(value))return 'Attention : mille est invariable.';if(/cents-/.test(value))return 'Regarde si un autre nombre suit cent : dans ce cas, il ne prend pas de s.';if(/vingts-/.test(value))return 'Quand un autre nombre suit quatre-vingt, vingt ne prend pas de s.';if(value.includes(' '))return 'Relie les éléments du nombre composé avec des traits d’union.';}
 return q.hint||'Relis le rappel de la leçon et essaie à nouveau.';
}
function check(i){const item=sessions[current][i];if(item.q.type==='self')return;
 if(empty(item)){item.message=item.q.type==='order'?'Place tous les mots avant de vérifier.':'Complète la réponse avant de vérifier.';item.tone='pending';item.result=null;}
 else if(isCorrect(item.q,item.answer)){item.result=true;item.message='✓ Bravo ! '+item.q.explanation;item.tone='good';}
 else{item.result=false;item.errors++;item.message='↻ À revoir. '+(item.q.type==='map'?`Tu as choisi ${window.RevisionMaps.regionName(item.answer)}. `:'')+(item.errors===1?errorHint(item):item.q.explanation+' Tu peux réessayer.');if(item.q.type==='map'&&item.errors>=2){const target=window.RevisionMaps.data.regions[item.q.answer];item.message+=` Sur la carte : zone ${target.zone} (${target.label}), indiquée par un contour en pointillés.`;}item.tone='bad';}
 syncFeedback(i);update();$('#summary').hidden=true;
}
function summary(){const rows=bank.exercises.map((ex,i)=>{const s=stats(i);const selfReview=sessions[i].some(it=>it.q.type==='self'&&it.result!=='yes');const done=s.correct===s.auto&&s.checked===sessions[i].length&&!selfReview;const review=sessions[i].map((it,j)=>it.result===true||it.result==='yes'?null:j+1).filter(Boolean);return `<li><span class="${done?'mastered':'review'}">${done?'✓ Maîtrisé':'↻ À travailler'}</span><h3>${esc(ex.title)}</h3><p>${s.correct} / ${s.auto} réponses correctes${s.self?` · ${s.understood} réponse(s) rédigée(s) comprise(s) selon ton autoévaluation`:''}.</p>${review.length?`<p>Questions à faire ou à revoir : ${review.join(', ')}.</p>`:''}<button class="secondary" data-exercise="${i}">Reprendre cet exercice</button></li>`;}).join('');setHTML($('#summary'),`<p class="eyebrow">BILAN DE LA LEÇON</p><h2 id="summary-title">Ce que je maîtrise, ce que je revois</h2><p>Le bilan porte sur tes séries actuelles. Une réponse modifiée doit être vérifiée à nouveau. Les réponses rédigées sont autoévaluées et restent hors du score automatique.</p><ul class="summary-list">${rows}</ul><button class="secondary" id="new-lesson">${bank.exercises.length===6?'Six':bank.exercises.length} nouvelles séries</button>`);$('#summary').hidden=false;$('#summary').focus();}
function handleInput(event){const e=event.target;if(e.dataset.answer===undefined)return;const i=Number(e.dataset.answer),item=sessions[current][i];if(e.dataset.sub!==undefined){const sub=Number(e.dataset.sub);if(item.answer[sub]===e.value)return;item.answer[sub]=e.value;}else{if(item.answer===e.value)return;item.answer=e.value;}
 invalidate(i);if(item.q.type==='self')e.closest('article').querySelector('.model')?.remove();
}
if(!passive){
$('#exercise').addEventListener('input',handleInput);$('#exercise').addEventListener('change',handleInput);
$('#exercise').addEventListener('change',event=>{const e=event.target;if(e.dataset.rubric!==undefined){const it=sessions[current][Number(e.dataset.rubric)],j=Number(e.dataset.index);it.rubric=e.checked?[...it.rubric,j]:it.rubric.filter(x=>x!==j);}});
root.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;const d=b.dataset,id=prefix&&b.id.startsWith(prefix)?b.id.slice(prefix.length):b.id;
 if(d.exercise!==undefined){current=Number(d.exercise);render(true);}
 else if(d.check!==undefined)check(Number(d.check));
 else if(d.retry!==undefined){const i=Number(d.retry),it=sessions[current][i];it.answer=types[it.q.type]?.fresh?types[it.q.type].fresh(it.q):it.q.type==='decompose'?it.q.parts.map(()=>''):it.q.type==='order'?[]:'';it.result=null;it.message='';it.tone='';it.revealed=false;it.rubric=[];render();$(`#answer-${i},#question-${i} button,#part-${i}-0`)?.focus();}
 else if(d.token!==undefined){const i=Number(d.token),it=sessions[current][i];it.answer=d.index;invalidate(i);$(`#question-${i}`).querySelectorAll('[data-token]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.index===d.index)));}
 else if(d.place!==undefined||d.remove!==undefined){const i=Number(d.place??d.remove),it=sessions[current][i];if(d.place!==undefined)it.answer.push(Number(d.index));else it.answer.splice(Number(d.position),1);invalidate(i);const scroll=window.scrollY;render();window.scrollTo(0,scroll);$(`#question-${i} [data-place]:not(:disabled),#question-${i} [data-remove]`)?.focus();}
 else if(d.reveal!==undefined){const i=Number(d.reveal),it=sessions[current][i];if(!it.answer.trim()){it.message='Rédige d’abord ta réponse avec tes mots.';it.tone='pending';syncFeedback(i);}else{it.revealed=true;render();$(`#question-${i} .model`).scrollIntoView({block:'nearest'});}}
 else if(d.assess!==undefined){const i=Number(d.assess),it=sessions[current][i];it.result=d.value;it.message=d.value==='yes'?'✓ Tu estimes avoir compris ces éléments.':'↻ Revois les éléments attendus et la leçon.';it.tone=d.value==='yes'?'good':'pending';syncFeedback(i);$(`#question-${i}`).querySelectorAll('[data-assess]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.value===d.value)));update();}
 else if(id==='verify-all')sessions[current].forEach((_,i)=>check(i));
 else if(id==='new-series'){sessions[current]=renew(bank.exercises[current],sessions[current]);render(true);}
 else if(id==='new-lesson'){sessions=sessions.map((s,i)=>renew(bank.exercises[i],s));current=0;render(true);}
 else if(id==='previous'&&current>0){current--;render(true);}
 else if(id==='next'){if(current<bank.exercises.length-1){current++;render(true);}else summary();}
});
$('#exercise').addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.tagName==='INPUT'&&event.target.type==='text'&&event.target.dataset.answer!==undefined){event.preventDefault();check(Number(event.target.dataset.answer));}});
}
async function init(){try{const response=await fetch(bankURL);if(!response.ok)throw Error('Banque indisponible');bank=await response.json();if(bank.exercises.length!==(bank.expectedExercises||6)||bank.exercises.some(e=>e.questions.length<(e.minimumQuestions||30)||e.questions.length<(e.sessionSize||10)))throw Error('Banque incomplète');sessions=bank.exercises.map(fresh);setHTML($('#recap-content'),bank.recap.map(p=>`<p>${formatted(p,bank)}</p>`).join(''));setHTML($('#steps'),bank.exercises.map((e,i)=>`<button class="step secondary" data-exercise="${i}" aria-label="Exercice ${i+1} : ${esc(e.title)}">${i+1}</button>`).join(''));render();}catch(error){setHTML($('#exercise'),'<h2>Chargement de la leçon impossible</h2><p>Actualise la page pour réessayer. Si le problème persiste, retourne au menu de la matière.</p>');$('#previous').disabled=true;$('#next').disabled=true;console.error(error);}}
// API de vérification pure, sans exposer les réponses dans l’interface de l’élève.
const api={shuffle,norm,isCorrect,draw,setMapAnswer:(i,code)=>{const item=sessions[current][i];if(item.q.type!=='map'||!window.RevisionMaps.data[item.q.map].includes(code))return;item.answer=code;invalidate(i);},getState:()=>({bank,current,sessions}),go:index=>{if(!bank||index<0||index>=bank.exercises.length)return;current=index;render(true);},refresh:()=>render(),setAnswer:(i,answer)=>{sessions[current][i].answer=answer;invalidate(i);},root,prefix};
api.ready=bankURL?init():Promise.resolve();
return api;
}
const initial=document.body.dataset.bank?mount():mount({passive:true});
window.RevisionEngine=Object.assign(initial,{mount,registerType:(name,type)=>{types[name]=type;}});
})();


