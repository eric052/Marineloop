/* Shoresift 產品頁：捲動驅動的產品介紹（依圖解內容製作） */
(function(){
  var IW=1600,IH=923,IMG='img/shoresift-machine.webp';
  var GROUPS=['動力與驅動','控制與供電','行走機構','進沙機構'];
  var P=[
    {n:'TT馬達',q:1,g:0,pin:[672,412],dot:[308,207],lab:[298,178,'l'],r:[630,340,140,130]},
    {n:'JAG 25-370 馬達',q:2,g:0,pin:[1100,497],dot:[1257,497],lab:[1272,497,'r'],r:[1015,450,150,120]},
    {n:'L298N 馬達驅動版',g:0,pin:[875,265],dot:[1235,265],lab:[1252,258,'r'],r:[760,205,140,100]},
    {n:'馬達架',q:2,g:0,pin:[807,153],dot:[1215,153],lab:[1232,153,'r'],r:[715,60,370,260]},
    {n:'樹莓派 4B 2G Ram',g:1,pin:[873,300],dot:[1235,300],lab:[1252,300,'r'],r:[700,280,200,140]},
    {n:'樹莓派18650供電模組',g:1,pin:[880,350],dot:[1235,350],lab:[1252,350,'r'],r:[715,270,170,130]},
    {n:'18650 5V / 12V供電模組',g:1,pin:[697,282],dot:[407,114],lab:[398,86,'l'],r:[600,220,170,130]},
    {n:'前輪',q:2,g:2,pin:[270,346],dot:[162,285],lab:[152,262,'l'],r:[225,300,190,150]},
    {n:'後驅動輪',q:2,g:2,pin:[1245,590],dot:[1345,590],lab:[1360,590,'r'],r:[1110,525,180,125]},
    {n:'履帶輪板架',q:2,g:2,pin:[1225,701],dot:[1318,701],lab:[1332,701,'r'],r:[1010,610,330,150]},
    {n:'履帶輪支撐柱',q:2,g:2,pin:[1115,713],dot:[1200,764],lab:[1214,776,'r'],r:[985,600,200,160]},
    {n:'裝置進沙口',g:3,pin:[607,497],dot:[376,497],lab:[364,497,'l'],r:[430,430,330,170]},
    {n:'雙螺旋進沙結構',g:3,pin:[590,750],dot:[645,777],lab:[658,790,'r'],r:[365,600,250,190]}
  ];
  var BBOX=[234,66,1100,765],N=P.length;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var scrolly=$('#sxStage');if(!scrolly)return;
  var pin=$('#sxPin'),world=$('#sxWorld'),shade=$('#sxShade'),hi=$('#sxHi'),box=$('#sxBox'),lines=$('#sxLines'),labs=$('#sxLabs'),pins=$('#sxPins'),title=$('#sxTitle'),hint=$('#sxHint'),cap=$('#sxCap'),rail=$('#sxRail');
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var NS='http://www.w3.org/2000/svg',pad=function(n){return (n<10?'0':'')+n},pct=function(v,t){return (v/t*100)+'%'};
  var clamp=function(x,a,b){return Math.max(a,Math.min(b,x))},sm=function(x){x=clamp(x,0,1);return x*x*(3-2*x)},lerp=function(a,b,t){return a+(b-a)*t};

  /* ---------- 圖上元素 ---------- */
  P.forEach(function(p,i){
    var g=document.createElementNS(NS,'g');g.style.setProperty('--i',i);
    var path=document.createElementNS(NS,'path');path.setAttribute('d','M'+p.dot[0]+' '+p.dot[1]+' L'+p.pin[0]+' '+p.pin[1]);path.setAttribute('pathLength','1');path.style.setProperty('--i',i);
    var c=document.createElementNS(NS,'circle');c.setAttribute('cx',p.dot[0]);c.setAttribute('cy',p.dot[1]);c.setAttribute('r',4);
    g.appendChild(path);g.appendChild(c);lines.appendChild(g);p.lineEl=g;
    var l=document.createElement('div');l.className='sx-lab';l.style.left=pct(p.lab[0],IW);l.style.top=pct(p.lab[1],IH);l.style.transform='translate('+(p.lab[2]==='l'?'-100%':'0')+',-50%)';
    l.innerHTML='<i>'+pad(i+1)+'</i><span>'+p.n+'</span>'+(p.q?'<em>×'+p.q+'</em>':'');labs.appendChild(l);p.labEl=l;
    var d=document.createElement('div');d.className='sx-pin-dot';d.textContent=i+1;d.style.left=pct(p.pin[0],IW);d.style.top=pct(p.pin[1],IH);pins.appendChild(d);p.dotEl=d;
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',pad(i+1)+' '+p.n);b.onclick=function(){goPart(i)};rail.appendChild(document.createElement('li')).appendChild(b);p.railEl=b;
  });

  /* ---------- 版面與關鍵影格 ---------- */
  var vw,vh,Wd,Hd,L,T,mobile,K=[],unit=600,top0=0;
  function layout(){
    vw=pin.clientWidth;vh=pin.clientHeight;mobile=vw<900;
    Wd=Math.min(vw,vh*(mobile?.8:.86)*IW/IH);Hd=Wd*IH/IW;L=(vw-Wd)/2;T=(vh-Hd)/2;
    world.style.width=Wd+'px';world.style.height=Hd+'px';world.style.left=L+'px';world.style.top=T+'px';
    K=[];
    K.push({z:mobile?1.5:1.22,cx:784,cy:448,ox:0,oy:mobile?.34:.42,r:BBOX,s:0});                  /* 0 開場 */
    K.push({z:mobile?1.36:1.0,cx:784,cy:448,ox:0,oy:mobile?-.04:.02,r:BBOX,s:0});                  /* 1 總覽 */
    P.forEach(function(p){
      var r=p.r,rw=r[2]*Wd/IW,rh=r[3]*Hd/IH;
      var z=clamp(Math.min((mobile?.8:.3)*vw/rw,(mobile?.28:.42)*vh/rh),1.25,mobile?3.4:2.5);
      K.push({z:z,cx:r[0]+r[2]/2,cy:r[1]+r[3]/2,ox:mobile?0:.15,oy:mobile?-.17:0,r:r,s:.64});
    });
    K.push({z:mobile?1.36:1.0,cx:784,cy:448,ox:0,oy:mobile?-.04:.02,r:BBOX,s:0});                  /* 末 總覽 */
    unit=(mobile?.5:.62)*vh;
    if(still){scrolly.style.height='auto';pin.style.position='relative';pin.style.height=Math.round(vh*.9)+'px'}
    else scrolly.style.height=((K.length-1)*unit+vh)+'px';
    top0=scrolly.getBoundingClientRect().top+scrollY;
    update(true);
  }

  /* ---------- 逐幀更新 ---------- */
  var activeIdx=-2,drawn=false,lastQ=-1;
  function camAt(q){
    var i=Math.min(K.length-2,Math.max(0,Math.floor(q))),t=q-i,e=sm((t-.28)/.66);
    return {i:i,e:e,eq:i+e,a:K[i],b:K[i+1]};
  }
  function update(force){
    var q=still?1:clamp((scrollY-top0)/unit,0,K.length-1);
    if(!force&&Math.abs(q-lastQ)<.0004)return;lastQ=q;
    var c=camAt(q),a=c.a,b=c.b,e=c.e,eq=c.eq;
    var z=a.z*Math.pow(b.z/a.z,e),cx=lerp(a.cx,b.cx,e),cy=lerp(a.cy,b.cy,e),ox=lerp(a.ox,b.ox,e),oy=lerp(a.oy,b.oy,e);
    var tx=vw*(.5+ox)-L-cx*Wd/IW*z,ty=vh*(.5+oy)-T-cy*Hd/IH*z;
    world.style.transform='translate3d('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px,0) scale('+z.toFixed(4)+')';
    world.style.setProperty('--inv',(1/z).toFixed(4));
    var r=[0,1,2,3].map(function(k){return lerp(a.r[k],b.r[k],e)}),s=lerp(a.s,b.s,e);
    var sx=(r[0]+r[2]/2)/IW*100,sy=(r[1]+r[3]/2)/IH*100;
    world.style.setProperty('--sx',sx+'%');world.style.setProperty('--sy',sy+'%');
    world.style.setProperty('--rx',Math.max(r[2]*.8/IW*100,6)+'%');world.style.setProperty('--ry',Math.max(r[3]*.8/IH*100,9)+'%');
    shade.style.opacity=s;hi.style.opacity=s>0.02?1:0;
    box.style.left=pct(r[0],IW);box.style.top=pct(r[1],IH);box.style.width=pct(r[2],IW);box.style.height=pct(r[3],IH);box.style.opacity=clamp(s/.5,0,1);
    /* 標題 */
    var to=1-sm(eq/.75);title.style.opacity=to;title.style.transform='translateY('+(-eq*70).toFixed(1)+'px) scale('+(1-eq*.04).toFixed(3)+')';
    hint.style.opacity=1-sm(eq/.35);
    /* 總覽：全部引線與標籤 */
    var overW=Math.max(0,1-Math.min(Math.abs(eq-1),Math.abs(eq-(K.length-1)))*1.7);
    if(!drawn&&eq>.65){drawn=true;lines.classList.add('drawn')}
    var act=-1,best=9;
    P.forEach(function(p,i){
      var d=Math.abs(eq-(i+2)),w=clamp(1-d*2.2,0,1);if(d<best){best=d;act=i}
      var o=Math.max(overW,w);
      p.lineEl.style.opacity=overW;p.lineEl.classList.toggle('cur',false);
      p.labEl.style.opacity=overW;p.dotEl.style.opacity=o;
      p.dotEl.style.background=w>.5&&overW<.3?'#fff':'rgba(0,0,0,.45)';p.dotEl.style.color=w>.5&&overW<.3?'#000':'#fff';
    });
    /* 說明文字 */
    var capW,name,meta,no;
    if(overW>.35&&(eq<2.4||eq>K.length-2.6)){capW=overW;name='爆炸圖';meta='共 '+N+' 項組成';no='EXPLODED VIEW';act=-1}
    else{capW=clamp(1-(best-.1)/.32,0,1);var p=P[act];name=p.n;meta=(p.q?'<b>×'+p.q+'</b>　':'')+GROUPS[p.g];no=pad(act+1)+' / '+pad(N)}
    var key=act+'|'+(overW>.35&&(eq<2.4||eq>K.length-2.6));
    if(key!==activeIdx){activeIdx=key;$('.no',cap).textContent=no;$('h2',cap).textContent=name;$('p',cap).innerHTML=meta}
    cap.style.opacity=capW;cap.style.transform=(mobile?'':'translateY(-50%) ')+'translateY('+((1-capW)*18).toFixed(1)+'px)';
    var inParts=eq>1.6&&eq<K.length-1.6;rail.classList.toggle('show',inParts&&!mobile);
    P.forEach(function(p,i){p.railEl.classList.toggle('on',i===act&&inParts)});
  }
  function goPart(i){var y=top0+(i+2+.12)*unit;scrollTo({top:y,behavior:still?'auto':'smooth'})}
  var sub=$('.sx-sub'),navEl=document.getElementById('nav');
  function syncSub(){if(!sub||!navEl)return;sub.style.top=(navEl.classList.contains('hide')?0:navEl.offsetHeight)+'px'}
  var ticking=false;
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;update(false);words();syncSub()})}},{passive:true});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120)});

  /* ---------- 逐字點亮 ---------- */
  var stmt=$('#sxStmt p'),wordEls=[];
  if(stmt){var t=stmt.textContent;stmt.textContent='';[].forEach.call(t,function(ch){var s=document.createElement('span');s.className='w';s.textContent=ch;stmt.appendChild(s);wordEls.push(s)})}
  function words(){
    if(!stmt)return;var r=stmt.getBoundingClientRect(),h=innerHeight;
    var p=still?1:clamp((h*.82-r.top)/(r.height+h*.32),0,1),n=Math.round(p*wordEls.length*1.04);
    for(var i=0;i<wordEls.length;i++){var on=i<n;if(wordEls[i]._on!==on){wordEls[i]._on=on;wordEls[i].classList.toggle('on',on)}}
  }

  /* ---------- 特色卡片、零件牆 ---------- */
  function crop(host,r,pad){ /* 以背景圖裁出局部，host 需有固定比例 */
    var i=document.createElement('i');host.appendChild(i);
    var pw=r[2]*pad,ph=r[3]*pad,x=clamp(r[0]+r[2]/2-pw/2,0,IW-pw),y=clamp(r[1]+r[3]/2-ph/2,0,IH-ph);
    i.style.backgroundImage='url('+IMG+')';i.style.backgroundSize=(IW/pw*100)+'% '+(IH/ph*100)+'%';
    i.style.backgroundPosition=(IW-pw?x/(IW-pw)*100:0)+'% '+(IH-ph?y/(IH-ph)*100:0)+'%';
    return {w:pw,h:ph};
  }
  $$('.sx-f').forEach(function(f){var r=JSON.parse(f.dataset.r),ph=$('.ph',f),d=crop(ph,r,1);ph.style.setProperty('--ar',d.w/d.h)});
  var fio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');fio.unobserve(e.target)}})},{threshold:.15});
  $$('.sx-f').forEach(function(f){fio.observe(f)});
  var wall=$('#sxCards');
  P.forEach(function(p,i){
    var c=document.createElement('button');c.type='button';c.className='sx-c';
    c.innerHTML='<div class="ph"><span class="no">'+pad(i+1)+'</span></div><div class="tx"><span>'+p.n+'</span>'+(p.q?'<b>×'+p.q+'</b>':'')+'</div>';
    crop($('.ph',c),p.r,1.55);
    c.onclick=function(){goPart(i)};wall.appendChild(c);
  });
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('.sx-c',e.target).forEach(function(c,k){setTimeout(function(){c.classList.add('in')},k*60)});cio.unobserve(e.target)}})},{threshold:.1});
  cio.observe(wall);

  /* 區域子選單 */
  $$('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var el=document.getElementById(a.dataset.go);if(el)scrollTo({top:el.getBoundingClientRect().top+scrollY-(a.dataset.go==='sxStage'?0:50),behavior:still?'auto':'smooth'})})});
  document.body.classList.add('sx-page');
  /* 數字滾動交給主程式，這裡只需等圖片載入後重新量版面 */
  syncSub();layout();
  addEventListener('load',layout);
  var img=$('img.base',world);if(img&&!img.complete)img.addEventListener('load',layout);
})();
