/* Discos que suenan: al tocar un vinilo se escuchan los adelantos oficiales (30 s) de Apple Music.
   Reproductor chico y delicado abajo con pista actual, barra, anterior / pausa / siguiente y "escuchar completo". */
(function(){
  var crate=document.querySelector('.crate'); if(!crate) return;
  var A='https://audio-ssl.itunes.apple.com/itunes-assets/';
  var ALBUMS=[
    {name:'Dance Baby',cover:'img/discos/dance-baby.jpg',tracks:[
      ['Country Song',A+'AudioPreview211/v4/53/68/12/53681268-8415-2144-2837-527e2058236d/mzaf_9376316825191449696.plus.aac.p.m4a'],
      ['Boys in the Hood',A+'AudioPreview221/v4/d6/71/3b/d6713b88-e159-4a96-6440-d28c0e544e61/mzaf_10153471658440316984.plus.aac.p.m4a'],
      ['Cloud Dancer',A+'AudioPreview221/v4/66/22/73/662273b9-4064-e3b7-a955-768497ef2b69/mzaf_3919021386313452116.plus.aac.p.m4a'],
      ['Hypnotize',A+'AudioPreview211/v4/57/bd/49/57bd490a-ae3e-0cd7-fc19-43209c9d4a28/mzaf_2290564608850939120.plus.aac.p.m4a']]},
    {name:'Customer Is King',cover:'img/discos/customer-is-king.jpg',tracks:[
      ['Customer Is King',A+'AudioPreview211/v4/cb/de/8e/cbde8ec5-895a-5265-990a-a04cc6184e34/mzaf_16758401544816738752.plus.aac.p.m4a'],
      ['Dre',A+'AudioPreview221/v4/f0/3d/cd/f03dcd55-c32c-499b-b82e-f5a662f844ce/mzaf_2386516602464038326.plus.aac.p.m4a'],
      ['Ich Muss Los',A+'AudioPreview211/v4/39/3a/cd/393acd47-85b5-49a4-8d7b-e24408f336ae/mzaf_14057326669325458530.plus.aac.p.m4a']]},
    {name:'Home',cover:'img/discos/home.jpg',tracks:[
      ['Home',A+'AudioPreview116/v4/5c/b7/59/5cb75919-edd4-258b-5f5b-5aaf8b5cba84/mzaf_9008479707671441653.plus.aac.p.m4a'],
      ['Home (Club Mix)',A+'AudioPreview126/v4/7a/f5/7f/7af57f8c-a990-c3ff-4de8-286f7b00ded5/mzaf_16232810119049663851.plus.aac.p.m4a']]},
    {name:'Nobody Is Not Loved',cover:'img/discos/ninl.jpg',tracks:[
      ['Ocean (feat. Jamie Foxx)',A+'AudioPreview115/v4/86/61/c7/8661c7b7-f404-1a91-a714-33f241ba9893/mzaf_16248062413736776871.plus.aac.p.m4a'],
      ['Home',A+'AudioPreview115/v4/26/6f/a7/266fa7c6-08c6-45ec-fb39-1b10a69e4fe1/mzaf_6654760015523406045.plus.aac.p.m4a'],
      ['Your Love Gives Me Gravity',A+'AudioPreview115/v4/4c/ad/85/4cad8573-e86f-7a25-acef-2ac2823671bd/mzaf_179704586670199540.plus.aac.p.m4a'],
      ['The Center Will Not Hold',A+'AudioPreview115/v4/ed/75/87/ed75877d-0992-4879-a69a-3c4267cf5e4e/mzaf_13178512368638035539.plus.aac.p.m4a']]}
  ];
  var recs=[].slice.call(crate.querySelectorAll('.rec'));
  var np=document.createElement('div'); np.className='np'; np.hidden=true;
  np.innerHTML='<img alt=""><div class="tt"><b></b><i class="mono"></i><div class="bar"><span></span></div></div><div class="ctl"><button type="button" class="pv" aria-label="Anterior">⏮</button><button type="button" class="pp" aria-label="Pausa">❚❚</button><button type="button" class="nx" aria-label="Siguiente">⏭</button><a class="full" target="_blank" rel="noopener">Completo ↗</a></div>';
  crate.parentNode.insertBefore(np,crate.nextSibling);
  var hint=document.querySelector('.crate-hint'); if(hint) hint.textContent='Tocá un disco y escuchalo · adelantos oficiales de 30 s';
  var audio=new Audio(); audio.preload='none';
  var cur=-1, ti=0;
  var q=function(s){return np.querySelector(s)};
  function ui(){
    recs.forEach(function(r,i){ r.classList.toggle('playing',i===cur&&!audio.paused); r.classList.toggle('on',i===cur); });
    q('.pp').textContent=audio.paused?'▶':'❚❚'; q('.pp').setAttribute('aria-label',audio.paused?'Reproducir':'Pausa');
  }
  function load(i,t){
    cur=i; ti=t; var al=ALBUMS[i], tr=al.tracks[t];
    audio.src=tr[1]; np.hidden=false;
    q('img').src=al.cover; q('b').textContent=tr[0]; q('i').textContent=al.name+' · '+(t+1)+'/'+al.tracks.length;
    q('.full').href='https://open.spotify.com/search/'+encodeURIComponent('Solomun '+al.name);
    q('.bar span').style.width='0%';
    audio.play().then(ui).catch(ui);
  }
  recs.forEach(function(r,i){
    r.addEventListener('click',function(e){
      e.preventDefault();
      if(cur===i){ if(audio.paused) audio.play().then(ui); else { audio.pause(); ui(); } }
      else load(i,0);
    });
  });
  function next(d){ if(cur<0) return; var al=ALBUMS[cur], t=(ti+d+al.tracks.length)%al.tracks.length; load(cur,t); }
  q('.pp').addEventListener('click',function(){ if(cur<0) return; if(audio.paused) audio.play().then(ui); else { audio.pause(); ui(); } });
  q('.nx').addEventListener('click',function(){ next(1); });
  q('.pv').addEventListener('click',function(){ next(-1); });
  q('.bar').addEventListener('click',function(e){ var r=this.getBoundingClientRect(); if(audio.duration) audio.currentTime=audio.duration*((e.clientX-r.left)/r.width); });
  audio.addEventListener('timeupdate',function(){ if(audio.duration) q('.bar span').style.width=(audio.currentTime/audio.duration*100)+'%'; });
  audio.addEventListener('ended',function(){ var al=ALBUMS[cur]; if(ti<al.tracks.length-1) next(1); else { audio.pause(); ui(); } });
  audio.addEventListener('play',ui); audio.addEventListener('pause',ui);
  // se corta al salir de la sección
  if('IntersectionObserver' in window){ new IntersectionObserver(function(e){ if(!e[0].isIntersecting && !audio.paused){ audio.pause(); ui(); } },{threshold:0}).observe(document.getElementById('musica')||crate); }
})();
