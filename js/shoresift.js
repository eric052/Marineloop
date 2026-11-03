/* Shoresift 產品頁：互動爆炸圖（依圖解內容製作） */
(function(){
  var IMGW=1600,IMGH=923,SRC='img/shoresift-exploded.png';
  var GROUPS=['動力與驅動','控制與供電','行走機構','進沙機構'];
  /* pin＝圖上黑點位置；r＝零件的位置範圍 [x,y,w,h]（圖片像素） */
  var P=[
    {n:'TT馬達',q:1,g:0,pin:[672,412],r:[630,340,140,130]},
    {n:'JAG 25-370 馬達',q:2,g:0,pin:[1100,497],r:[1015,450,150,120]},
    {n:'L298N 馬達驅動版',g:0,pin:[875,265],r:[760,205,140,100]},
    {n:'馬達架',q:2,g:0,pin:[807,153],r:[715,60,370,260]},
    {n:'樹莓派 4B 2G Ram',g:1,pin:[873,300],r:[700,280,200,140]},
    {n:'樹莓派18650供電模組',g:1,pin:[880,350],r:[715,270,170,130]},
    {n:'18650 5V / 12V供電模組',g:1,pin:[697,282],r:[600,220,170,130]},
    {n:'前輪',q:2,g:2,pin:[270,346],r:[225,300,190,150]},
    {n:'後驅動輪',q:2,g:2,pin:[1245,590],r:[1110,525,180,125]},
    {n:'履帶輪板架',q:2,g:2,pin:[1225,701],r:[1010,610,330,150]},
    {n:'履帶輪支撐柱',q:2,g:2,pin:[1115,713],r:[985,600,200,160]},
    {n:'裝置進沙口',g:3,pin:[607,497],r:[430,430,330,170]},
    {n:'雙螺旋進沙結構',g:3,pin:[590,750],r:[365,600,250,190]}
  ];
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var sheet=$('#sxSheet'),inner=$('#sxInner'),dim=$('#sxDim'),pinsEl=$('#sxPins'),list=$('#sxList'),info=$('#sxInfo'),bar=$('#sxBar i'),play=$('#sxPlay'),cnt=$('#sxCount');
  if(!sheet)return;
  var pad=function(n){return (n<10?'0':'')+n};
  function thumb(el,r){
    el.style.backgroundImage='url('+SRC+')';
    el.style.backgroundSize=(IMGW/r[2]*100)+'% auto';
    el.style.backgroundPosition=(r[0]/(IMGW-r[2])*100)+'% '+(r[1]/(IMGH-r[3])*100)+'%';
  }
  /* pins + list */
  P.forEach(function(p,i){
    var b=document.createElement('button');b.className='sx-pin';b.type='button';b.textContent=i+1;b.setAttribute('aria-label',p.n);
    b.style.left=(p.pin[0]/IMGW*100)+'%';b.style.top=(p.pin[1]/IMGH*100)+'%';b.style.setProperty('--i',i);
    b.onclick=function(){stop();select(i)};pinsEl.appendChild(b);p.pinEl=b;
  });
  var lastG=-1;
  P.forEach(function(p,i){
    if(p.g!==lastG){var gh=document.createElement('li');gh.className='gh';gh.textContent=GROUPS[p.g];list.appendChild(gh);lastG=p.g}
    var li=document.createElement('li'),b=document.createElement('button');b.type='button';
    b.innerHTML='<i>'+pad(i+1)+'</i><span>'+p.n+'</span><em>'+(p.q?'×'+p.q:'')+'</em>';
    b.onclick=function(){stop();select(i)};li.appendChild(b);list.appendChild(li);p.btn=b;
  });
  /* part cards */
  var cardsEl=$('#sxGroups');
  GROUPS.forEach(function(gn,gi){
    var sec=document.createElement('div');sec.className='sx-grp';
    sec.innerHTML='<h3 class="reveal">'+gn+'<small>'+pad(gi+1)+'</small></h3><div class="sx-cards"></div>';
    var box=$('.sx-cards',sec);
    P.forEach(function(p,i){
      if(p.g!==gi)return;
      var c=document.createElement('button');c.type='button';c.className='sx-c';
      c.innerHTML='<div class="ph"><i></i></div><div class="tx"><span>'+p.n+'</span>'+(p.q?'<b>×'+p.q+'</b>':'')+'</div>';
      thumb($('.ph i',c),p.r);
      c.onclick=function(){stop();select(i);$('#sxExplore').scrollIntoView({behavior:'smooth',block:'start'})};
      box.appendChild(c);
    });
    cardsEl.appendChild(sec);
  });
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var cs=$$('.sx-c',e.target);cs.forEach(function(c,k){setTimeout(function(){c.classList.add('in')},k*90)});cio.unobserve(e.target)}})},{threshold:.15});
  $$('.sx-grp',cardsEl).forEach(function(g){cio.observe(g);});
  /* zoom + spotlight */
  var cur=-1;
  function apply(){
    var W=sheet.clientWidth,H=sheet.clientHeight;
    if(cur<0){inner.style.transform='translate(0,0) scale(1)';inner.style.setProperty('--inv',1);inner.classList.remove('on');return}
    var r=P[cur].r,cx=(r[0]+r[2]/2)/IMGW*W,cy=(r[1]+r[3]/2)/IMGH*H;
    var z=Math.max(1.5,Math.min(2.8,Math.min(IMGW/(r[2]*1.9),IMGH/(r[3]*1.9))));
    var tx=Math.min(0,Math.max(W-W*z,W/2-cx*z)),ty=Math.min(0,Math.max(H-H*z,H/2-cy*z));
    inner.style.transform='translate('+tx+'px,'+ty+'px) scale('+z+')';
    inner.style.setProperty('--inv',(1/z).toFixed(3));
    dim.style.setProperty('--sx',((r[0]+r[2]/2)/IMGW*100)+'%');dim.style.setProperty('--sy',((r[1]+r[3]/2)/IMGH*100)+'%');
    dim.style.setProperty('--rx',Math.max(r[2]*.75/IMGW*100,6)+'%');dim.style.setProperty('--ry',Math.max(r[3]*.75/IMGH*100,9)+'%');
    inner.classList.add('on');
  }
  function select(i){
    cur=i;
    P.forEach(function(p,k){p.pinEl.classList.toggle('cur',k===i);p.btn.classList.toggle('cur',k===i)});
    apply();
    var th=$('.sx-thumb',info),mt=$('.sx-meta',info);
    if(i<0){th.style.backgroundImage='none';th.style.aspectRatio='4/3';th.style.background='rgba(255,255,255,.08)';mt.innerHTML='<span class="no">總覽</span><h3>Shoresift v1.0</h3><p>共 '+P.length+' 項組成</p>';cnt.textContent='總覽'}
    else{var p=P[i];th.style.background='#fff';thumb(th,p.r);th.style.aspectRatio=p.r[2]+'/'+p.r[3];th.style.maxHeight='140px';
      mt.innerHTML='<span class="no">'+pad(i+1)+' / '+pad(P.length)+'</span><h3>'+p.n+'</h3><p>'+(p.q?'<b>×'+p.q+'</b> ・ ':'')+GROUPS[p.g]+'</p>';cnt.textContent=pad(i+1)+' / '+pad(P.length);
      var li=p.btn.closest('li');if(list.scrollWidth>list.clientWidth)list.scrollTo({left:li.offsetLeft-12,behavior:'smooth'});else{var t=li.offsetTop-list.offsetTop-80;list.scrollTo({top:t,behavior:'smooth'})}}
    info.classList.remove('swap');void info.offsetWidth;info.classList.add('swap');
  }
  /* auto tour */
  var timer=null,DUR=4200,playing=false;
  function runBar(){bar.classList.remove('run');void bar.offsetWidth;bar.style.setProperty('--dur',DUR+'ms');bar.classList.add('run')}
  function next(){select(cur>=P.length-1?-1:cur+1)}
  function start(){playing=true;play.textContent='❚❚ 暫停';tick()}
  function tick(){clearTimeout(timer);runBar();timer=setTimeout(function(){next();if(playing)tick()},cur<0?2600:DUR)}
  function stop(){playing=false;clearTimeout(timer);bar.classList.remove('run');bar.style.width='0';play.textContent='▶ 自動導覽'}
  play.onclick=function(){playing?stop():(cur<0&&select(0),start())};
  $('#sxPrev').onclick=function(){stop();select(cur<=0?P.length-1:cur-1)};
  $('#sxNext').onclick=function(){stop();next()};
  $('#sxAll').onclick=function(){stop();select(-1)};
  addEventListener('keydown',function(e){if(!document.querySelector('.page.active')||!$('#sxExplore').matches(':hover,:focus-within'))return;if(e.key==='ArrowRight'){stop();next()}else if(e.key==='ArrowLeft'){stop();$('#sxPrev').click()}else if(e.key==='Escape'){stop();select(-1)}});
  addEventListener('resize',apply);
  /* enter: pins pop in, then tour starts */
  var started=false;
  new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting&&!started){started=true;inner.classList.add('in');
      if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setTimeout(function(){if(cur<0&&!playing){select(0);start()}},1800)}
  })},{threshold:.45}).observe(sheet);
  /* hero card parallax */
  var card=$('.sx-card'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(card&&!still)addEventListener('scroll',function(){var y=scrollY;if(y<900)card.style.transform='translateY('+(y*.14).toFixed(1)+'px) rotate('+(y*.006).toFixed(2)+'deg)'},{passive:true});
  select(-1);
})();
