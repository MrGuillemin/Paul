'use strict';
// Cette page est autonome. Pour une prochaine partie de M4, ajouter son lien
// dans #chapter-parts (index.html), sans changer le moteur des exercices.
const fraction = (n, d) => `<span class="fraction" role="img" aria-label="${n} sur ${d}"><span aria-hidden="true">${n}</span><span aria-hidden="true">${d}</span></span>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shape = (n, d, type = 'rectangle', units = 1) => ({n, d, type, units});
const EXERCISES = [
  {title:'Comprendre les fractions', instruction:'Choisis la bonne réponse.', notion:'Le partage et le sens des deux nombres', review:'Revois le partage en parts égales, le rôle des deux nombres et les lectures « un quart » et « trois demis ».', questions:[
    {type:'choice',prompt:'Une fraction permet de :',options:['Partager un entier en parts égales.','Multiplier toujours un nombre par deux.','Additionner deux nombres.'],answer:'0',hint:'Une fraction décrit un partage. Réfléchis à la taille des parts.',explanation:'Une fraction permet de partager un entier en parts égales.'},
    {type:'choice',prompt:`Dans ${fraction(1,4)}, le nombre 4 indique :`,options:['Le nombre de parts prises.','Le nombre de parts égales dans un entier.','Le nombre d’entiers.'],answer:'1',hint:'Le nombre du bas décrit comment un entier a été partagé.',explanation:'4 est le dénominateur : un entier est partagé en quatre parts égales.'},
    {type:'choice',prompt:`Dans ${fraction(3,2)}, le nombre 3 indique :`,options:['Le nombre de parts prises.','Le nombre de parts dans un entier.','Le nombre de figures dessinées.'],answer:'0',hint:'Le nombre du haut indique ce que l’on prend.',explanation:'3 est le numérateur : on prend trois parts, chacune de la taille d’un demi.'},
    {type:'choice',prompt:`Comment lit-on ${fraction(1,4)} ?`,options:['Un quatrième.','Un quart.','Quatre unités.'],answer:'1',hint:'Le nom donné à une part sur quatre est particulier.',explanation:`${fraction(1,4)} se lit « un quart ».`},
    {type:'choice',prompt:`Comment lit-on ${fraction(3,2)} ?`,options:['Trois demis.','Deux tiers.','Trois quarts.'],answer:'0',hint:'Chaque entier est partagé en deux ; lis ensuite le nombre de parts prises.',explanation:`${fraction(3,2)} se lit « trois demis » : trois parts d’un demi.`}
  ]},
  {title:'Numérateur ou dénominateur ?',instruction:'Pour chaque fraction, écris le numérateur et le dénominateur.',notion:'Le numérateur et le dénominateur',review:'Le numérateur se trouve au-dessus de la barre et le dénominateur en dessous. Ce dernier ne peut jamais être zéro.',questions:[[1,4],[3,2],[2,5],[4,6],[5,3]].map(([n,d])=>({type:'identify',n,d,prompt:'Observe la fraction et complète les deux champs.'}))},
  {title:'Lire les fractions',instruction:'Associe chaque fraction à sa lecture. Les expressions proposées sont mélangées.',notion:'La lecture des fractions',review:'Entraîne-toi à lire les demis, les tiers et les quarts, en tenant compte du nombre de parts prises.',questions:[[1,2,'un demi'],[1,3,'un tiers'],[1,4,'un quart'],[2,3,'deux tiers'],[3,4,'trois quarts'],[3,2,'trois demis']].map(([n,d,answer])=>({type:'reading',n,d,answer,prompt:'Choisis la lecture de la fraction.',hint:'Lis le nombre de parts prises, puis le nom des parts indiqué par le dénominateur.',explanation:`${fraction(n,d)} se lit « ${answer} ».`}))},
  {title:'Reconnaître les fractions coloriées',instruction:'Observe la figure et choisis la fraction coloriée. Chaque figure représente un entier, sauf lorsqu’il y en a deux identiques.',notion:'Passer d’une figure à une fraction',review:'Compte les parts coloriées pour le numérateur, puis les parts égales d’un seul entier pour le dénominateur.',questions:[
    {figure:shape(1,4,'square'),options:[[4,1],[1,4],[3,4]]},
    {figure:shape(1,2),options:[[1,2],[2,1],[1,3]]},
    {figure:shape(2,3),options:[[3,2],[1,3],[2,3]]},
    {figure:shape(3,4,'square'),options:[[1,4],[3,4],[4,3]]},
    {figure:shape(2,5),options:[[2,5],[5,2],[3,5]]},
    {figure:shape(3,2,'rectangle',2),options:[[3,4],[2,3],[3,2]]}
  ].map(q=>({...q,type:'visual',prompt:'Quelle fraction est coloriée ?',answer:`${q.figure.n}/${q.figure.d}`,hint:q.figure.units===2?'Chaque rectangle est un entier. Le dénominateur décrit un seul rectangle, pas les deux réunis.':'Compte d’abord les parts égales d’un entier, puis celles qui sont coloriées.',explanation:`Il y a ${q.figure.n} parts coloriées, et un entier est partagé en ${q.figure.d} parts égales : ${fraction(q.figure.n,q.figure.d)}.${q.figure.units===2?' Trois demis forment un entier et un demi.':''}`}))},
  {title:'Colorier une fraction',instruction:'Clique sur les parties pour les colorier ou les décolorier, puis vérifie. Au clavier, utilise Tab, puis Entrée ou Espace.',notion:'Représenter une fraction',review:'Le dénominateur donne le nombre de parts d’un entier ; le numérateur donne le nombre de parts à colorier. Trois demis utilisent deux entiers identiques.',questions:[shape(1,4,'square'),shape(2,3),shape(3,4,'square'),shape(2,5),shape(3,2,'rectangle',2)].map(figure=>({type:'color',figure,prompt:`Colorie ${fraction(figure.n,figure.d)}${figure.units===2?' à l’aide de deux rectangles identiques.':figure.type==='square'?' du carré.':' du rectangle.'}`,hint:'Le nombre du haut indique combien de parts colorier. Tu peux cliquer à nouveau pour décolorier une part.',explanation:`Il faut colorier ${figure.n} parts parmi les parts disponibles. Chaque entier est partagé en ${figure.d} parts égales.${figure.units===2?' Trois demi-rectangles représentent un entier et un demi.':''}`}))},
  {title:'Bilan : maîtrise des fractions',instruction:'Réponds aux questions pour vérifier que tu as compris la leçon.',notion:'Les notions réunies dans le bilan',review:'Reprends les questions du bilan signalées « à revoir », puis utilise le rappel de la leçon et les exercices précédents.',questions:[
    {type:'number',prompt:`Dans ${fraction(3,4)}, quel est le numérateur ?`,answer:3,hint:'Le numérateur se trouve au-dessus de la barre.',explanation:'Le numérateur est 3 : il indique le nombre de parts prises.'},
    {type:'number',prompt:`Dans ${fraction(3,4)}, quel est le dénominateur ?`,answer:4,hint:'Le dénominateur se trouve en dessous de la barre.',explanation:'Le dénominateur est 4 : un entier est partagé en quatre parts égales.'},
    {type:'number',prompt:'Combien de quarts faut-il pour former un entier ?',answer:4,hint:'Imagine un entier partagé en quarts et compte toutes ses parts.',explanation:'Il faut quatre quarts pour former un entier.'},
    {type:'number',prompt:'Combien de demis faut-il pour former un entier ?',answer:2,hint:'Un demi est une part lorsque l’entier est partagé en deux parts égales.',explanation:'Il faut deux demis pour former un entier.'},
    {type:'choice',prompt:`Que représente ${fraction(3,2)} ?`,options:['Trois entiers partagés en deux.','Trois morceaux d’un demi, soit un entier et demi.','Deux morceaux d’un tiers.'],answer:'1',hint:'Le dénominateur donne la taille des morceaux et le numérateur leur nombre.',explanation:'Trois demis sont trois morceaux d’un demi, soit un entier et demi.'},
    {type:'fraction',prompt:'Un gâteau est partagé en 4 parts égales. Tu prends 3 parts. Quelle fraction du gâteau as-tu prise ?',answer:[3,4],hint:'Place les parts prises en haut et les parts égales d’un entier en bas.',explanation:`Tu as pris trois parts sur les quatre parts égales du gâteau : ${fraction(3,4)}.`},
    {type:'fraction',prompt:'Une pizza est partagée en 2 parts égales. Tu prends 3 parts de cette taille, en utilisant deux pizzas identiques. Quelle fraction d’une pizza cela représente-t-il ?',answer:[3,2],hint:'Pour le nombre du bas, compte les parts égales d’une seule pizza.',explanation:`Tu prends trois demis : ${fraction(3,2)}. Chaque pizza est partagée en deux, même s’il faut utiliser deux pizzas.`}
  ]}
];
const READING_OPTIONS = ['trois quarts','un tiers','trois demis','un demi','deux tiers','un quart'];
const unitsFor = q => q.type === 'identify' ? 2 : 1;
const freshQuestion = q => ({answers:Array(q.type==='identify'||q.type==='fraction'?2:1).fill(''),selected:[],results:Array(unitsFor(q)).fill(null),errors:Array(unitsFor(q)).fill(0),messages:Array(unitsFor(q)).fill(''),tones:Array(unitsFor(q)).fill('')});
const state = EXERCISES.map(ex=>ex.questions.map(freshQuestion));
const TOTAL = EXERCISES.reduce((sum,ex)=>sum+ex.questions.reduce((s,q)=>s+unitsFor(q),0),0);
let current = 0;
const $ = selector => document.querySelector(selector);
const scoreFor = index => state[index].flatMap(q=>q.results).filter(r=>r===true).length;
const sizeFor = index => EXERCISES[index].questions.reduce((sum,q)=>sum+unitsFor(q),0);
const verifiedFor = index => state[index].flatMap(q=>q.results).filter(r=>r!==null).length;
const integer = text => /^\d+$/.test(String(text).trim()) ? Number(String(text).trim()) : NaN;
function updateProgress(){
  const score = state.reduce((sum,_,i)=>sum+scoreFor(i),0);
  const checked = state.reduce((sum,_,i)=>sum+verifiedFor(i),0);
  $('#position').textContent=`Exercice ${current+1} sur ${EXERCISES.length}`;
  $('#total').textContent=`${score} / ${TOTAL} réponses correctes`;
  $('#progress').value=checked;$('#progress').max=TOTAL;
  $('#progress-text').textContent=`${checked} / ${TOTAL} réponses vérifiées · Le score compte les réponses correctes, pas les tentatives.`;
  $('#steps').innerHTML=EXERCISES.map((ex,i)=>`<button class="step" data-step="${i}" ${i===current?'aria-current="step"':''} aria-label="Exercice ${i+1} : ${ex.title}${scoreFor(i)===sizeFor(i)?', maîtrisé':''}">${i+1}${scoreFor(i)===sizeFor(i)?' ✓':''}</button>`).join('');
  const local=$('#exercise-score');if(local)local.textContent=`${scoreFor(current)} / ${sizeFor(current)} réponses correctes dans cet exercice`;
}
function feedbackMarkup(i,sub=0){const s=state[current][i];return `<p id="feedback-${i}-${sub}" class="feedback ${s.tones[sub]}" aria-live="polite" aria-atomic="true">${s.messages[sub]}</p>`;}
function clearResult(i,sub=0){
  const s=state[current][i];s.results[sub]=null;s.messages[sub]='';s.tones[sub]='';
  const p=$(`#feedback-${i}-${sub}`);if(p){p.textContent='';p.className='feedback';}
  $('#summary').hidden=true;updateProgress();
}
function inputMarkup(i,sub,label){return `<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" id="answer-${i}-${sub}" data-answer="${i}" data-sub="${sub}" aria-label="Question ${i+1}, ${label}" value="${esc(state[current][i].answers[sub])}">`;}
function figureMarkup(config,selected,interactive=false,questionIndex=0){
  const {d,type,units}=config;
  const unitWidth=type==='square'?156:units===2?144:300;
  const unitHeight=type==='square'?156:108;
  const gap=24;const width=unitWidth*units+gap*(units-1);const height=unitHeight+30;
  const svgLabel=`${units===2?'Deux rectangles identiques':type==='square'?'Un carré':'Un rectangle'}, ${d} parts égales par entier${interactive?'. Sélectionne les parts à colorier.':'. Les parts coloriées portent une coche.'}`;
  const parts=[];
  for(let u=0;u<units;u++){
    for(let part=0;part<d;part++){
      const index=u*d+part;const on=selected.includes(index);
      const cellWidth=type==='square'?unitWidth/2:unitWidth/d;
      const cellHeight=type==='square'?unitHeight/2:unitHeight;
      const x=u*(unitWidth+gap)+(type==='square'?(part%2)*cellWidth:part*cellWidth);
      const y=type==='square'?Math.floor(part/2)*cellHeight:0;
      const label=`Entier ${u+1}, part ${part+1} sur ${d}, ${on?'coloriée':'non coloriée'}`;
      parts.push(`<g class="part-group${on?' selected':''}" ${interactive?`role="button" tabindex="0" aria-pressed="${on}" aria-label="${label}" data-part="${index}" data-question="${questionIndex}"`:`aria-label="${label}"`}><rect class="part-rect" x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}"/><text class="part-text" x="${x+cellWidth/2}" y="${y+cellHeight/2}" text-anchor="middle" dominant-baseline="central" aria-hidden="true">${on?'✓':index+1}</text></g>`);
    }
    parts.push(`<text class="unit-caption" x="${u*(unitWidth+gap)+unitWidth/2}" y="${unitHeight+22}" text-anchor="middle">${units===2?`Entier ${u+1}`:'Un entier'}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fraction-figure ${type==='square'?'square':''} ${interactive?'interactive':''}" viewBox="-4 -4 ${width+8} ${height+8}" role="${interactive?'group':'img'}" aria-label="${svgLabel}${interactive?'':` ${selected.length} parts coloriées au total.`}">${parts.join('')}</svg>`;
}
function renderQuestion(q,i){
  const s=state[current][i];let body='';
  if(q.type==='choice'||q.type==='visual'){
    const choices=q.options.map((option,j)=>{const value=q.type==='visual'?option.join('/'):String(j);const label=q.type==='visual'?fraction(...option):option;return `<label class="choice"><input type="radio" name="q${i}" data-answer="${i}" data-sub="0" value="${value}" ${s.answers[0]===value?'checked':''}>${label}</label>`;}).join('');
    body=`<fieldset><legend>${i+1}. ${q.prompt}</legend>${q.type==='visual'?`<div class="figure-wrap">${figureMarkup(q.figure,Array.from({length:q.figure.n},(_,index)=>index))}</div>`:''}<div class="choices ${q.type==='visual'?'visual-choices':''}">${choices}</div></fieldset>${feedbackMarkup(i)}`;
  }else if(q.type==='identify'){
    body=`<h3>${i+1}. ${q.prompt}</h3><div class="identify-row">${fraction(q.n,q.d)}<div class="identify-fields">${['Numérateur','Dénominateur'].map((label,sub)=>`<div class="field"><label for="answer-${i}-${sub}">${label}</label>${inputMarkup(i,sub,label)}${feedbackMarkup(i,sub)}</div>`).join('')}</div></div>`;
  }else if(q.type==='reading'){
    body=`<h3>${i+1}. ${q.prompt}</h3><div class="matching">${fraction(q.n,q.d)}<div><label class="reading-label" for="reading-${i}">Lecture de la fraction ${q.n} sur ${q.d}</label><select id="reading-${i}" data-answer="${i}" data-sub="0"><option value="">Choisir une expression</option>${READING_OPTIONS.map(o=>`<option value="${o}" ${s.answers[0]===o?'selected':''}>${o}</option>`).join('')}</select></div></div>${feedbackMarkup(i)}`;
  }else if(q.type==='color'){
    body=`<h3>${i+1}. ${q.prompt}</h3><div id="figure-${i}" class="figure-wrap">${figureMarkup(q.figure,s.selected,true,i)}</div><p class="color-counter" id="colored-${i}" aria-live="polite">${s.selected.length} partie${s.selected.length>1?'s':''} coloriée${s.selected.length>1?'s':''}</p><p class="figure-hint">Une coche indique une partie coloriée. Clique à nouveau pour l’effacer.${q.figure.units===2?' Chaque rectangle représente un entier.':''}</p>${feedbackMarkup(i)}`;
  }else{
    body=`<h3 id="prompt-${i}">${i+1}. ${q.prompt}</h3>${q.type==='fraction'?`<p class="muted">Complète les deux cases de la fraction.</p><div class="fraction-input" role="group" aria-labelledby="prompt-${i}">${inputMarkup(i,0,'numérateur')}${inputMarkup(i,1,'dénominateur')}</div>`:`<div class="number-entry"><label for="answer-${i}-0">Ta réponse</label>${inputMarkup(i,0,'nombre attendu')}</div>`}${feedbackMarkup(i)}`;
  }
  return `<article class="question" id="question-${i}">${body}<div class="question-actions"><button class="secondary" data-check="${i}">Vérifier${q.type==='identify'?' ces réponses':''}</button>${q.type==='color'?`<button class="secondary" data-clear="${i}">Effacer</button>`:''}</div></article>`;
}
function render(focus=false){
  const ex=EXERCISES[current];$('#summary').hidden=true;
  $('#exercise').innerHTML=`<p class="eyebrow">EXERCICE ${current+1} / ${EXERCISES.length}</p><h2 id="exercise-title">${ex.title}</h2><p class="instruction">${ex.instruction}</p>${ex.questions.map(renderQuestion).join('')}<p id="exercise-score" class="exercise-score" aria-live="polite"></p><div class="actions"><button id="check-all">Vérifier tout l’exercice</button><button id="restart" class="secondary">Recommencer l’exercice</button></div>`;
  $('#previous').disabled=current===0;$('#next').textContent=current===EXERCISES.length-1?'Voir mon bilan →':'Suivant →';
  updateProgress();if(focus)$('#exercise').focus();
}
function evaluate(q,s){
  if(q.type==='identify')return s.answers.map((a,sub)=>a.trim()===''?null:integer(a)===(sub===0?q.n:q.d));
  if(q.type==='color')return [s.selected.length===0?null:s.selected.length===q.figure.n];
  if(q.type==='fraction')return [s.answers.some(a=>a.trim()==='')?null:integer(s.answers[0])===q.answer[0]&&integer(s.answers[1])===q.answer[1]];
  if(s.answers[0].trim()==='')return [null];
  if(q.type==='number')return [integer(s.answers[0])===q.answer];
  return [s.answers[0]===q.answer];
}
function explanation(q,sub){
  if(q.type==='identify')return `Le numérateur est au-dessus de la barre : ${q.n}. Le dénominateur est en dessous : ${q.d}.`;
  return q.explanation;
}
function hint(q,sub){
  if(q.type==='identify')return sub===0?'Regarde le nombre situé au-dessus de la barre.':'Regarde le nombre situé en dessous de la barre.';
  return q.hint;
}
function checkQuestion(i){
  const q=EXERCISES[current].questions[i];const s=state[current][i];const result=evaluate(q,s);
  result.forEach((ok,sub)=>{
    s.results[sub]=ok;
    if(ok===null){s.messages[sub]=q.type==='color'?'Choisis d’abord les parties à colorier, puis vérifie.':q.type==='fraction'?'Complète les deux cases avant de vérifier.':'Choisis ou écris une réponse avant de vérifier.';s.tones[sub]='pending';}
    else if(ok){s.messages[sub]='✓ Bravo, c’est correct ! '+explanation(q,sub);s.tones[sub]='good';}
    else{s.errors[sub]++;s.messages[sub]='↻ À revoir. '+(s.errors[sub]===1?hint(q,sub):explanation(q,sub)+' Modifie ta réponse, puis vérifie à nouveau.');s.tones[sub]='bad';}
    const p=$(`#feedback-${i}-${sub}`);p.className=`feedback ${s.tones[sub]}`;p.innerHTML=s.messages[sub];
  });
  $('#summary').hidden=true;updateProgress();
}
function togglePart(i,part){
  const s=state[current][i];const found=s.selected.indexOf(part);if(found<0)s.selected.push(part);else s.selected.splice(found,1);
  clearResult(i);$('#figure-'+i).innerHTML=figureMarkup(EXERCISES[current].questions[i].figure,s.selected,true,i);
  const count=$('#colored-'+i);count.textContent=`${s.selected.length} partie${s.selected.length>1?'s':''} coloriée${s.selected.length>1?'s':''}`;
  $(`[data-question="${i}"][data-part="${part}"]`).focus();
}
function showSummary(){
  const score=state.reduce((sum,_,i)=>sum+scoreFor(i),0);
  const cards=EXERCISES.map((ex,i)=>{
    const correct=scoreFor(i);const total=sizeFor(i);const mastered=correct===total;
    const remaining=ex.questions.map((q,j)=>state[i][j].results.every(r=>r===true)?null:j+1).filter(Boolean);
    return `<li><span class="status ${mastered?'mastered':'review'}">${mastered?'✓ MAÎTRISÉ':'↻ À RETRAVAILLER'}</span><h3>${ex.notion}</h3><p><strong>${correct} / ${total} réponses correctes.</strong> ${mastered?'Toutes tes réponses vérifiées sont correctes.':ex.review}</p>${remaining.length?`<p>Questions à faire ou à revoir : ${remaining.join(', ')}.</p>`:''}<button class="secondary" data-step="${i}">${mastered?'Reprendre':'Retravailler'} l’exercice ${i+1}</button></li>`;
  }).join('');
  $('#summary').innerHTML=`<p class="eyebrow">LE POINT SUR TES RÉVISIONS</p><h2 id="summary-title">Mon bilan des fractions</h2><p class="summary-score">${score} / ${TOTAL}</p><p>Ce bilan compte tes dernières réponses correctes vérifiées. Les réponses modifiées doivent être vérifiées à nouveau. Les questions non faites restent à travailler.</p><ul class="summary-list">${cards}</ul><button class="secondary" id="restart-all">Tout recommencer</button>`;
  $('#summary').hidden=false;$('#summary').focus();
}
function handleAnswer(event){
  const target=event.target;if(target.dataset.answer===undefined)return;
  const i=Number(target.dataset.answer);const sub=Number(target.dataset.sub);
  // Certains champs emettent input, puis change a la perte du focus.
  // Ne pas reconstruire la navigation si la valeur a deja ete enregistree.
  if(state[current][i].answers[sub]===target.value)return;
  state[current][i].answers[sub]=target.value;
  clearResult(i,EXERCISES[current].questions[i].type==='identify'?sub:0);
}
$('#exercise').addEventListener('input',handleAnswer);
$('#exercise').addEventListener('change',handleAnswer);
document.addEventListener('click',event=>{
  const part=event.target.closest('[data-part]');if(part){togglePart(Number(part.dataset.question),Number(part.dataset.part));return;}
  const button=event.target.closest('button');if(!button)return;const data=button.dataset;
  if(data.step!==undefined){current=Number(data.step);render(true);}
  else if(data.check!==undefined)checkQuestion(Number(data.check));
  else if(data.clear!==undefined){const i=Number(data.clear);state[current][i]=freshQuestion(EXERCISES[current].questions[i]);render();$(`[data-clear="${i}"]`).focus();}
  else if(button.id==='check-all')EXERCISES[current].questions.forEach((_,i)=>checkQuestion(i));
  else if(button.id==='restart'){state[current]=EXERCISES[current].questions.map(freshQuestion);render(true);}
  else if(button.id==='restart-all'){EXERCISES.forEach((ex,i)=>state[i]=ex.questions.map(freshQuestion));current=0;render(true);}
  else if(button.id==='previous'&&current>0){current--;render(true);}
  else if(button.id==='next'){if(current<EXERCISES.length-1){current++;render(true);}else showSummary();}
});
$('#exercise').addEventListener('keydown',event=>{
  const part=event.target.closest('[data-part]');if(part&&(event.key===' '||event.key==='Enter')){event.preventDefault();togglePart(Number(part.dataset.question),Number(part.dataset.part));}
  else if(event.key==='Enter'&&event.target.dataset.answer!==undefined&&event.target.tagName==='INPUT'){event.preventDefault();checkQuestion(Number(event.target.dataset.answer));}
});
render();
