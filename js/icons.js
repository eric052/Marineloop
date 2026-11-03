/* 向量零件圖示（等角視角），隨時放大都清晰 */
(function(){
  var C=.866,S=.5,TAU=Math.PI*2;
  function proj(x,y,z){return [(x-y)*C,(x+y)*S-z]}
  function mix(h,t,k){ /* k>0 往白、k<0 往黑 */
    var n=parseInt(h.slice(1),16),r=n>>16&255,g=n>>8&255,b=n&255,to=k>0?255:0,a=Math.abs(k);
    r=Math.round(r+(to-r)*a);g=Math.round(g+(to-g)*a);b=Math.round(b+(to-b)*a);return 'rgb('+r+','+g+','+b+')';
  }
  function Sc(){this.o=[];this.x0=1e9;this.y0=1e9;this.x1=-1e9;this.y1=-1e9}
  Sc.prototype.b=function(p){if(p[0]<this.x0)this.x0=p[0];if(p[0]>this.x1)this.x1=p[0];if(p[1]<this.y0)this.y0=p[1];if(p[1]>this.y1)this.y1=p[1]};
  Sc.prototype.poly=function(pts,fill,sw,st){
    var self=this,s=pts.map(function(p){var q=proj(p[0],p[1],p[2]);self.b(q);return q[0].toFixed(2)+','+q[1].toFixed(2)}).join(' ');
    this.o.push('<polygon points="'+s+'" fill="'+fill+'" stroke="'+(st||'rgba(255,255,255,.9)')+'" stroke-width="'+(sw==null?1.1:sw)+'"/>');
  };
  Sc.prototype.line=function(a,b,op,sw){
    var p=proj(a[0],a[1],a[2]),q=proj(b[0],b[1],b[2]);this.b(p);this.b(q);
    this.o.push('<line x1="'+p[0].toFixed(2)+'" y1="'+p[1].toFixed(2)+'" x2="'+q[0].toFixed(2)+'" y2="'+q[1].toFixed(2)+'" stroke="rgba(255,255,255,'+(op||.5)+')" stroke-width="'+(sw||.9)+'"/>');
  };
  Sc.prototype.box=function(x,y,z,w,d,h,hex){
    this.poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],mix(hex,0,-.34));          /* +y 面 */
    this.poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],mix(hex,0,-.16));           /* +x 面 */
    this.poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],mix(hex,0,.16));            /* 頂面 */
  };
  function ring(axis,cx,cy,cz,r,off,n){
    var out=[];for(var i=0;i<n;i++){var a=i/n*TAU,c=r*Math.cos(a),s=r*Math.sin(a);
      out.push(axis==='z'?[cx+c,cy+s,cz+off]:axis==='x'?[cx+off,cy+c,cz+s]:[cx+c,cy+off,cz+s])}
    return out;
  }
  function hull(pts){
    pts=pts.slice().sort(function(a,b){return a[0]-b[0]||a[1]-b[1]});
    var cr=function(o,a,b){return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])},lo=[],up=[];
    pts.forEach(function(p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)});
    pts.slice().reverse().forEach(function(p){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)});
    lo.pop();up.pop();return lo.concat(up);
  }
  Sc.prototype.cyl=function(axis,cx,cy,cz,r,len,hex,o){
    o=o||{};var n=30,self=this,r1=ring(axis,cx,cy,cz,r,0,n),r2=ring(axis,cx,cy,cz,r,len,n);
    var all=r1.concat(r2).map(function(p){return proj(p[0],p[1],p[2])});
    var h=hull(all);h.forEach(function(p){self.b(p)});
    this.o.push('<polygon points="'+h.map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2)}).join(' ')+'" fill="'+mix(hex,0,-.2)+'" stroke="rgba(255,255,255,.9)" stroke-width="1.1"/>');
    if(o.grooves){ /* 沿軸向的溝槽 */
      for(var k=0;k<o.grooves;k++){var a=(k+.5)/o.grooves*TAU,c=Math.cos(a),s=Math.sin(a);if(c+s<.15)continue;
        var p=axis==='z'?[cx+r*c,cy+r*s,cz]:axis==='x'?[cx,cy+r*c,cz+r*s]:[cx+r*c,cy,cz+r*s],q=axis==='z'?[p[0],p[1],cz+len]:axis==='x'?[cx+len,p[1],p[2]]:[p[0],cy+len,p[2]];
        this.line(p,q,.35,.8)}
    }
    this.poly(ring(axis,cx,cy,cz,r,len,n),mix(hex,0,.22));                                /* 可見端面 */
    if(o.spokes){var cc=axis==='z'?[cx,cy,cz+len]:axis==='x'?[cx+len,cy,cz]:[cx,cy+len,cz];
      for(var k2=0;k2<o.spokes;k2++){var a2=k2/o.spokes*TAU+.3,e=axis==='z'?[cc[0]+r*.78*Math.cos(a2),cc[1]+r*.78*Math.sin(a2),cc[2]]:axis==='x'?[cc[0],cc[1]+r*.78*Math.cos(a2),cc[2]+r*.78*Math.sin(a2)]:[cc[0]+r*.78*Math.cos(a2),cc[1],cc[2]+r*.78*Math.sin(a2)];this.line(cc,e,.7,1.1)}
      this.poly(ring(axis,cc[0],cc[1],cc[2],r*.2,0,16),mix(hex,0,-.1),.9)}
  };
  Sc.prototype.holes=function(x,y,z,list,r,face){ /* 頂面小孔 */
    var self=this;list.forEach(function(p){self.poly(ring('z',p[0],p[1],z,r,0,12),'rgba(5,8,40,.75)',.7)})
  };
  Sc.prototype.inner=function(){return this.o.join('')};
  Sc.prototype.helixY=function(cx,y0,cz,R,L,T,w,color){
    var N=70,self=this;
    function pt(t){return [cx+R*Math.cos(t),y0+t/(TAU*T)*L,cz+R*Math.sin(t)]}
    function ribbon(front){
      for(var i=0;i<N*T;i++){var t=i/N*TAU,t2=(i+1)/N*TAU,isF=(Math.cos(t+.04)+Math.sin(t+.04))>0;if(isF!==front)continue;
        var a=pt(t),b=pt(t2),a2=[a[0],a[1]+w,a[2]],b2=[b[0],b[1]+w,b[2]];
        self.poly([a,b,b2,a2],isF?'rgba(255,255,255,.78)':'rgba(220,226,255,.4)',.5,'rgba(255,255,255,.55)')}
    }
    ribbon(false);this.cyl('y',cx,y0-3,cz,2.2,L+8,color||'#c4c8de');ribbon(true);
  };
  Sc.prototype.svg=function(){
    var pad=3,w=this.x1-this.x0+pad*2,h=this.y1-this.y0+pad*2;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(this.x0-pad).toFixed(1)+' '+(this.y0-pad).toFixed(1)+' '+w.toFixed(1)+' '+h.toFixed(1)+'" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+this.o.join('')+'</svg>';
  };
  var GRAY='#cfd2e6',DARK='#2c2f42',YEL='#ffd84a',PINK='#ff2d86',RED='#ff4b3e',BLUE='#3d6bff',GRN='#2ecf6b',LB='#8fd0ff',SIL='#c4c8de',ORG='#ff9a3d';
  var B=[
    /* 0 TT馬達 */ function(){var s=new Sc();s.box(0,0,0,22,9,9,YEL);s.box(22,1.5,1.5,6,6,6,mix(YEL,0,.2).length?'#f2c53a':YEL);s.cyl('y',8,9,4.5,1.4,4.5,SIL);s.cyl('y',8,13.5,4.5,2.6,1.6,'#ffe27a');return s.svg()},
    /* 1 JAG 馬達 */ function(){var s=new Sc();s.cyl('x',0,0,0,7,20,SIL);s.cyl('x',20,0,0,5,5,'#8b90b0');s.cyl('x',25,0,0,1.3,7,ORG);return s.svg()},
    /* 2 L298N */ function(){var s=new Sc();s.box(0,0,0,28,20,1.4,RED);s.box(9,2,1.4,11,7,11,DARK);for(var i=1;i<6;i++)s.line([9,9,1.4+i*1.7],[20,9,1.4+i*1.7],.35,.7);[[1.5,13],[8.5,13],[15.5,13],[22.5,13]].forEach(function(p){s.box(p[0],p[1],1.4,5,5.5,4.4,BLUE)});return s.svg()},
    /* 3 馬達架 */ function(){var s=new Sc();s.box(0,0,0,16,10,2.2,LB);s.box(0,0,2.2,2.6,10,15,LB);s.box(13.4,0,2.2,2.6,10,15,LB);s.poly(ring('y',1.3,10,11,.9,0,12).map(function(p){return [p[0]+13.4+0,p[1],p[2]]}),'rgba(5,8,40,.7)',.6);return s.svg()},
    /* 4 樹莓派 4B */ function(){var s=new Sc();s.box(0,0,0,36,24,1.5,'#2aa85f');s.box(3,1,1.5,26,3.2,2.6,DARK);s.box(26,5,1.5,10,9,6.5,SIL);s.box(26,15,1.5,10,9,6.5,SIL);s.box(2,14,1.5,10,9,.8,'#1f6e43');s.box(14,8,1.5,9,9,1.2,'#9aa0bd');return s.svg()},
    /* 5 樹莓派18650供電模組 */ function(){var s=new Sc();s.box(0,0,0,30,22,1.4,BLUE);s.box(24,15,1.4,5,5,3.4,GRN);s.cyl('x',2,6,4.8,3.4,23,PINK);s.cyl('x',2,13.5,4.8,3.4,23,PINK);return s.svg()},
    /* 6 18650 供電模組 */ function(){var s=new Sc();s.box(0,0,0,30,17,7,DARK);s.cyl('x',2,5,7.2,3.1,25,PINK);s.cyl('x',2,12,7.2,3.1,25,PINK);s.box(0,17,0,30,3.4,1.3,'#2aa85f');return s.svg()},
    /* 7 前輪 */ function(){var s=new Sc();s.cyl('y',0,0,0,12,10,GRAY,{grooves:14,spokes:5});return s.svg()},
    /* 8 後驅動輪 */ function(){var s=new Sc();s.cyl('y',0,-8,0,1.7,8.2,ORG);s.cyl('y',0,0,0,12,10,GRAY,{grooves:14,spokes:5});return s.svg()},
    /* 9 履帶輪板架 */ function(){var s=new Sc();s.box(0,0,0,56,5,2,GRAY);s.holes(0,0,2,[[5,2.5],[14,2.5],[23,2.5],[32,2.5],[41,2.5],[50,2.5]],.9);return s.svg()},
    /* 10 履帶輪支撐柱 */ function(){var s=new Sc();s.box(0,0,0,20,20,12,GRAY);[[4,20],[10,20],[16,20]].forEach(function(p){s.poly(ring('y',p[0],20,6,.8,0,10),'rgba(5,8,40,.7)',.6)});return s.svg()},
    /* 11 裝置進沙口 */ function(){var s=new Sc();s.box(0,0,0,32,16,1.5,'#9aa0bd');s.box(0,0,1.5,5,16,16,GRAY);s.box(27,0,1.5,5,16,16,GRAY);s.box(5,0,12.5,22,16,5,GRAY);for(var i=0;i<5;i++)s.line([7+i*4.4,16,2.5],[7+i*4.4,16,11],.3,.7);return s.svg()},
    /* 12 雙螺旋進沙結構 */ function(){
      var s=new Sc(),L=34,R=9,T=3.2,N=140;
      function pt(t,x0,w){var x=x0+t/(TAU*T)*L;return [x,R*Math.cos(t),R*Math.sin(t)]}
      function ribbon(front){
        for(var i=0;i<N*T;i++){var t=i/N*TAU,t2=(i+1)/N*TAU,m=Math.cos(t+.04)+Math.sin(t+.04),isF=m>0;if(isF!==front)continue;
          var a=pt(t,0),b=pt(t2,0),a2=[a[0]+3.2,a[1],a[2]],b2=[b[0]+3.2,b[1],b[2]];
          s.poly([a,b,b2,a2],isF?'rgba(255,255,255,.62)':'rgba(255,255,255,.28)',.5,'rgba(255,255,255,.5)');}
      }
      ribbon(false);s.cyl('x',-3,0,0,2.4,L+9,SIL);ribbon(true);return s.svg()}
  ];
  B[0]=B[0];
  var cache={};
  window.SXKIT={Sc:Sc,proj:proj,mix:mix,ring:ring};
  window.SXICONS={count:B.length,get:function(i){if(!cache[i])cache[i]=B[i]();return cache[i]}};
})();
