/* Bailarines de fondo: cada persona es un cuerpo que se ondula (pies quietos, cabeza y brazos se mueven más)
   y se turnan: de a una hace el baile fuerte mientras las demás se mueven suave. */
(function(){
  var N=16;                                   // franjas por persona
  var tries=0, timer=setInterval(function(){
    var crowd=document.querySelector('.crowd');
    if(crowd && crowd.querySelector('.dancer')){ clearInterval(timer); init(crowd); }
    else if(++tries>80){ clearInterval(timer); }
  },150);

  function slices(host, url){
    host.style.background='none'; host.style.animation='none';
    var arr=[];
    for(var i=0;i<N;i++){
      var s=document.createElement('div'); s.className='sl';
      var top=(i/N*100-1.3).toFixed(2), bot=(100-(i+1)/N*100-1.3).toFixed(2);
      s.style.cssText='position:absolute;inset:0;background:url('+url+') center bottom/100% 100% no-repeat;will-change:transform;clip-path:inset('+Math.max(0,top)+'% 0 '+Math.max(0,bot)+'% 0)';
      host.appendChild(s); arr.push({el:s,h:1-(i+.5)/N});   // h: 0 en los pies, 1 en la cabeza
    }
    return arr;
  }

  function init(crowd){
    var dancers=[], styles=[
      {w:2.6, A:9,  J:1.5, tw:0},     // balanceo amplio
      {w:4.2, A:4,  J:6,   tw:0},     // saltos
      {w:3.0, A:6,  J:2,   tw:7},     // torsión
      {w:2.0, A:11, J:2.5, tw:3}      // ola lenta de brazos
    ];
    var k=0;
    [].forEach.call(crowd.querySelectorAll('.grp'),function(g,gi){
      [].forEach.call(g.querySelectorAll('.dancer'),function(d,di){
        var url='img/baila-'+(di+1)+'.png', st=styles[(di+gi*2)%4];
        dancers.push({sl:slices(d,url), st:st, ph:Math.random()*6.28, k:k++, mirror:gi});
      });
    });
    var solo=crowd.querySelector('.solo');
    if(solo){
      solo.style.background='none'; solo.style.animation='none'; solo.style.filter='blur(1.2px)';
      solo.style.transform='translateX(-50%)';
      dancers.push({sl:slices(solo,'img/baila-mujer.png'), st:{w:2.2,A:8,J:3,tw:5}, ph:1.3, k:k++, mirror:0});
    }
    var total=dancers.length, T=1.7, SPEED=1.6;
    var reduce=false;
    function frame(ms){
      requestAnimationFrame(frame);
      if(document.hidden) return;
      var t=ms/1000, cyc=total*T;
      for(var d=0; d<total; d++){
        var D=dancers[d], c=((D.k*T+T/2)), dist=Math.abs(((t-c)%cyc+cyc*1.5)%cyc-cyc/2)/T;   // distancia a su turno
        var e=.28+.72*Math.max(0,1-dist*1.1);
        var s=D.st, w=s.w*SPEED, A=s.A*e, J=s.J*e*e, tw=s.tw*e;
        for(var i=0;i<N;i++){
          var S=D.sl[i], h=S.h, hh=Math.pow(h,1.25);
          var ph=t*w+D.ph-h*2.4;                        // la onda sube desde los pies
          var x=A*hh*Math.sin(ph);
          var y=-J*hh*Math.max(0,Math.sin(t*w*2+D.ph))*.6;   // rebote
          var sk=tw*hh*Math.sin(ph+1.2);
          S.el.style.transform='translate3d('+x.toFixed(2)+'%,'+y.toFixed(2)+'%,0) skewX('+sk.toFixed(2)+'deg)';
        }
      }
    }
    requestAnimationFrame(frame);
  }
})();
