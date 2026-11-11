/* Booking y Créditos: una fila de personitas bailando, de un solo color por página
   (azul de Mar del Plata en Booking, naranja de Miami en Créditos). Unas con las manos arriba, otras abajo.
   Cada una se ondula como un cuerpo y se turnan. Solo se anima mientras la sección se ve. */
(function(){
  var N=14;
  var styles=[{w:2.6,A:9,J:1.5,tw:0},{w:4.2,A:4,J:6,tw:0},{w:3.0,A:6,J:2,tw:7},{w:2.0,A:11,J:2.5,tw:3}];
  var LEGS_A=[[[46,118],[42,182],[41,244]],[[54,118],[58,182],[59,244]]];
  var LEGS_B=[[[44,118],[36,182],[31,244]],[[56,118],[64,182],[69,244]]];
  var POSES=[
    {l:[[39,46],[24,16],[16,-16]],  r:[[61,46],[76,16],[84,-16]], legs:LEGS_A},   // las dos manos arriba
    {l:[[39,46],[31,92],[30,132]],  r:[[61,46],[69,92],[70,132]], legs:LEGS_A},   // manos abajo
    {l:[[39,46],[24,18],[18,-14]],  r:[[61,46],[72,86],[60,110]], legs:LEGS_B},   // una arriba, una en la cintura
    {l:[[39,46],[22,84],[38,112]],  r:[[61,46],[78,84],[62,112]], legs:LEGS_A},   // manos en la cintura
    {l:[[39,46],[31,92],[30,132]],  r:[[61,46],[77,18],[84,-14]], legs:LEGS_B},   // una arriba, una abajo
    {l:[[39,46],[25,90],[18,128]],  r:[[61,46],[75,90],[82,128]], legs:LEGS_B}    // manos abajo, piernas abiertas
  ];
  function pl(pts,w){ return '<polyline fill="none" stroke-width="'+w+'" points="'+pts.map(function(p){return p.join(',')}).join(' ')+'"/>'; }
  function svgUrl(p,lean){
    var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -28 100 276"><defs><filter id="b" x="-20%" y="-10%" width="140%" height="120%"><feGaussianBlur stdDeviation="1.7"/></filter></defs>'
      +'<g filter="url(#b)" stroke="#000" fill="#000" stroke-linecap="round" stroke-linejoin="round">'
      +'<circle cx="'+(50+lean)+'" cy="17" r="12.5"/>'
      +pl([[50+lean,36],[50+lean*.5,78],[50,120]],25)
      +pl(p.l,9.5)+pl(p.r,9.5)+pl(p.legs[0],12.5)+pl(p.legs[1],12.5)
      +'</g></svg>';
    return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")';
  }

  var stages=[];
  function build(selector, color, order){
    var sec=document.querySelector(selector); if(!sec) return;
    var wrap=document.createElement('div'); wrap.className='bk'; wrap.setAttribute('aria-hidden','true'); wrap.style.setProperty('--bk',color);
    sec.insertBefore(wrap,sec.firstChild);
    var dancers=[], n=order.length;
    order.forEach(function(pi,idx){
      var lean=(idx%3-1)*2.2, url=svgUrl(POSES[pi],lean), arr=[];
      var host=document.createElement('div'); host.className='bkp';
      var scale=.9+((idx*37)%11)/55;                       // alturas distintas
      host.style.left=((idx/(n-1))*92-2)+'%'; host.style.height=(scale*100)+'%'; host.style.opacity=(.72+((idx*13)%7)/25).toFixed(2);
      wrap.appendChild(host);
      for(var i=0;i<N;i++){
        var s=document.createElement('div'); s.className='bks';
        var top=Math.max(0,(i/N*100-1.3)).toFixed(2), bot=Math.max(0,(100-(i+1)/N*100-1.3)).toFixed(2);
        s.style.cssText='clip-path:inset('+top+'% 0 '+bot+'% 0);-webkit-mask-image:'+url+';mask-image:'+url;
        host.appendChild(s); arr.push({el:s,h:1-(i+.5)/N});
      }
      dancers.push({sl:arr, st:styles[idx%4], ph:Math.random()*6.28, k:idx});
    });
    var st={sec:sec, dancers:dancers, vis:false};
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){ st.vis=e[0].isIntersecting; }).observe(sec); else st.vis=true;
    stages.push(st);
  }

  build('.book','#6f8df0',[1,0,2,5,4,1,3,0,5,2]);      // azul (flyer de Mar del Plata)
  build('.finale','#ff6a2c',[2,1,0,4,5,3,1,0,2,5]);    // naranja (flyer de Diynamic Miami)

  var T=1.5, SPEED=1.5;
  (function frame(ms){
    requestAnimationFrame(frame);
    if(document.hidden) return;
    var t=ms/1000;
    stages.forEach(function(st){
      if(!st.vis) return;
      var dancers=st.dancers, total=dancers.length, cyc=total*T;
      for(var d=0; d<total; d++){
        var D=dancers[d], c=D.k*T+T/2, dist=Math.abs(((t-c)%cyc+cyc*1.5)%cyc-cyc/2)/T;
        var e=.28+.72*Math.max(0,1-dist*1.1), s=D.st, w=s.w*SPEED, A=s.A*e*.8, J=s.J*e*e, tw=s.tw*e;
        for(var i=0;i<N;i++){
          var S=D.sl[i], hh=Math.pow(S.h,1.25), ph=t*w+D.ph-S.h*2.4;
          var x=A*hh*Math.sin(ph), y=-J*hh*Math.max(0,Math.sin(t*w*2+D.ph))*.6, sk=tw*hh*Math.sin(ph+1.2);
          S.el.style.transform='translate3d('+x.toFixed(2)+'%,'+y.toFixed(2)+'%,0) skewX('+sk.toFixed(2)+'deg)';
        }
      }
    });
  })(0);
})();
