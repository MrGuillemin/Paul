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
  try {
    const parsed=JSON.parse(localStorage.getItem(storeKey)||"{}");
    const best=parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
    best[key]=Math.max(Number(best[key])||0,score);
    localStorage.setItem(storeKey,JSON.stringify(best));
  } catch { /* Le mode privé ou une sauvegarde abîmée ne bloque pas le bilan. */ }
}

function getBest(key){
  try { const best=JSON.parse(localStorage.getItem("revisionQuestBest")||"{}");return Number(best?.[key])||0; } catch { return 0; }
}

function renderResult(score, total=10){
  const ratio=total>0?score/total:0;
  const stars=ratio>=0.9?3:ratio>=0.7?2:ratio>=0.5?1:0;
  document.getElementById("bigscore").textContent=`${score}/${total}`;
  document.getElementById("stars").textContent="⭐".repeat(stars)+(stars===0?"💪":"");
  document.getElementById("resultText").textContent=
    ratio>=0.9?"Excellent ! Les notions de cette série sont bien comprises.":
    ratio>=0.7?"Très bien ! Encore un petit effort.":
    ratio>=0.5?"Bon début : rejoue pour consolider.":
    "On recommence tranquillement : les erreurs servent à apprendre !";
}
