/* "En vivo": video de él bailando con el público. Arranca con la 2.ª toma del video de la portada (b) y sigue con su propia toma (c).
   Cuadros en vaivén; se pausa fuera de pantalla. */
(function(){
  var sec=document.getElementById('live'); if(!sec) return;
  var poster=sec.querySelector('img.vid'); if(!poster) return;
  var CLIPS=[{dir:'img/baila/b/',n:17},{dir:'img/baila/c/',n:21}], total=0, loaded=0;
  CLIPS.forEach(function(cl){ cl.frames=[]; for(var i=1;i<=cl.n;i++){ var im=new Image(); im.src=cl.dir+'f'+(i<10?'0'+i:i)+'.jpg'; total++; im.onload=function(){ if(++loaded===total) start(); }; cl.frames.push(im); } });
  function start(){
    var f0=CLIPS[0].frames[0];
    var c=document.createElement('canvas'); c.className='vid'; c.width=f0.naturalWidth; c.height=f0.naturalHeight;
    c.setAttribute('role','img'); c.setAttribute('aria-label',poster.alt);
    var x=c.getContext('2d'); x.drawImage(f0,0,0);
    sec.insertBefore(c,poster); poster.style.display='none';
    var ci=0, idx=0, dir=1, last=0, vis=true;
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){ vis=e[0].isIntersecting; }).observe(sec);
    (function tick(t){
      requestAnimationFrame(tick);
      if(!vis||document.hidden||t-last<83) return;
      last=t; var cl=CLIPS[ci]; x.drawImage(cl.frames[idx],0,0);
      idx+=dir;
      if(idx>=cl.n-1||idx<=0){ dir=-dir; if(idx<=0&&dir===1){ ci=(ci+1)%CLIPS.length; idx=0; } }
    })(0);
  }
})();
