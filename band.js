/* Franja de premios: se desliza con el scroll (sube = un lado, baja = el otro), se acelera con la velocidad y se frena al pasar el mouse */
(function(){
  var band=document.querySelector('.marquee'); if(!band) return;
  var row=band.firstElementChild; if(!row) return;
  var x=0, last=window.scrollY, vel=0, hover=false, half=0;
  function measure(){ half=row.scrollWidth/2; }
  measure(); window.addEventListener('resize',measure); window.addEventListener('load',measure);
  band.addEventListener('pointerenter',function(){hover=true;}); band.addEventListener('pointerleave',function(){hover=false;});
  (function tick(){
    requestAnimationFrame(tick);
    var y=window.scrollY, d=y-last; last=y;
    vel += (d-vel)*.12;                         // velocidad suavizada
    var speed = hover ? .15 : .7;               // base lenta, casi quieta al apuntarla
    x -= speed + vel*.9;
    if(half){ if(x<=-half) x+=half; if(x>0) x-=half; }
    row.style.transform='translate3d('+x+'px,0,0) skewX('+Math.max(-12,Math.min(12,-vel*.5))+'deg)';
  })();
})();
