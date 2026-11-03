(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var coarse=matchMedia('(pointer:coarse)').matches||innerWidth<821;

  /* ---- images ---- */
  $$('img[data-img]').forEach(function(im){
    var k=im.dataset.img;
    im.referrerPolicy='no-referrer';
    if(k!=='logo')im.loading='lazy';
    im.addEventListener('error',function(){var m=/drive\.google\.com\/uc\?export=view&id=([\w-]+)/.exec(im.src);if(m&&!im.dataset.retry){im.dataset.retry=1;im.src='https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1600';return}
      if(k==='logo'){var l=im.parentElement;l.classList.add('fallback');im.remove()}
      else{im.style.display='none';var f=im.closest('figure');if(f)f.classList.add('broken')}
    });
    im.src=IMG[k];
  });
  var fav=document.createElement('link');fav.rel='icon';fav.href='data:image/png;base64,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';document.head.appendChild(fav);

  /* ---- headline split ---- */
  $$('.split').forEach(function(h){
    var t=h.dataset.t,br=+h.dataset.br||0,i=0;h.textContent='';h.setAttribute('aria-label',t);
    t.split(' ').forEach(function(w,wi,arr){
      var ws=document.createElement('span');ws.className='word';ws.setAttribute('aria-hidden','true');
      [].forEach.call(w,function(c){
        var s=document.createElement('span');s.className='ch';s.style.setProperty('--i',i++);s.textContent=c;ws.appendChild(s);
        if(br&&i===br){h.appendChild(ws);ws=document.createElement('span');ws.className='word';ws.setAttribute('aria-hidden','true');var b=document.createElement('br');b.className='mbr';h.appendChild(b)}
      });
      h.appendChild(ws);
      if(wi<arr.length-1){h.appendChild(document.createTextNode(' '));i++}
    });
  });

  /* ---- scroll ui ---- */
  var nav=$('#nav'),prog=$('#progress');
  function onScroll(){
    var y=scrollY,m=document.documentElement.scrollHeight-innerHeight;
    prog.style.transform='scaleX('+(m>0?y/m:0)+')';
    nav.classList.toggle('solid',y>40);
  }
  addEventListener('scroll',onScroll,{passive:true});

  /* ---- reveal / counters ---- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  $$('.entry,.reveal,#bar,.gallery,.card,.contact').forEach(function(el){io.observe(el)});
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    var el=e.target,to=+el.dataset.to,d=+el.dataset.dec,st=performance.now(),dur=2000;
    (function f(n){var p=Math.min((n-st)/dur,1),v=to*(1-Math.pow(1-p,4));el.textContent=v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});if(p<1)requestAnimationFrame(f)})(st);
  })},{threshold:.6});
  $$('.count').forEach(function(el){cio.observe(el)});

  /* ---- parallax (desktop only) ---- */
  if(!still&&!coarse){
    var figs=$$('.entry figure');
    addEventListener('scroll',function(){
      figs.forEach(function(f){var r=f.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;f.style.transform='translateY('+(((r.top+r.height/2-innerHeight/2)/innerHeight)*-22).toFixed(1)+'px)'});
    },{passive:true});
  }

  /* ---- mobile menu ---- */
  var burger=$('#burger');
  function menu(open){document.body.classList.toggle('menu',open);document.body.classList.toggle('lock',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'關閉選單':'開啟選單')}
  burger.addEventListener('click',function(){menu(!document.body.classList.contains('menu'))});
  addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
  addEventListener('resize',function(){if(innerWidth>760)menu(false)});

  /* ---- router ---- */
  var pages={};$$('.page').forEach(function(p){pages[p.dataset.page]=p});var FIRST=$('.page').dataset.page;
  var current=null,busy=false,curtain=$('#curtain');
  function routeOf(){var h=location.hash.replace(/^#\/?/,'').split(/[?&]/)[0];return pages[h]?h:FIRST}
  function show(r){
    if(current)pages[current].classList.remove('active');
    pages[r].classList.add('active');current=r;
    document.title=pages[r].dataset.title;
    $$('[data-r]').forEach(function(a){a.classList.toggle('on',a.dataset.r===r)});
    scrollTo(0,0);onScroll();
    if(r==='home')sim.resize();
  }
  function transition(r){
    if(r===current){scrollTo({top:0});return}
    if(!current||still||busy||!curtain.animate){show(r);return}
    busy=true;curtain.style.visibility='visible';
    var ease='cubic-bezier(.7,0,.2,1)';
    try{curtain.animate([{transform:'translateY(calc(100% + 60px))'},{transform:'translateY(0)'}],{duration:520,easing:ease,fill:'forwards'})}catch(e){}
    setTimeout(function(){
      show(r);
      try{curtain.animate([{transform:'translateY(0)'},{transform:'translateY(calc(-100% - 60px))'}],{duration:620,easing:ease,delay:120,fill:'forwards'})}catch(e){}
      setTimeout(function(){try{curtain.getAnimations().forEach(function(x){x.cancel()})}catch(e){}curtain.style.visibility='hidden';busy=false},800);
    },540);
    setTimeout(function(){busy=false;curtain.style.visibility='hidden'},2500);
  }
  function go(){menu(false);transition(routeOf())}
  /* 直接攔截點擊，不依賴瀏覽器的 hash 事件（在預覽視窗中也能換頁） */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#/"]');
    if(!a)return;
    e.preventDefault();
    var h=a.getAttribute('href'),r=h.replace(/^#\/?/,'');if(!pages[r])r=FIRST;
    try{history.pushState(null,'',h)}catch(x){try{location.hash=h}catch(y){}}
    menu(false);transition(r);
  });
  addEventListener('hashchange',go);
  addEventListener('popstate',go);

  /* ---- hero: sifting simulation ---- */
  var cv=$('#sand')||document.createElement('canvas'),hero=$('#top')||document.createElement('div'),ctx=cv.getContext('2d');
  var W,H,dpr,cols,heights,parts=[],mouse={x:-999,y:-999},COL=4,y0,slope,running=true,MAXP=coarse?520:1100;
  var plastics=['#ff6b57','#f4f1ea','#8791ff','#ffb454','#7aa8ff'];
  function sieveY(x){return y0+slope*x}
  var sim={resize:function(){
    if(!hero.clientWidth)return;
    dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    cols=Math.ceil(W/COL)+2;heights=new Float32Array(cols);
    y0=H*(W<640?.6:.56);slope=(H*(W<640?.09:.12))/W;parts.length=0;
    for(var s=0;s<(coarse?200:260);s++)step();draw();
  }};
  function spawn(){
    var n=Math.max(2,Math.round(W/(coarse?200:380)));
    for(var i=0;i<n&&parts.length<MAXP;i++)parts.push({x:Math.random()*W,y:-6,vx:(Math.random()-.5)*.25,vy:1.2+Math.random()*1.4,r:.9+Math.random()*1.3,p:false});
    if(Math.random()<(coarse?.08:.11))parts.push({x:W*(.05+Math.random()*.85),y:-8,vx:(Math.random()-.5)*.3,vy:1+Math.random()*.8,r:(coarse?2.4:2.6)+Math.random()*3,p:true,c:plastics[(Math.random()*plastics.length)|0],caught:false,rot:Math.random()*6.28,vr:(Math.random()-.5)*.08});
  }
  function addSand(x){var i=(x/COL)|0,cap=H*.15;if(i<1||i>=cols-1||heights[i]>cap)return;heights[i]+=.9;heights[i-1]+=.35;heights[i+1]+=.35}
  function step(){
    spawn();
    var R=coarse?5200:9000;
    for(var k=parts.length-1;k>=0;k--){
      var p=parts[k],dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;
      if(d2<R){var f=(1-d2/R)*.9,d=Math.sqrt(d2+1);p.vx+=dx/d*f;p.vy+=dy/d*f*.6}
      if(p.p&&p.caught){p.vx=Math.min(p.vx+.03,1.7);p.x+=p.vx;p.y=sieveY(p.x)-p.r;p.rot+=.05;if(p.x>W+12)parts.splice(k,1);continue}
      p.vx*=.985;p.x+=p.vx;p.y+=p.vy;if(p.vy<3.4)p.vy+=.012;if(p.p)p.rot+=p.vr||0;
      if(p.p&&!p.caught&&p.y+p.r>=sieveY(p.x)&&p.y<sieveY(p.x)+8){p.caught=true;p.vx=.3+Math.random()*.4;p.y=sieveY(p.x)-p.r}
      if(!p.p){
        if(Math.abs(p.y-sieveY(p.x))<2)p.vx+=(Math.random()-.5)*.35;
        var gi=(p.x/COL)|0;
        if(gi>=0&&gi<cols&&p.y>=H-heights[gi]-1){addSand(p.x);parts.splice(k,1);continue}
      }
      if(p.x<-20||p.x>W+20||p.y>H+10)parts.splice(k,1);
    }
    for(var i=1;i<cols-1;i++){var a=heights[i],b=heights[i+1];if(a-b>3.2){heights[i]-=.4;heights[i+1]+=.4}else if(b-a>3.2){heights[i]+=.4;heights[i+1]-=.4}}
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(135,145,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,sieveY(0));ctx.lineTo(W,sieveY(W));ctx.stroke();
    ctx.strokeStyle='rgba(135,145,255,.22)';ctx.lineWidth=1;ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(0,sieveY(0)+6);ctx.lineTo(W,sieveY(W)+6);ctx.stroke();ctx.setLineDash([]);
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      if(p.p){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;ctx.beginPath();ctx.moveTo(-p.r,-p.r*.6);ctx.lineTo(p.r*1.1,-p.r*.3);ctx.lineTo(p.r*.5,p.r);ctx.lineTo(-p.r*.9,p.r*.7);ctx.closePath();ctx.fill();ctx.restore()}
      else{ctx.fillStyle='rgba(216,199,156,.8)';ctx.fillRect(p.x,p.y,p.r,p.r)}
    }
    var g=ctx.createLinearGradient(0,H*.8,0,H);g.addColorStop(0,'#e3d3a6');g.addColorStop(1,'#a89463');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H);for(var j=0;j<cols;j++)ctx.lineTo(j*COL,H-heights[j]);ctx.lineTo(W+COL*2,H);ctx.closePath();ctx.fill();
  }
  function setMouse(e){var r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top}
  hero.addEventListener('pointermove',setMouse);
  hero.addEventListener('pointerdown',setMouse);
  ['pointerleave','pointerup','pointercancel'].forEach(function(n){hero.addEventListener(n,function(){mouse.x=mouse.y=-999})});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(current==='home')sim.resize()},200)});
  new IntersectionObserver(function(es){running=es[0].isIntersecting}).observe(hero);
  function loop(){if(running&&current==='home'&&!document.hidden){step();draw()}requestAnimationFrame(loop)}


  /* ===== extra motion ===== */
  /* bubbles */
  $$('.bubbles').forEach(function(b){
    for(var i=0;i<12;i++){var e=document.createElement('i'),sz=6+Math.random()*26;
      e.style.cssText='left:'+(Math.random()*100)+'%;width:'+sz+'px;height:'+sz+'px;animation-duration:'+(9+Math.random()*12)+'s;animation-delay:'+(-Math.random()*18)+'s;--dx:'+((Math.random()-.5)*80)+'px';
      b.appendChild(e)}
  });
  /* cursor glow (desktop) */
  var glow=$('#glow');
  if(!coarse&&!still){
    var gx=0,gy=0,tx=0,ty=0;
    addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;glow.classList.add('on')},{passive:true});
    document.addEventListener('pointerleave',function(){glow.classList.remove('on')});
    (function gl(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;glow.style.transform='translate('+gx+'px,'+gy+'px)';requestAnimationFrame(gl)})();
  }
  /* magnetic buttons */
  if(!coarse&&!still)$$('.cta').forEach(function(c){
    c.classList.add('mag');
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)'});
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
  /* tilt cards */
  if(!coarse&&!still)$$('.tilt').forEach(function(t){
    t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.classList.add('moving');t.style.transform='perspective(800px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg) scale(1.02)'});
    t.addEventListener('pointerleave',function(){t.classList.remove('moving');t.style.transform=''});
  });
  /* timeline rail drop + hero parallax */
  var rail=$('.rail'),rb=rail&&$('b',rail),hc=$('.hero-copy');
  function motion(){
    var y=scrollY;
    if(rail&&current==='home'&&rail.offsetHeight){
      var rr=rail.getBoundingClientRect(),p=(innerHeight*.5-rr.top)/rr.height;p=Math.max(0,Math.min(1,p));
      rb.style.setProperty('--ry',(p*(rr.height-12))+'px');
    }
    if(hc&&current==='home'&&y<innerHeight&&!still){hc.style.transform='translateY('+(y*.25)+'px)';hc.style.opacity=Math.max(0,1-y/(innerHeight*.75))}
  }
  addEventListener('scroll',motion,{passive:true});

  var tt=$('#totop');if(tt)tt.addEventListener('click',function(){scrollTo({top:0,behavior:still?'auto':'smooth'})});

  var lastY=0;
  addEventListener('scroll',function(){var y=scrollY,n=$('#nav');if(!n||document.body.classList.contains('menu'))return;if(y>240&&y>lastY+4)n.classList.add('hide');else if(y<lastY-4||y<240)n.classList.remove('hide');lastY=y},{passive:true});

  /* ---- multi-page navigation (curtain between separate html files) ---- */
  (function(){
    var ease='cubic-bezier(.7,0,.2,1)',cu=$('#curtain');
    var arrive=false;try{arrive=sessionStorage.getItem('ml-nav')==='1';sessionStorage.removeItem('ml-nav')}catch(e){}
    var root=document.documentElement;
    if(arrive&&!still&&cu&&cu.animate){
      var a=cu.animate([{transform:'translateY(0)'},{transform:'translateY(calc(-100% - 60px))'}],{duration:700,easing:ease,delay:80,fill:'forwards'});
      a.onfinish=function(){root.classList.remove('arriving');try{a.cancel()}catch(e){}};
      setTimeout(function(){root.classList.remove('arriving')},1200);
    }else root.classList.remove('arriving');
    addEventListener('pageshow',function(e){if(e.persisted){root.classList.remove('arriving');try{cu.getAnimations().forEach(function(x){x.cancel()})}catch(x){}}});
    document.addEventListener('click',function(e){
      var l=e.target.closest&&e.target.closest('a[href$=".html"]');
      if(!l||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||l.target==='_blank')return;
      var href=l.getAttribute('href');if(/^https?:/.test(href))return;
      var ap=document.querySelector('.page.active');
      if(ap&&l.dataset.r&&l.dataset.r===ap.dataset.page){e.preventDefault();scrollTo({top:0,behavior:still?'auto':'smooth'});return}
      if(still||!cu||!cu.animate)return;
      e.preventDefault();
      try{sessionStorage.setItem('ml-nav','1')}catch(x){}
      root.classList.add('arriving');
      cu.animate([{transform:'translateY(calc(100% + 60px))'},{transform:'translateY(0)'}],{duration:520,easing:ease,fill:'forwards'});
      setTimeout(function(){location.href=href},560);
    });
  })();

  /* ---- intro splash ---- */
  (function(){
    var it=$('#intro'),seen=false;try{seen=sessionStorage.getItem('ml-intro')==='1'}catch(e){}
    if(!it)return;
    if(still||seen||(window.__ED__)){it.remove();return}
    document.body.classList.add('pre');
    try{sessionStorage.setItem('ml-intro','1')}catch(e){}
    setTimeout(function(){it.classList.add('out');document.body.classList.remove('pre');setTimeout(function(){it.remove()},1100)},1900);
  })();

  /* ---- boot ---- */
  show(routeOf());
  if(!still)loop();
})();
