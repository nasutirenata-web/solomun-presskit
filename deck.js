(function(){
  var deck=document.getElementById('deck'); if(!deck) return;
  var stage=deck.querySelector('.deck-stage'), cards=[].slice.call(stage.querySelectorAll('.card')), n=cards.length;
  var btns=[].slice.call(deck.querySelectorAll('.deck-list button'));
  var names=btns.map(function(b){return [b.querySelector('b').textContent,b.querySelector('i').textContent];});
  var cur=0;
  var glows=['#cfd400','#6fe3b3','#ff7d73','#7c98ff','#ff6a2c'];   // color dominante de cada flyer
  var tour=document.getElementById('fechas');
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
    btns.forEach(function(b,i){b.classList.toggle('on',i===cur);});
    deck.style.setProperty('--glow',glows[cur]||glows[0]);
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
  // inclinación 3D y brillo que siguen al mouse sobre la carta de arriba
  stage.addEventListener('pointermove',function(e){
    var c=cards[cur], r=c.getBoundingClientRect(); if(!r.width) return;
    var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    c.style.setProperty('--ry',((px-.5)*14).toFixed(1)+'deg'); c.style.setProperty('--rx',((.5-py)*10).toFixed(1)+'deg');
    c.style.setProperty('--mx',(px*100).toFixed(0)+'%'); c.style.setProperty('--my',(py*100).toFixed(0)+'%');
  });
  stage.addEventListener('pointerleave',function(){ var c=cards[cur]; c.style.setProperty('--ry','0deg'); c.style.setProperty('--rx','0deg'); });
  // parallax suave del fondo
  if(tour){ var tick=function(){ var r=tour.getBoundingClientRect(), p=(r.top+r.height/2-innerHeight/2)/innerHeight; tour.style.setProperty('--p',(p*-18).toFixed(1)); };
    window.addEventListener('scroll',tick,{passive:true}); tick(); }
  render();
})();
