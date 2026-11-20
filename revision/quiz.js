'use strict';
(() => {
 const config=JSON.parse(document.getElementById('quiz-data').textContent);
 const $=id=>document.getElementById(id);
 let exercise=0,deck=[],position=0,score=0,errors=0,locked=false,history=[];
 const previous=new Map();
 function start(index){
  exercise=index;const pool=config.pools[index];
  if(!pool?.length)return;
  const old=previous.get(index)||[];deck=shuffle(pool).slice(0,10);
  if(pool.length>deck.length&&deck.every(q=>old.includes(q))){deck[deck.length-1]=shuffle(pool.filter(q=>!old.includes(q)))[0];}
  previous.set(index,deck);position=0;score=0;history=[];
  $('menu').classList.add('hidden');$('result').classList.add('hidden');$('game').classList.remove('hidden');
  $('ln').textContent=`Exercice ${index+1} · ${config.titles[index]}`;show();
 }
 function show(){
  errors=0;locked=false;const q=deck[position];
  $('count').textContent=`Question ${position+1} sur ${deck.length}`;
  $('quiz-score').textContent=`${score} / ${deck.length} réponses correctes`;
  const progress=document.querySelector('#game [role="progressbar"]');progress.setAttribute('aria-valuemax',deck.length);progress.setAttribute('aria-valuenow',position);
  $('bar').style.width=`${position/deck.length*100}%`;
  $('question').textContent=q.q;$('fb').className='feedback hidden';$('fb').textContent='';$('nextBtn').classList.add('hidden');$('opts').replaceChildren();
  for(const value of shuffle([...new Set(q.o)])){
   const b=document.createElement('button');b.className='option';b.textContent=value;b.addEventListener('click',()=>check(value,b));$('opts').appendChild(b);
  }
  $('question').focus();
 }
 function check(answer,button){
  if(locked||button.disabled)return;const q=deck[position],correct=answer===q.a;
  errors++;$('fb').className='feedback '+(correct?'good':'bad');
  if(!correct&&errors===1){
   $('fb').textContent='↻ À revoir. '+(q.h||'Relis attentivement la question et compare les autres propositions. Tu peux faire un deuxième essai.');
   button.disabled=true;$('opts').querySelector('button:not(:disabled)')?.focus();return;
  }
  locked=true;if(correct)score++;
  $('fb').textContent=(correct?'✓ Bonne réponse. ':'↻ La réponse attendue est : '+q.a+'. ')+q.e;
  for(const b of $('opts').children)b.disabled=true;
  history.push({question:q.q,correct,answer:q.a});
  $('quiz-score').textContent=`${score} / ${deck.length} réponses correctes`;
  $('bar').style.width=`${(position+1)/deck.length*100}%`;
  document.querySelector('#game [role="progressbar"]').setAttribute('aria-valuenow',position+1);
  $('nextBtn').textContent=position===deck.length-1?'Voir le bilan →':'Suivant →';$('nextBtn').classList.remove('hidden');
 }
 function next(){if(!locked)return;if(++position<deck.length){show();return;}
  $('game').classList.add('hidden');$('result').classList.remove('hidden');renderResult(score,deck.length);
  $('quiz-review').replaceChildren();for(const h of history.filter(h=>!h.correct)){const li=document.createElement('li');li.textContent=h.question+' — '+h.answer;$('quiz-review').appendChild(li);}
  if(!history.some(h=>!h.correct))$('resultText').textContent+=' Toutes les réponses de cette série sont correctes.';
  saveBest('quiz-v3-'+config.key+'-'+exercise,Math.round(score/deck.length*100));$('result').focus();
 }
 function home(){$('game').classList.add('hidden');$('result').classList.add('hidden');$('menu').classList.remove('hidden');$('menu').querySelector('button')?.focus();}
 window.start=start;window.home=home;window.nextQ=next;window.replay=()=>start(exercise);
 window.LegacyQuiz={getState:()=>({config,exercise,deck,position,score,errors,locked,history})};
})();
