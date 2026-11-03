/* Shoresift 產品頁：向量機體 + 捲動驅動（組裝 → 拆解 → 逐一聚焦） */
(function(){
  var GROUPS=['動力與驅動','控制與供電','行走機構','進沙機構'];
  var P=[
    {n:'TT馬達',q:1,g:0},{n:'JAG 25-370 馬達',q:2,g:0},{n:'L298N 馬達驅動版',g:0},{n:'馬達架',q:2,g:0},
    {n:'樹莓派 4B 2G Ram',g:1},{n:'樹莓派18650供電模組',g:1},{n:'18650 5V / 12V供電模組',g:1},
    {n:'前輪',q:2,g:2},{n:'後驅動輪',q:2,g:2},{n:'履帶輪板架',q:2,g:2},{n:'履帶輪支撐柱',q:2,g:2},
    {n:'裝置進沙口',g:3},{n:'雙螺旋進沙結構',g:3}
  ];
  var N=P.length;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var scrolly=$('#sxStage');if(!scrolly||!window.SXMACHINE)return;
  var lines=$('#sxLines'),pin=$('#sxPin'),svg=$('#sxSvg'),cam,title=$('#sxTitle'),hint=$('#sxHint'),cap=$('#sxCap'),rail=$('#sxRail'),labs=$('#sxLabs'),box=$('#sxBox'),shadow;
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var NS='http://www.w3.org/2000/svg',pad=function(n){return (n<10?'0':'')+n};
  var clamp=function(x,a,b){return Math.max(a,Math.min(b,x))},sm=function(x){x=clamp(x,0,1);return x*x*(3-2*x)},lerp=function(a,b,t){return a+(b-a)*t};

  /* ---------- 建立向量機體 ---------- */
  var G=SXMACHINE.groups;
  svg.innerHTML='<defs><radialGradient id="sxsh"><stop offset="0" stop-color="#000a50" stop-opacity=".55"/><stop offset="1" stop-color="#000a50" stop-opacity="0"/></radialGradient></defs><g id="sxCam"></g>';
  cam=$('#sxCam');
  shadow=document.createElementNS(NS,'ellipse');shadow.setAttribute('fill','url(#sxsh)');cam.appendChild(shadow);
  G.forEach(function(o){var el=document.createElementNS(NS,'g');el.setAttribute('class','mg');el.innerHTML=o.inner;cam.appendChild(el);o.el=el});
  P.forEach(function(p,i){
    p.groups=G.filter(function(o){return o.p===i});
    var ln=document.createElementNS(NS,'path');ln.setAttribute('fill','none');ln.setAttribute('stroke','rgba(255,255,255,.55)');ln.setAttribute('stroke-width','1');lines.appendChild(ln);p.line=ln;
    var l=document.createElement('div');l.className='sx-lab';l.innerHTML='<i>'+pad(i+1)+'</i><span>'+p.n+'</span>'+(p.q?'<em>×'+p.q+'</em>':'');labs.appendChild(l);p.lab=l;
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',pad(i+1)+' '+p.n);b.onclick=function(){goPart(i)};rail.appendChild(document.createElement('li')).appendChild(b);p.rail=b;
  });
  function bbOf(list,ex){
    var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    list.forEach(function(o){var dx=o.dx*ex,dy=o.dy*ex;x0=Math.min(x0,o.bb[0]+dx);y0=Math.min(y0,o.bb[1]+dy);x1=Math.max(x1,o.bb[2]+dx);y1=Math.max(y1,o.bb[3]+dy)});
    return [x0,y0,x1,y1];
  }
  var ALL=G.filter(function(o){return true});

  /* ---------- 版面與關鍵影格 ---------- */
  var vw,vh,mobile,K=[],unit=600,top0=0;
  function fit(bb,fx,fy){return Math.min(fx*vw/(bb[2]-bb[0]),fy*vh/(bb[3]-bb[1]))}
  function frame(bb,s,ox,oy,ex,part,shade){return {cx:(bb[0]+bb[2])/2,cy:(bb[1]+bb[3])/2,s:s,ox:ox,oy:oy,ex:ex,part:part,shade:shade,bb:bb}}
  function layout(){
    vw=pin.clientWidth;vh=pin.clientHeight;mobile=vw<900;
    svg.setAttribute('viewBox','0 0 '+vw+' '+vh);
    var A=bbOf(ALL,0),E=bbOf(ALL,1);
    K=[];
    K.push(frame(A,fit(A,mobile?.9:.58,mobile?.3:.44),0,mobile?.27:.27,0,-1,0));                          /* 0 開場（組裝） */
    var lw=0;P.forEach(function(p){lw=Math.max(lw,p.lab.offsetWidth)});
    var fxo=mobile?.88:clamp((vw-2*(lw+58))/vw,.34,.6);
    var so=fit(E,fxo,mobile?.46:.56);
    K.push(frame(E,so,0,mobile?-.04:.11,1,-1,0));                                                           /* 1 拆解總覽 */
    P.forEach(function(p,i){
      var bb=bbOf(p.groups,1),pw=bb[2]-bb[0],ph=bb[3]-bb[1];
      var s=clamp(Math.min((mobile?.8:.3)*vw/pw,(mobile?.28:.4)*vh/ph),so*1.5,so*7);
      K.push(frame(bb,s,mobile?0:.16,mobile?-.17:0,1,i,1));
    });
    K.push(frame(A,fit(A,mobile?1.02:.62,mobile?.34:.5),0,mobile?.04:.02,0,-1,0));                         /* 末 重新組裝 */
    unit=(mobile?.5:.62)*vh;
    if(still){scrolly.style.height='auto';pin.style.position='relative';pin.style.height=Math.round(vh*.9)+'px'}
    else scrolly.style.height=((K.length-1)*unit+vh)+'px';
    top0=scrolly.getBoundingClientRect().top+scrollY;
    update(true);
  }

  /* ---------- 逐幀更新 ---------- */
  var lastQ=-1,activeKey='',curS=1,curTx=0,curTy=0;
  function camAt(q){var i=Math.min(K.length-2,Math.max(0,Math.floor(q))),t=q-i,e=sm((t-.28)/.66);return {i:i,e:e,eq:i+e,a:K[i],b:K[i+1]}}
  function update(force){
    var q=still?1:clamp((scrollY-top0)/unit,0,K.length-1);
    if(!force&&Math.abs(q-lastQ)<.0004)return;lastQ=q;
    var c=camAt(q),a=c.a,b=c.b,e=c.e,eq=c.eq;
    var ex=lerp(a.ex,b.ex,e),s=a.s*Math.pow(b.s/a.s,e),cx=lerp(a.cx,b.cx,e),cy=lerp(a.cy,b.cy,e),ox=lerp(a.ox,b.ox,e),oy=lerp(a.oy,b.oy,e),sh=lerp(a.shade,b.shade,e);
    var tx=vw*(.5+ox)-cx*s,ty=vh*(.5+oy)-cy*s;curS=s;curTx=tx;curTy=ty;
    cam.setAttribute('transform','translate('+tx.toFixed(2)+' '+ty.toFixed(2)+') scale('+s.toFixed(4)+')');
    /* 各零件位置與淡化 */
    G.forEach(function(o){
      o.el.setAttribute('transform','translate('+(o.dx*ex).toFixed(2)+' '+(o.dy*ex).toFixed(2)+')');
      var w=0;if(o.p>=0){w=(a.part===o.p?1-e:0)+(b.part===o.p?e:0)}
      o.el.style.opacity=o.p<0?(1-sh*.78).toFixed(3):(1-sh*(1-clamp(w,0,1))*.82).toFixed(3);
    });
    var ac=proj0(.5*(K[0].bb[0]+K[0].bb[2]),0);
    shadow.setAttribute('cx',(K[0].cx+0).toFixed(1));shadow.setAttribute('cy',(K[0].bb[3]-8+ex*30).toFixed(1));
    shadow.setAttribute('rx',(96+ex*70).toFixed(1));shadow.setAttribute('ry',(34+ex*26).toFixed(1));
    /* 標題 */
    title.style.opacity=1-sm(eq/.7);title.style.transform='translateY('+(-eq*70).toFixed(1)+'px) scale('+(1-eq*.04).toFixed(3)+')';
    hint.style.opacity=1-sm(eq/.35);
    /* 總覽標籤 */
    var overW=Math.max(0,1-Math.min(Math.abs(eq-1),Math.abs(eq-(K.length-1)))*1.7);
    if(eq>K.length-2.2)overW=0;
    var pos=[],sb=bbOf(ALL,ex),L0=tx+sb[0]*s,R0=tx+sb[2]*s;
    P.forEach(function(p,i){var bb=bbOf(p.groups,ex),px=tx+(bb[0]+bb[2])/2*s,py=ty+(bb[1]+bb[3])/2*s;pos.push({i:i,x:px,y:py,left:px<(L0+R0)/2})});
    [true,false].forEach(function(side){
      var arr=pos.filter(function(o){return o.left===side}).sort(function(m,n){return m.y-n.y}),last=-1e9;
      arr.forEach(function(o){var y=Math.max(o.y,last+26);o.ly=y;last=y});
      var over=last-(vh-60);if(over>0)arr.forEach(function(o){o.ly-=over});
    });
    var show=overW>.02&&!mobile;
    pos.forEach(function(o){var p=P[o.i],l=p.lab;
      if(!show){l.style.opacity=0;p.line.style.opacity=0;return}
      var lx=o.left?Math.max(24,L0-30):Math.min(vw-24,R0+30);l.classList.toggle('r',o.left);
      l.style.transform='translate('+(o.left?'calc(-100% + '+lx+'px)':lx+'px')+','+(o.ly-8)+'px)';l.style.opacity=overW;
      var ex1=o.left?lx+4:lx-4;p.line.setAttribute('d','M'+ex1.toFixed(1)+' '+o.ly.toFixed(1)+' L'+(o.left?lx+22:lx-22).toFixed(1)+' '+o.ly.toFixed(1)+' L'+o.x.toFixed(1)+' '+o.y.toFixed(1));
      p.line.style.opacity=overW;
    });
    /* 聚焦框與說明 */
    var fb=[0,1,2,3].map(function(k){return lerp(a.bb[k],b.bb[k],e)});
    var pad2=10;
    box.style.transform='translate('+(tx+fb[0]*s-pad2).toFixed(1)+'px,'+(ty+fb[1]*s-pad2).toFixed(1)+'px)';
    box.style.width=((fb[2]-fb[0])*s+pad2*2).toFixed(1)+'px';box.style.height=((fb[3]-fb[1])*s+pad2*2).toFixed(1)+'px';
    box.style.opacity=clamp((sh-.3)/.5,0,1);
    var act=-1,best=9;
    P.forEach(function(p,i){var d=Math.abs(eq-(i+2));if(d<best){best=d;act=i}});
    var capW,name,meta,no,isOver=overW>.35&&(eq<2.4||eq>K.length-2.6);
    if(isOver){capW=overW;name=eq>K.length-3?'Shoresift v1.0':'爆炸圖';meta='共 '+N+' 項組成';no=eq>K.length-3?'ASSEMBLED':'EXPLODED VIEW';act=-1}
    else{capW=clamp(1-(best-.1)/.32,0,1);var pp=P[act];name=pp.n;meta=(pp.q?'<b>×'+pp.q+'</b>　':'')+GROUPS[pp.g];no=pad(act+1)+' / '+pad(N)}
    var key=act+'|'+isOver+'|'+(eq>K.length-3);
    if(key!==activeKey){activeKey=key;$('.no',cap).textContent=no;$('h2',cap).textContent=name;$('p',cap).innerHTML=meta}
    cap.classList.toggle('ov',isOver&&!mobile);cap.style.opacity=capW;cap.style.transform=(mobile||(isOver)?'':'translateY(-50%) ')+'translateY('+((1-capW)*18).toFixed(1)+'px)';
    var inParts=eq>1.6&&eq<K.length-1.6;rail.classList.toggle('show',inParts&&!mobile);
    P.forEach(function(p,i){p.rail.classList.toggle('on',i===act&&inParts)});
  }
  function proj0(){return 0}
  function goPart(i){scrollTo({top:top0+(i+2+.12)*unit,behavior:still?'auto':'smooth'})}
  var ticking=false;
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;update(false);words()})}},{passive:true});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(layout,120)});

  /* ---------- 逐字點亮 ---------- */
  var stmt=$('#sxStmt p'),wordEls=[];
  if(stmt){var t=stmt.textContent;stmt.textContent='';[].forEach.call(t,function(ch){var s=document.createElement('span');s.className='w';s.textContent=ch;stmt.appendChild(s);wordEls.push(s)})}
  function words(){
    if(!stmt)return;var r=stmt.getBoundingClientRect(),h=innerHeight;
    var p=still?1:clamp((h*.82-r.top)/(r.height+h*.32),0,1),n=Math.round(p*wordEls.length*1.04);
    for(var i=0;i<wordEls.length;i++){var on=i<n;if(wordEls[i]._on!==on){wordEls[i]._on=on;wordEls[i].classList.toggle('on',on)}}
  }

  /* ---------- 特色卡片、零件牆（向量圖示）---------- */
  $$('.sx-f').forEach(function(f){
    var ph=$('.ph',f);JSON.parse(f.dataset.layout).forEach(function(o){
      var d=document.createElement('div');d.className='ci';d.style.setProperty('--x',o.x);d.style.setProperty('--y',o.y);d.style.setProperty('--w',o.w);d.style.setProperty('--d',o.d+'s');
      d.innerHTML=SXICONS.get(o.i).replace('<svg ','<svg class="sxi" ');ph.appendChild(d)})});
  var fio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');fio.unobserve(e.target)}})},{threshold:.15});
  $$('.sx-f').forEach(function(f){fio.observe(f)});
  var wall=$('#sxCards');
  P.forEach(function(p,i){
    var c=document.createElement('button');c.type='button';c.className='sx-c';
    c.innerHTML='<div class="ph"><span class="no">'+pad(i+1)+'</span><div class="ic">'+SXICONS.get(i).replace('<svg ','<svg class="sxi" ')+'</div></div><div class="tx"><span>'+p.n+'</span>'+(p.q?'<b>×'+p.q+'</b>':'')+'</div>';
    c.onclick=function(){goPart(i)};wall.appendChild(c);
  });
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('.sx-c',e.target).forEach(function(c,k){setTimeout(function(){c.classList.add('in')},k*60)});cio.unobserve(e.target)}})},{threshold:.1});
  cio.observe(wall);
  document.body.classList.add('sx-page');
  layout();addEventListener('load',layout);
})();
