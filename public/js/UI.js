
const highscorePage = document.getElementById("highscores-page");
var displayScores = () =>{
   var tmp = LS.get('currentSession');
   var html = '<h2 class="highscore-headline animateOpacity">Last 5 results on this server</h2><ul class="highscore-list">'
   for(var i=0;i < tmp.length;i++){
       html += `<li class="highscore-item"><span class="highscore-place">${"0"+(i+1)}</span><span class="highscore-score">${tmp[i]}</span></li>`
   }
   html += '</ul>'
   highscorePage.innerHTML = html;
   
}

