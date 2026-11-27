'use strict';
(() => {
 const shell=document.querySelector('[data-extension-bank]');if(!shell)return;
 const panel=shell.querySelector('.extension-panel'),legacy=document.querySelector('.legacy-training'),status=shell.querySelector('[data-extension-status]');let api,loading;
 function original(){panel.hidden=true;legacy.hidden=false;history.replaceState(null,'','#exercise');status.textContent='Les exercices déjà présents sont affichés.';legacy.querySelector('h2,button')?.focus();}
 async function open(index,button){
  status.textContent='Chargement de la série…';if(button)button.disabled=true;
  try{
   if(!api){if(!loading){api=window.RevisionEngine.mount({root:panel,prefix:'ext-',bankURL:shell.dataset.extensionBank});loading=api.ready;}}
   await loading;
   if(!api.getState().bank)throw Error('Banque indisponible');legacy.hidden=true;panel.hidden=false;api.go(index);status.textContent='';
   if(button?.id)history.replaceState(null,'','#'+button.id);panel.querySelector('h2')?.scrollIntoView({block:'start'});
  }catch(e){status.textContent='Impossible de charger les nouvelles activités. Réessaie ; les anciens exercices restent disponibles.';console.error(e);original();}finally{if(button)button.disabled=false;}
 }
 shell.querySelectorAll('[data-extension-open]').forEach(button=>button.addEventListener('click',()=>open(Number(button.dataset.extensionOpen),button)));
 shell.querySelectorAll('[data-extension-original]').forEach(button=>button.addEventListener('click',original));
 // Ce panneau a son propre moteur : ses commandes ne doivent pas atteindre les anciens scripts.
 panel.addEventListener('click',event=>{
  event.stopPropagation();const button=event.target.closest('button');if(!button||!api)return;
  if(button.hasAttribute('data-extension-original')){original();return;}
  const d=button.dataset;if(!d.extensionAction)return;const i=Number(d.question),item=api.getState().sessions[api.getState().current][i];
  if(d.extensionAction==='zoom'){const grid=button.parentElement.querySelector('.ext-grid');const active=grid.classList.toggle('is-zoomed');button.textContent=active?'Réduire la grille':'Agrandir la grille';button.setAttribute('aria-pressed',String(active));return;}
  if(d.extensionAction==='multi'||d.extensionAction==='single'){
   const value=item.options[Number(d.option)],answer=d.extensionAction==='multi'?(item.answer.includes(value)?item.answer.filter(v=>v!==value):[...item.answer,value]):value;
   api.setAnswer(i,answer);button.closest('.ext-options').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(d.extensionAction==='multi'?answer.includes(item.options[Number(b.dataset.option)]):answer===item.options[Number(b.dataset.option)])));return;
  }
  if(d.extensionAction==='cell'){
   const n=Number(d.cell),answer=item.answer.includes(n)?item.answer.filter(v=>v!==n):[...item.answer,n];api.setAnswer(i,answer);button.classList.toggle('is-filled',answer.includes(n));button.setAttribute('aria-pressed',String(answer.includes(n)));button.textContent=answer.includes(n)?'✓':'';
   const article=button.closest('article');article.querySelector('[data-extension-count]').value=answer.length;article.querySelector('[data-extension-count-label]').textContent=`${answer.length} / ${item.q.visual.total} cases coloriées`;return;
  }
  if(d.extensionAction==='rank'){api.setAnswer(i,d.rank);button.closest('.ext-rank-row').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}
 });
 panel.addEventListener('input',event=>{
  const input=event.target;if(!input.hasAttribute('data-extension-count')||!api)return;
  const i=Number(input.dataset.extensionCount),item=api.getState().sessions[api.getState().current][i];
  if(!/^\d+$/.test(input.value)||Number(input.value)>item.q.visual.total){input.setCustomValidity(`Entre un nombre entier entre 0 et ${item.q.visual.total}.`);api.setAnswer(i,[]);input.closest('article').querySelector('[data-extension-count-label]').textContent=`Entre un entier entre 0 et ${item.q.visual.total}.`;return;}
  input.setCustomValidity('');const count=Number(input.value),answer=Array.from({length:count},(_,n)=>n);api.setAnswer(i,answer);const article=input.closest('article');article.querySelectorAll('[data-cell]').forEach(b=>{const filled=Number(b.dataset.cell)<count;b.classList.toggle('is-filled',filled);b.setAttribute('aria-pressed',String(filled));b.textContent=filled?'✓':'';});article.querySelector('[data-extension-count-label]').textContent=`${count} / ${item.q.visual.total} cases coloriées`;
 });
 panel.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.hasAttribute('data-extension-count')){event.preventDefault();event.target.closest('article').querySelector('[data-check]')?.click();}});
 function hash(){const group=[...shell.querySelectorAll('details')].find(d=>'#'+d.id===location.hash);if(group)group.open=true;const button=[...shell.querySelectorAll('[data-extension-open]')].find(b=>'#'+b.id===location.hash);if(button){button.closest('details').open=true;open(Number(button.dataset.extensionOpen),button);}}
 window.addEventListener('hashchange',hash);hash();
 window.RevisionExtensionController={open,original,getAPI:()=>api};
})();
