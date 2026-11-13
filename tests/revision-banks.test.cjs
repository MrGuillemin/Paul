const test=require('node:test');const assert=require('node:assert/strict');const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');const paths=['Histoire/Lecon-2/Revolution-des-transports','francais/F1-Groupe-nominal','francais/F2-Determinants','francais/F3-Nombres-en-lettres'];
const lessons=paths.map(p=>JSON.parse(fs.readFileSync(path.join(root,p,'questions.json'),'utf8')));
const element={addEventListener(){}};const document={addEventListener(){},querySelector:()=>element,body:{dataset:{bank:'unused'}}};
const context={document,fetch:()=>new Promise(()=>{}),console};context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'revision/engine.js'),'utf8'),context);
const api=context.RevisionEngine;
function permutation(q,phrase=q.answer){const unused=q.words.map((_,i)=>i);return phrase.split(' ').map(w=>{const n=unused.findIndex(i=>q.words[i]===w);assert.ok(n>=0,`Word absent: ${w}`);return unused.splice(n,1)[0];});}
test('24 banques de 30 entrées distinctes ; 720 identifiants uniques',()=>{
 const ids=[];assert.equal(lessons.length,4);
 for(const l of lessons){assert.equal(l.exercises.length,6);for(const ex of l.exercises){assert.equal(ex.questions.length,30);const fingerprints=new Set();for(const q of ex.questions){ids.push(q.id);assert.ok(q.prompt);assert.ok(q.type==='self'?q.model:q.explanation);const fp=JSON.stringify([q.type,q.prompt,q.context,q.words,q.parts,q.options]);assert.ok(!fingerprints.has(fp),`Duplicate ${q.id}`);fingerprints.add(fp);if(q.options){assert.equal(new Set(q.options).size,q.options.length,`Options duplicated: ${q.id}`);if(!['decompose','self'].includes(q.type))assert.ok(q.options.includes(q.answer),`Correct option absent: ${q.id}`);}}}}
 assert.equal(ids.length,720);assert.equal(new Set(ids).size,720);
});
test('Toutes les réponses attendues et toutes les variantes déclarées sont acceptées',()=>{
 for(const l of lessons)for(const ex of l.exercises)for(const q of ex.questions){if(q.type==='self'){assert.ok(q.criteria.length>=2);continue;}let answer=q.type==='decompose'?q.answers:q.type==='order'?permutation(q):q.answer;assert.equal(api.isCorrect(q,answer),true,q.id);for(const a of q.aliases||[])assert.equal(api.isCorrect(q,q.type==='order'?permutation(q,a):a),true,q.id+' alias');}
});
test('Les distracteurs et les décompositions incorrectes sont refusés',()=>{
 for(const l of lessons)for(const ex of l.exercises)for(const q of ex.questions){
 if(q.options&&q.type!=='decompose')for(const o of q.options.filter(o=>o!==q.answer))assert.equal(api.isCorrect(q,o),false,q.id+' distractor');
 if(q.type==='decompose'){assert.equal(api.isCorrect(q,[]),false);q.answers.forEach((_,i)=>{const wrong=[...q.answers];wrong[i]=q.options.find(o=>o!==q.answers[i]);assert.equal(api.isCorrect(q,wrong),false,q.id);});}
 if(q.type==='tokens')q.words.forEach((_,i)=>{if(i!==q.answer)assert.equal(api.isCorrect(q,i),false,q.id);});
 if(q.type==='order'){assert.equal(api.isCorrect(q,[]),false);assert.equal(api.isCorrect(q,Array(q.words.length).fill(0)),false);}
 }
});
test('Chaque série a dix questions sans doublon ; les questions et choix sont réellement mélangés',()=>{
 for(const l of lessons)for(const ex of l.exercises){let old=[];const seen=new Set(),firsts=new Set();const optionOrders=new Set();for(let n=0;n<120;n++){const next=api.draw(ex.questions,old);assert.equal(next.length,10);assert.equal(new Set(next.map(i=>i.q.id)).size,10);if(old.length)assert.ok(next.some(i=>!old.some(o=>o.q.id===i.q.id)));next.forEach(i=>{seen.add(i.q.id);if(i.options.length>1)optionOrders.add(JSON.stringify(i.options));});firsts.add(next[0].q.id);old=next;}assert.equal(seen.size,30);assert.ok(firsts.size>10);if(ex.questions.some(q=>q.options?.length>1))assert.ok(optionOrders.size>1);}
});
test('Dates historiques, données du réseau et répartition du bilan',()=>{
 const h=lessons[0];const counts={};h.exercises[5].questions.forEach(q=>counts[q.tag]=(counts[q.tag]||0)+1);assert.deepEqual(counts,{inventions:8,vocabulaire:6,avantages:6,economie:5,reseau:5});
 for(const [snippet,answer] of [['Quel transport est associé à 1817','Le train'],['Quelle date le cours associe-t-il au bateau','1850'],['En quelle année l’automobile','1886']])assert.equal(h.exercises[0].questions.find(q=>q.prompt.startsWith(snippet)).answer,answer);
 const source=fs.readFileSync(path.join(root,'revision/engine.js'),'utf8');assert.match(source,/500\*2859\/32601/);assert.match(source,/32 601 km/);assert.match(source,/2 859 km/);
});
test('Nombres : formes indépendamment vérifiées, traits d’union et accords stricts',()=>{
 const f=lessons[3];const expected={18:'dix-huit',24:'vingt-quatre',37:'trente-sept',49:'quarante-neuf',58:'cinquante-huit',63:'soixante-trois',71:'soixante-et-onze',75:'soixante-quinze',80:'quatre-vingts',81:'quatre-vingt-un',88:'quatre-vingt-huit',90:'quatre-vingt-dix',97:'quatre-vingt-dix-sept',100:'cent',101:'cent-un',120:'cent-vingt',180:'cent-quatre-vingts',200:'deux-cents',201:'deux-cent-un',280:'deux-cent-quatre-vingts',300:'trois-cents',320:'trois-cent-vingt',400:'quatre-cents',500:'cinq-cents',501:'cinq-cent-un',520:'cinq-cent-vingt',600:'six-cents',800:'huit-cents',1000:'mille',6000:'six-mille'};
 for(const q of f.exercises[0].questions){const n=Number(q.prompt.match(/\d+/)[0]);assert.equal(q.answer,expected[n]);}
 const get=n=>f.exercises[0].questions.find(q=>q.prompt.startsWith('Écris '+n+' '));
 for(const [n,wrong] of [[80,'quatre-vingt'],[81,'quatre-vingts-un'],[200,'deux-cent'],[201,'deux-cents-un'],[520,'cinq-cents-vingt'],[6000,'six-milles'],[24,'vingt quatre']])assert.equal(api.isCorrect(get(n),wrong),false,wrong);
 assert.equal(api.isCorrect(get(520),' CINQ‑CENT‑VINGT '),true);
 for(const q of f.exercises[4].questions){const bad=q.prompt.match(/« (.*?) »/)[1];assert.equal(api.isCorrect(q,bad),false,q.id);}
});
test('Des indéfini et des contracté sont présentés en contexte',()=>{
 const qs=lessons[2].exercises[5].questions.filter(q=>q.prompt.includes('« des »'));assert.equal(qs.length,6);assert.equal(qs.filter(q=>q.answer==='Article indéfini').length,3);assert.equal(qs.filter(q=>q.answer==='Article contracté').length,3);qs.forEach(q=>assert.ok(q.context));
});
