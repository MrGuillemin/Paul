const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalogue=JSON.parse(read('revision/catalogue.json')).pages;
const quizzes=catalogue.filter(p=>read(p.path).includes('id="quiz-data"')).map(p=>({path:p.path,...JSON.parse(read(p.path).match(/<script type="application\/json" id="quiz-data">([\s\S]*?)<\/script>/)[1])}));
test('Catalogue exhaustif, hiérarchie sans cycle, titres et menus concordants',()=>{
 function walk(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
 assert.deepEqual(catalogue.map(p=>p.path).sort(),walk('').sort());assert.equal(new Set(catalogue.map(p=>p.path)).size,catalogue.length);
 for(const p of catalogue){let x=p;const seen=new Set();while(x.parent){assert(!seen.has(x.path),'Cycle '+p.path);seen.add(x.path);x=catalogue.find(c=>c.path===x.parent);assert(x);}
  if(['redirect','home'].includes(p.kind))continue;const s=read(p.path);assert(s.includes('<title>'+p.title+' — Révision Quest</title>'),p.path);assert(s.includes('<h1>'+p.title+'</h1>'),p.path);assert.equal((s.match(/class="breadcrumb"/g)||[]).length,1,p.path);
 }
 for(const [p,parent]of [['francais/F1-Groupe-nominal/index.html','grammaire/index.html'],['francais/F2-Determinants/index.html','grammaire/index.html'],['francais/C3-Futur-simple/index.html','conjugaison/index.html'],['francais/F3-Nombres-en-lettres/index.html','orthographe/index.html']])assert.equal(catalogue.find(c=>c.path===p).parent,parent);
});
test('Anciens QCM : aucune répétition par banque, une correction disponible et des options uniques',()=>{
 assert.equal(quizzes.length,19);for(const quiz of quizzes){assert.equal(quiz.titles.length,quiz.pools.length);for(const pool of quiz.pools){assert(pool.length);const seen=new Set();for(const q of pool){const key=JSON.stringify([q.q,q.a]);assert(!seen.has(key),quiz.path+': '+q.q);seen.add(key);assert(q.e);assert(q.o.includes(q.a),q.q);assert.equal(new Set(q.o).size,q.o.length);}}}
});
test('Anglais : les pronoms et possessifs suivent les personnes explicitement identifiées',()=>{
 const q=quizzes.find(q=>q.path==='anglais/introduce-yourself.html');for(const item of q.pools[4]){const female=item.q.includes('is a girl.');assert(female||item.q.includes('is a boy.'));const possessive=!item.q.includes('___ is');assert.equal(item.a,female?(possessive?'Her':'She'):(possessive?'His':'He'));}
});
test('Pays de la Loire/Nantes et Centre-Val de Loire/Orléans : correction indépendante dans tous les formats',()=>{
 const bank=JSON.parse(read('histoire-geo/Regions-prefectures-DROM/questions.json'));
 const stub={addEventListener(){}};const context={console,document:{querySelector:()=>stub,addEventListener(){},body:{dataset:{}}},fetch:()=>new Promise(()=>{})};context.window=context;vm.createContext(context);vm.runInContext(read('app.js'),context);vm.runInContext(read('revision/engine.js'),context);
 for(const [name,city,wrong]of [['Pays de la Loire','Nantes','Orléans'],['Centre-Val de Loire','Orléans','Nantes']]){
  const q=bank.exercises[0].questions.find(q=>q.type==='select'&&q.context===name);assert(q);assert.equal(q.answer,city);assert(context.RevisionEngine.isCorrect(q,city));assert(!context.RevisionEngine.isCorrect(q,wrong));
  const triple=bank.exercises[7].questions.find(q=>q.type==='decompose'&&q.context===name);assert.equal(triple.answers[0],city);assert(!context.RevisionEngine.isCorrect(triple,[wrong,triple.answers[1]]));assert(context.RevisionEngine.isCorrect(triple,triple.answers));
 }
});
test('Repères historiques et répartition des compétences corrigés',()=>{
 const region=quizzes.find(q=>q.path==='histoire-geo/regions-francaises.html').pools.flat();assert.equal(region.find(q=>q.q==='Qui représente l’État dans la région ?').a,'Le préfet de région');assert.equal(region.find(q=>q.q.startsWith('Quelle réforme a réduit')).a,'La loi du 16 janvier 2015');
 const revolution=quizzes.find(q=>q.path==='histoire-geo/revolution-republique-terreur.html').pools.flat();assert(!revolution.some(q=>/emprisonné après Varennes|1792-1794/.test(q.q)));assert(revolution.some(q=>q.e.includes('13 août 1792')));
 const steam=read('Histoire/Lecon-2/Machine-a-vapeur/script.js');assert(steam.includes('norm(a)===\'1769\''));assert(!steam.includes('inventée en ${input'));
 const h=JSON.parse(read('Histoire/Lecon-2/Revolution-des-transports/questions.json'));assert.equal(h.exercises[0].questions.find(q=>q.id==='h2-transports-1-02').answer,'1807');assert(h.recap[0].includes('Trevithick'));assert(!JSON.stringify(h).includes('1817'));
 const science=quizzes.find(q=>q.path==='sciences/systeme-solaire.html');assert(science.pools.flat().every(q=>q.e.includes('géantes de glaces')));
});
test('Tables et multiples : chaque résultat et chaque vrai/faux recalculé indépendamment',()=>{
 for(const quiz of quizzes.filter(q=>/essentiels-(tables|multiples)/.test(q.path)))for(const q of quiz.pools.flat()){
  const m=q.q.match(/^(\d+|\?) × (\d+|\?) = (\d+|\?)/);if(!m){const groups=q.q.match(/(\d+) groupe/);assert(groups);assert.equal(Number(q.a),Number(groups[1])*25);continue;}
  const [,a,b,c]=m;if(q.a==='Vrai'||q.a==='Faux')assert.equal(q.a,Number(a)*Number(b)===Number(c)?'Vrai':'Faux');else if(a==='?')assert.equal(Number(q.a),Number(c)/Number(b));else if(b==='?')assert.equal(Number(q.a),Number(c)/Number(a));else assert.equal(Number(q.a),Number(a)*Number(b));
 }
});
test('Étoiles proportionnelles à la taille de la série ; stockage indisponible sans blocage',()=>{
 const els=Object.fromEntries(['bigscore','stars','resultText'].map(k=>[k,{}]));const context={document:{getElementById:k=>els[k]},localStorage:{getItem(){throw Error('private')},setItem(){throw Error('private')}}};vm.createContext(context);vm.runInContext(read('app.js'),context);assert.doesNotThrow(()=>context.saveBest('test',3));assert.equal(context.getBest('test'),0);context.renderResult(2,2);assert.equal(els.stars.textContent,'⭐⭐⭐');assert.equal(els.bigscore.textContent,'2/2');
});
