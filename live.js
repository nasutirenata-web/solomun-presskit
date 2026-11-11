/* "En vivo": video de él bailando con el público (cuadros en vaivén, se pausa fuera de pantalla) */
(function(){
  var sec=document.getElementById('live'); if(!sec) return;
  var poster=sec.querySelector('img.vid'); if(!poster) return;
  var N=21, frames=[], loaded=0;
  for(var i=1;i<=N;i++){ var im=new Image(); im.src='img/baila/c/f'+(i<10?'0'+i:i)+'.jpg'; im.onload=function(){ if(++loaded===N) start(); }; frames.push(im); }
  function start(){
    var c=document.createElement('canvas'); c.className='vid'; c.width=frames[0].naturalWidth; c.height=frames[0].naturalHeight;
    c.setAttribute('role','img'); c.setAttribute('aria-label',poster.alt);
    var x=c.getContext('2d'); x.drawImage(frames[0],0,0);
    sec.insertBefore(c,poster); poster.style.display='none';
    var idx=0, dir=1, last=0, vis=true;
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){ vis=e[0].isIntersecting; }).observe(sec);
    (function tick(t){
      requestAnimationFrame(tick);
      if(!vis||document.hidden||t-last<83) return;
      last=t; x.drawImage(frames[idx],0,0);
      idx+=dir; if(idx>=N-1||idx<=0) dir=-dir;
    })(0);
  }
})();
