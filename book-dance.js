/* Booking y Créditos: personas de un solo color bailando (azul de Mar del Plata sobre el menta; naranja de Miami sobre el negro).
   Cada una se ondula como un cuerpo y se turnan. Solo se anima mientras la sección se ve. */
(function(){
  var N=14;
  var styles=[{w:2.6,A:9,J:1.5,tw:0},{w:4.2,A:4,J:6,tw:0},{w:3.0,A:6,J:2,tw:7},{w:2.0,A:11,J:2.5,tw:3}];
  var stages=[];

  function build(selector, colors){
    var sec=document.querySelector(selector); if(!sec) return;
    var wrap=document.createElement('div'); wrap.className='bk'; wrap.setAttribute('aria-hidden','true');
        sec.insertBefore(wrap,sec.firstChild);
    var dancers=[], k=0;
    [0,1].forEach(function(gi){
      var g=document.createElement('div'); g.className='bkg bkg'+gi; wrap.appendChild(g);
      for(var d=0; d<4; d++){
        var host=document.createElement('div'); host.className='bkd'; host.style.setProperty('--bk',colors[(d+gi*2)%colors.length]); g.appendChild(host);
        var url='url(img/baila-'+(d+1)+'.png)', arr=[];
        for(var i=0;i<N;i++){
          var s=document.createElement('div'); s.className='bks';
          var top=Math.max(0,(i/N*100-1.3)).toFixed(2), bot=Math.max(0,(100-(i+1)/N*100-1.3)).toFixed(2);
          s.style.cssText='clip-path:inset('+top+'% 0 '+bot+'% 0);-webkit-mask-image:'+url+';mask-image:'+url;
          host.appendChild(s); arr.push({el:s,h:1-(i+.5)/N});
        }
        dancers.push({sl:arr, st:styles[(d+gi*2)%4], ph:Math.random()*6.28, k:k++});
      }
    });
    var st={sec:sec, dancers:dancers, vis:false};
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){ st.vis=e[0].isIntersecting; }).observe(sec); else st.vis=true;
    stages.push(st);
  }

  // colores de sus flyers: azul de Mar del Plata, coral de Punta del Este, naranja de Miami, menta de Mendoza, verde lima de la gira
  build('.book',['#3f5bd8']);      // azul (flyer de Mar del Plata), un solo color
  build('.finale',['#ff6a2c']);       // naranja (flyer de Miami), un solo color

  var T=1.7, SPEED=1.5;
  (function frame(ms){
    requestAnimationFrame(frame);
    if(document.hidden) return;
    var t=ms/1000;
    stages.forEach(function(st){
      if(!st.vis) return;
      var dancers=st.dancers, total=dancers.length, cyc=total*T;
      for(var d=0; d<total; d++){
        var D=dancers[d], c=D.k*T+T/2, dist=Math.abs(((t-c)%cyc+cyc*1.5)%cyc-cyc/2)/T;
        var e=.28+.72*Math.max(0,1-dist*1.1), s=D.st, w=s.w*SPEED, A=s.A*e, J=s.J*e*e, tw=s.tw*e;
        for(var i=0;i<N;i++){
          var S=D.sl[i], hh=Math.pow(S.h,1.25), ph=t*w+D.ph-S.h*2.4;
          var x=A*hh*Math.sin(ph), y=-J*hh*Math.max(0,Math.sin(t*w*2+D.ph))*.6, sk=tw*hh*Math.sin(ph+1.2);
          S.el.style.transform='translate3d('+x.toFixed(2)+'%,'+y.toFixed(2)+'%,0) skewX('+sk.toFixed(2)+'deg)';
        }
      }
    });
  })(0);
})();
