const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const maths=load('Mathematiques/M4-Fractions/extensions.json'),french=load('francais/F1-Groupe-nominal/extensions.json'),plugin=require('../revision/extensions-types.js');
const stub={addEventListener(){}},context={console,document:{querySelector:()=>stub,addEventListener(){},body:{dataset:{}}},fetch:()=>new Promise(()=>{})};context.window=context;vm.createContext(context);vm.runInContext(read('app.js'),context);vm.runInContext(read('revision/engine.js'),context);vm.runInContext(read('revision/extensions-types.js'),context);const api=context.RevisionEngine;
function canonical(q){if(q.type==='tokens')return q.answer;if(q.type==='decompose')return q.answers;if(q.type==='extended'){
 if(['multi','single','rank'].includes(q.kind))return q.answer;
 if(q.kind==='grid')return Array.from({length:q.visual.target},(_,i)=>i);
 if(q.kind==='number')return String(q.expected);
 if(q.kind==='fields')return q.expected.map(String);
 if(q.kind==='rational')return q.target.map(String);
 if(q.kind==='division')return [Math.floor(q.n/q.d),q.n%q.d].map(String);
 if(q.kind==='mixed')return [Math.floor(q.n/q.d),q.n%q.d,q.d].map(String);
 if(q.kind==='condition')return String(q.side==='numerator'?(q.relation==='<'?1:q.relation==='='?q.d:q.d+1):(q.relation==='<'?q.n+1:q.relation==='='?q.n:1));
 }return q.answer;}
test('27 activités, au moins 30 situations par banque, identifiants et situations distincts',()=>{
 assert.equal(maths.exercises.length,14);assert.equal(french.exercises.length,13);const ids=[];
 for(const bank of [maths,french]){assert.equal(bank.expectedExercises,bank.exercises.length);assert.equal(new Set(bank.groups.flatMap(g=>g.indices)).size,bank.exercises.length);for(const ex of bank.exercises){assert(ex.questions.length>=30,ex.code);assert.equal(ex.sessionSize,ex.blueprint?20:10);const fingerprints=new Set();for(const q of ex.questions){assert(q.prompt&&q.explanation&&q.hint,q.id);ids.push(q.id);const fp=JSON.stringify([q.type,q.kind,q.prompt,q.context,q.words,q.visual,q.row,q.length,q.n,q.d]);assert(!fingerprints.has(fp),'Duplicate '+q.id);fingerprints.add(fp);if(q.options){assert.equal(new Set(q.options).size,q.options.length,q.id);if(q.type==='choice')assert(q.options.includes(q.answer),q.id);}if(q.kind==='condition')assert(q.side==='numerator'?q.d>0:q.n>0);else if(q.d!==undefined)assert(q.d>0);}}}
 assert.equal(new Set(ids).size,ids.length);assert.equal(ids.length,1195);
});
test('Toutes les corrections, variantes et distracteurs ; aucun zéro au dénominateur',()=>{
 for(const bank of [maths,french])for(const ex of bank.exercises)for(const q of ex.questions){assert(api.isCorrect(q,canonical(q)),q.id);for(const a of q.aliases||[])assert(api.isCorrect(q,a),q.id+' alias');if(q.type==='choice')for(const bad of q.options.filter(o=>o!==q.answer))assert(!api.isCorrect(q,bad),q.id+' distracteur');if(q.kind==='rational'){assert(!plugin.correct(q,['1','0']));assert(plugin.correct(q,q.target.map(v=>String(v*7))));}if(q.kind==='mixed'){const good=canonical(q);assert(plugin.correct(q,[good[0],String(Number(good[1])*3),String(Number(good[2])*3)]));assert(!plugin.correct(q,[good[0],good[1],'0']));assert(!plugin.correct(q,[String(Number(good[0])+1),good[1],good[2]]));}}
});
// Évaluation indépendante des expressions : fractions, addition et multiplication par un entier.
const fraction=s=>{const m=s.match(/^\[\[(\d+)\/(\d+)\]\]$/);if(m)return[BigInt(m[1]),BigInt(m[2])];if(/^\d+$/.test(s))return[BigInt(s),1n];throw Error(s)};
function expression(s){return s.split(' + ').map(term=>term.split(' × ').map(fraction).reduce(([a,b],[c,d])=>[a*c,b*d],[1n,1n])).reduce(([a,b],[c,d])=>[a*d+c*b,b*d],[0n,1n]);}
const equal=([a,b],[c,d])=>a*d===c*b;
test('Toutes les écritures multiples sont recalculées ; aucun choix correct oublié',()=>{
 for(const q of maths.exercises[1].questions){const target=fraction(q.prompt.match(/\[\[\d+\/\d+\]\]/)[0]);for(const option of q.options)assert.equal(q.answer.includes(option),equal(expression(option),target),q.id+' '+option);assert(q.answer.length>=2);assert(!plugin.correct(q,[q.answer[0]]));assert(!plugin.correct(q,[...q.answer,q.options.find(o=>!q.answer.includes(o))]));}
});
test('Décompositions et équivalences recalculées ; comparaisons sans approximation',()=>{
 for(const index of [0,3])for(const q of maths.exercises[index].questions){const match=q.prompt.match(/Complète : (.*?)\.$/);assert(match,q.id);let equation=match[1].replace('□',String(q.expected)).replace('?',String(q.expected));const [a,b]=equation.split(' = ');assert(equal(expression(a),expression(b)),q.id);}
 for(const q of maths.exercises[2].questions){const expr=q.prompt.slice('Reconstitue : '.length).split(' = ')[0];assert(equal(expression(expr),q.target.map(BigInt)),q.id);}
 for(const q of maths.exercises[5].questions){const fr=[...q.prompt.matchAll(/\[\[(\d+)\/(\d+)\]\]/g)].map(m=>[BigInt(m[1]),BigInt(m[2])]);const [a,b]=fr[0],[c,d]=fr[1];assert.equal(q.answer,a*d<c*b?'<':a*d>c*b?'>':'=');assert(q.explanation.includes('centièmes'));assert(!/croix/.test(q.explanation));}
});
test('Questions ouvertes : toutes les solutions positives et les grands entiers exacts',()=>{
 for(const q of maths.exercises[8].questions)for(let candidate=0;candidate<=40;candidate++){const n=q.side==='numerator'?candidate:q.n,d=q.side==='denominator'?candidate:q.d;const expected=candidate>0&&(q.relation==='<'?n<d:q.relation==='>'?n>d:n===d);assert.equal(plugin.correct(q,String(candidate)),expected,q.id+' '+candidate);}
 const q=maths.exercises[8].questions.find(q=>q.side==='denominator'&&q.relation==='<');assert(plugin.correct(q,'99999999999999999999999999999999999999999999'));assert(!plugin.correct(q,'1.5'));assert(!plugin.correct(q,'-2'));
});
test('Divisions et problèmes : quotient, reste propre et partage entier/fractionnaire',()=>{
 for(const ex of [maths.exercises[10],maths.exercises[11],maths.exercises[12]])for(const q of ex.questions){const quotient=Math.floor(q.n/q.d),remainder=q.n-quotient*q.d;assert(remainder>=0&&remainder<q.d);assert.equal(q.n,quotient*q.d+remainder);assert(plugin.correct(q,canonical(q)));if(q.kind==='division')assert(!plugin.correct(q,[String(quotient-1),String(remainder+q.d)]));}
 assert(maths.exercises[12].questions.length>=30);assert.equal(maths.exercises[12].questions.filter(q=>q.kind==='mixed').length,16);assert.equal(maths.exercises[12].questions.filter(q=>q.kind==='division').length,16);
});
test('Figures : parts égales, indices sûrs, fractions et rangs exacts',()=>{
 for(const q of maths.exercises[4].questions){if(q.kind==='grid'){const m=q.prompt.match(/\[\[(\d+)\/(\d+)\]\]/);assert(m);assert.equal(q.visual.target*Number(m[2]),Number(m[1])*q.visual.total);if(q.visual.target>1)assert(!plugin.correct(q,Array(q.visual.target).fill(0)));assert(!plugin.correct(q,Array.from({length:q.visual.target},(_,i)=>i+q.visual.total)));}if(q.visual?.filled!==undefined){const target=[BigInt(q.visual.filled),BigInt(q.visual.total)];for(const o of q.options)assert.equal(Array.isArray(q.answer)?q.answer.includes(o):o===q.answer,equal(fraction(o),target),q.id);}}
 for(const q of french.exercises[11].questions){assert(q.answer>=1&&q.answer<=q.length);assert(q.length<=10);assert(plugin.correct(q,String(q.answer)));assert(!plugin.correct(q,String(q.answer+1)));}
});
test('Tirages répétés : tailles, absence de doublon, nouveaux tirages et bilans équilibrés',()=>{
 for(const bank of [maths,french])for(const ex of bank.exercises){let previous=[];for(let i=0;i<60;i++){const draw=api.draw(ex.questions,previous,ex.sessionSize,ex);assert.equal(draw.length,ex.sessionSize);assert.equal(new Set(draw.map(i=>i.q.id)).size,ex.sessionSize);if(previous.length)assert(draw.some(q=>!previous.some(old=>old.q.id===q.q.id)));const counts={};draw.forEach(i=>counts[i.q.skill]=(counts[i.q.skill]||0)+1);if(ex.blueprint)assert.deepEqual(counts,ex.blueprint);if(ex.balanceBuckets){const sizes=ex.balanceBuckets.map(k=>counts[k]);assert(sizes.every(n=>n===3||n===4));assert.equal(sizes.reduce((a,b)=>a+b),10);}previous=draw;}}
});
test('Accords de l’adjectif vérifiés avec un référentiel indépendant ; accents conservés',()=>{
 const morph={petit:['petit','petite','petits','petites'],rouge:['rouge','rouge','rouges','rouges'],immense:['immense','immense','immenses','immenses'],joli:['joli','jolie','jolis','jolies'],vieux:['vieux','vieille','vieux','vieilles'],heureux:['heureux','heureuse','heureux','heureuses'],noir:['noir','noire','noirs','noires'],blanc:['blanc','blanche','blancs','blanches'],sportif:['sportif','sportive','sportifs','sportives'],amusant:['amusant','amusante','amusants','amusantes'],grand:['grand','grande','grands','grandes'],gros:['gros','grosse','gros','grosses'],bleu:['bleu','bleue','bleus','bleues'],rond:['rond','ronde','ronds','rondes'],vert:['vert','verte','verts','vertes'],lent:['lent','lente','lents','lentes'],rapide:['rapide','rapide','rapides','rapides'],beau:['beau','belle','beaux','belles'],nouveau:['nouveau','nouvelle','nouveaux','nouvelles']};
 for(const q of french.exercises[6].questions){const base=q.prompt.match(/adjectif « (.*?) »/)[1];const feature=q.explanation.match(/est (masculin|féminin) (singulier|pluriel)/);assert(feature);const index=(feature[2]==='pluriel'?2:0)+(feature[1]==='féminin'?1:0);assert.equal(q.answer,morph[base][index],q.id);}
 const first=french.exercises[10].questions.find(q=>q.answer==='première');assert(first);assert(!api.isCorrect(first,'premiere'));const noire=french.exercises[6].questions.find(q=>q.answer==='noire');assert(!api.isCorrect(noire,'noir'));const rouges=french.exercises[6].questions.find(q=>q.answer==='rouges');assert(!api.isCorrect(rouges,'rouge'));
 for(const q of french.exercises[8].questions){const bad=q.prompt.match(/« (.*?) »/)[1];assert(!api.isCorrect(q,bad),q.id);}
});
test('Déterminants contextualisés : interrogatif/exclamatif et des contracté/indéfini',()=>{
 const qs=french.exercises[1].questions;for(const q of qs){assert(q.context);if(q.answer==='Déterminant interrogatif')assert(q.context.endsWith('?'));if(q.answer==='Déterminant exclamatif')assert(q.context.endsWith('!'));}
 assert.equal(qs.find(q=>q.context==='Des oiseaux chantent.').answer,'Article indéfini');assert.equal(qs.find(q=>q.context.startsWith('Il parle des livres')).answer,'Article défini contracté');assert(!JSON.stringify(french.exercises).includes('auquel'));assert(qs.some(q=>q.context.includes('autre livre')));assert(qs.some(q=>q.context.includes('mêmes élèves')));
});
test('Générateur de divisions : banques nouvelles, exactes, distinctes et avec les exemples du cours',()=>{
 let seed=27;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};let previous=[];
 for(let i=0;i<30;i++){const pool=plugin.generate(maths.exercises[10],rng);assert.equal(pool.length,60);assert.equal(new Set(pool.map(q=>q.id)).size,60);for(const q of pool){assert(q.d>=2&&q.d<=12);assert(plugin.correct(q,[String(Math.floor(q.n/q.d)),String(q.n%q.d)]));assert(q.n%q.d<q.d);}assert(pool.some(q=>q.n===28&&q.d===7));assert(pool.some(q=>q.n===54&&q.d===5));if(previous.length)assert(pool.some(q=>!previous.includes(q.id)));previous=pool.map(q=>q.id);}
});
