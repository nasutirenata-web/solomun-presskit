/* Tour dates en formato tracklist: número de pista, ecualizador en la próxima fecha y marca "next" */
(function(){
  var list=document.getElementById('dates'); if(!list) return;
  var rows=[].slice.call(list.querySelectorAll('li')), next=null;
  rows.forEach(function(li,i){
    var n=document.createElement('span'); n.className='trk mono'; n.textContent=('0'+(i+1)).slice(-2);
    li.insertBefore(n,li.firstChild);
    if(!next && !li.classList.contains('past')){ next=li; }
  });
  if(next){
    next.classList.add('next');
    var city=next.querySelector('.city');
    var eq=document.createElement('span'); eq.className='eq'; eq.setAttribute('aria-hidden','true'); eq.innerHTML='<i></i><i></i><i></i><i></i><i></i>';
    var nx=document.createElement('em'); nx.className='nx mono'; nx.textContent='next';
    city.appendChild(nx); city.appendChild(eq);
  }
})();
