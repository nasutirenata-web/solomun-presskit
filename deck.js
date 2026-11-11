(function(){
  var deck=document.getElementById('deck'); if(!deck) return;
  var stage=deck.querySelector('.deck-stage'), cards=[].slice.call(stage.querySelectorAll('.card')), n=cards.length;
  var btns=[].slice.call(deck.querySelectorAll('.deck-list button'));
  var names=btns.map(function(b){return [b.querySelector('b').textContent,b.querySelector('i').textContent];});
  var cur=0;
  var slides=[{bg:'#cfd400',fg:'#0a0908'},{bg:'#a9e9c9',fg:'#0a0908'},{bg:'#f1a9a4',fg:'#0a0908'},{bg:'#9db5f0',fg:'#0a0908'},{bg:'#2f6a9e',fg:'#f4f1ea'}];   // color de cada flyer
  var tour=document.getElementById('fechas'), rootEl=document.documentElement, tourVis=false;
  function paint(){
    var s=slides[cur]; if(!tour) return;
    tour.style.setProperty('--slide-bg',s.bg); tour.style.setProperty('--slide-fg',s.fg);
    if(tourVis) rootEl.style.setProperty('--bar-fg',s.fg);
  }
  if(tour && 'IntersectionObserver' in window){
    new IntersectionObserver(function(e){ tourVis=e[0].isIntersecting; if(tourVis) rootEl.style.setProperty('--bar-fg',slides[cur].fg); else rootEl.style.removeProperty('--bar-fg'); },{rootMargin:'-70px 0px -50% 0px'}).observe(tour);
  }
  function pos(c,k){ // k = lugar en el mazo (0 = arriba)
    var side=k%2?1:-1, r=k?side*(3+k*2.2):0, x=k?side*(k*7):0, y=k*10, s=1-k*.045;
    c.style.zIndex=n-k; c.style.opacity=k>3?0:1; c.style.pointerEvents=k?'none':'auto';
    c.style.transform='translate(calc(-50% + '+x+'%), calc(-50% + '+y+'px)) rotate('+r+'deg) scale('+s+')';
  }
  function render(){
    cards.forEach(function(c,i){ pos(c,(i-cur+n)%n); });
    document.getElementById('deck-n').textContent=('0'+(cur+1)).slice(-2);
    document.getElementById('deck-city').textContent=names[cur][0];
    document.getElementById('deck-date').textContent=names[cur][1];
    btns.forEach(function(b,i){b.classList.toggle('on',i===cur);}); paint();
  }
  function go(i){ cur=(i+n)%n; render(); }
  function fling(dir){
    var c=cards[cur]; c.style.transition='transform .45s ease-in,opacity .45s';
    c.style.transform='translate(calc(-50% + '+dir*130+'%), -50%) rotate('+dir*22+'deg)'; c.style.opacity=0;
    setTimeout(function(){ c.style.transition=''; go(cur+1); },330);
  }
  var sx=0,dx=0,drag=null,moved=false;
  stage.addEventListener('pointerdown',function(e){ var c=e.target.closest('.card'); if(!c||c!==cards[cur]) return; drag=c; sx=e.clientX; dx=0; moved=false; c.classList.add('drag'); c.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove',function(e){ if(!drag) return; dx=e.clientX-sx; if(Math.abs(dx)>6) moved=true; drag.style.transform='translate(calc(-50% + '+dx+'px), -50%) rotate('+dx/18+'deg)'; });
  function end(){ if(!drag) return; var c=drag; drag=null; c.classList.remove('drag');
    if(Math.abs(dx)>90){ fling(dx>0?1:-1); } else { render(); if(!moved) fling(1); } }
  stage.addEventListener('pointerup',end); stage.addEventListener('pointercancel',end);
  stage.addEventListener('keydown',function(e){ if(e.key==='ArrowRight') go(cur+1); if(e.key==='ArrowLeft') go(cur-1); });
  btns.forEach(function(b,i){ b.addEventListener('click',function(){ go(i); }); });
  document.getElementById('deck-next').onclick=function(){ go(cur+1); };
  document.getElementById('deck-prev').onclick=function(){ go(cur-1); };
  var lb=document.getElementById('lightbox'), li=lb.querySelector('img');
  document.getElementById('deck-zoom').onclick=function(){ li.src=cards[cur].querySelector('img').src; lb.hidden=false; };
  lb.onclick=function(){ lb.hidden=true; };
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') lb.hidden=true; });
  render();
})();
