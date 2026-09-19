function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function shuffle(a){
  const copy=[...a];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

function saveBest(key, score){
  const storeKey="revisionQuestBest";
  const best=JSON.parse(localStorage.getItem(storeKey)||"{}");
  best[key]=Math.max(best[key]||0,score);
  localStorage.setItem(storeKey,JSON.stringify(best));
}

function getBest(key){
  const best=JSON.parse(localStorage.getItem("revisionQuestBest")||"{}");
  return best[key]||0;
}

function renderResult(score, total=10){
  const stars=score>=9?3:score>=7?2:score>=5?1:0;
  document.getElementById("bigscore").textContent=`${score}/${total}`;
  document.getElementById("stars").textContent="⭐".repeat(stars)+(stars===0?"💪":"");
  document.getElementById("resultText").textContent=
    score>=9?"Excellent ! Le chapitre est presque maîtrisé.":
    score>=7?"Très bien ! Encore un petit effort.":
    score>=5?"Bon début : rejoue pour consolider.":
    "On recommence tranquillement : les erreurs servent à apprendre !";
}