/* Shoresift v1.0 向量機體模型：每個零件是獨立群組，可拆解、可組裝，放大不失真 */
(function(){
  var K=SXKIT,Sc=K.Sc,ring=K.ring,mix=K.mix,proj=K.proj;
  var GRAY='#d9dcf2',MID='#b9bddb',DARK='#2c2f42',YEL='#ffd84a',PINK='#ff2d86',RED='#ff4b3e',BLUE='#3d6bff',GRN='#2ecf6b',LB='#8fd0ff',SIL='#c4c8de',ORG='#ff9a3d';
  var G=[];
  function g(p,ex,fn){var s=new Sc();fn(s);G.push({p:p,ex:ex,s:s,cx:0,cy:0})}
  function wheel(s,cx,cy,cz){s.cyl('y',cx,cy,cz,11,9,GRAY,{grooves:14,spokes:5})}
  function bracket(s,x,y,z){s.box(x,y,z,12,9,2,LB);s.box(x,y,z+2,2.4,9,12,LB);s.box(x+9.6,y,z+2,2.4,9,12,LB)}
  /* 畫家演算法：由遠到近依序繪製 */
  /* ---- 遠側外部 ---- */
  g(9,[0,-46,0],function(s){s.box(-8,-27,6,100,3,6,GRAY);s.holes(0,0,12,[[-2,-25.5],[8,-25.5],[18,-25.5],[28,-25.5],[38,-25.5],[48,-25.5],[58,-25.5],[68,-25.5],[78,-25.5],[88,-25.5]],.8)});
  g(7,[-30,-34,0],function(s){wheel(s,2,-23,9)});
  g(8,[36,-34,-4],function(s){wheel(s,80,-23,9)});
  g(10,[0,-30,-18],function(s){s.box(34,-24,3,14,24,10,GRAY);[[38,-24],[44,-24],[50,-24]].forEach(function(p){s.poly(ring('y',p[0],p[1],8,.8,0,10),'rgba(5,8,40,.7)',.6)})});
  g(1,[30,-28,10],function(s){s.cyl('y',80,-13,9,5,13,SIL);s.cyl('y',80,-1,9,1.3,3,ORG)});
  /* ---- 進沙口（在機體前方）---- */
  g(11,[-46,6,4],function(s){s.box(-10,17,3,12,28,1.6,'#9aa0bd');s.box(-4,14,4.6,4,3,13,GRAY);s.box(-4,45,4.6,4,3,13,GRAY);s.box(-4,14,17.6,4,34,3,GRAY)});
  /* ---- 機體底座 ---- */
  g(-1,[0,0,0],function(s){
    s.box(0,0,3,84,62,3,MID);
    s.box(0,0,6,84,4,14,GRAY);                 /* 遠側牆 */
    s.box(80,4,6,4,54,14,GRAY);                /* 後牆 */
    s.box(0,4,6,4,12,8,GRAY);s.box(0,46,6,4,12,8,GRAY);   /* 前緣（中間是進沙口） */
  });
  /* ---- 機體內部 ---- */
  g(12,[-30,30,-24],function(s){s.helixY(10,8,9,7.5,46,3,3.2)});
  g(0,[-10,44,-10],function(s){s.box(6,47,5,9,14,9,YEL);s.box(7,60,6,7,6,7,'#f2c53a');s.cyl('x',15,53,9.5,1.3,5,SIL)});
  g(-1,[0,0,0],function(s){s.box(12,6,14,58,50,3,MID)});   /* 上層板 */
  /* ---- 上層板上的電路 ---- */
  g(6,[-26,-30,30],function(s){s.box(14,9,17,30,17,7,DARK);s.cyl('x',16,14,24.2,3.1,25,PINK);s.cyl('x',16,21,24.2,3.1,25,PINK);s.box(14,26,17,30,3.4,1.3,GRN)});
  g(2,[30,-30,34],function(s){s.box(52,8,17,28,20,1.4,RED);s.box(61,10,18.4,11,7,11,DARK);for(var i=1;i<6;i++)s.line([61,17,18.4+i*1.7],[72,17,18.4+i*1.7],.35,.7);[[53.5,21],[60.5,21],[67.5,21],[74.5,21]].forEach(function(p){s.box(p[0],p[1],18.4,5,5.5,4.4,BLUE)})});
  g(3,[46,-18,52],function(s){bracket(s,62,4,17)});
  g(4,[0,-4,26],function(s){s.box(14,31,17,36,24,1.5,'#2aa85f');s.box(17,32,18.5,26,3.2,2.6,DARK);s.box(40,36,18.5,10,9,6.5,SIL);s.box(40,46,18.5,10,9,6.5,SIL);s.box(16,45,18.5,10,9,.8,'#1f6e43');s.box(28,39,18.5,9,9,1.2,'#9aa0bd')});
  g(5,[0,-4,56],function(s){s.box(16,33,24.5,30,22,1.4,BLUE);s.box(40,46,25.9,5,5,3.4,GRN);s.cyl('x',18,38,30.5,3.4,23,PINK);s.cyl('x',18,45.5,30.5,3.4,23,PINK)});
  g(3,[46,24,52],function(s){bracket(s,62,47,17)});
  /* ---- 機體近側牆 ---- */
  g(-1,[0,0,0],function(s){s.box(0,58,6,84,4,14,GRAY)});
  /* ---- 近側外部 ---- */
  g(1,[30,28,10],function(s){s.cyl('y',80,62,9,5,13,SIL);s.cyl('y',80,75,9,1.3,3,ORG)});
  g(10,[0,30,-18],function(s){s.box(34,62,3,14,24,10,GRAY);[[38,86],[44,86],[50,86]].forEach(function(p){s.poly(ring('y',p[0],p[1],8,.8,0,10),'rgba(5,8,40,.7)',.6)})});
  g(8,[36,34,-4],function(s){wheel(s,80,76,9)});
  g(7,[-30,34,0],function(s){wheel(s,2,76,9)});
  g(9,[0,46,0],function(s){s.box(-8,87,6,100,3,6,GRAY);s.holes(0,0,12,[[-2,88.5],[8,88.5],[18,88.5],[28,88.5],[38,88.5],[48,88.5],[58,88.5],[68,88.5],[78,88.5],[88,88.5]],.8)});
  /* 每個群組的外框與中心（假設在原位） */
  G.forEach(function(o){o.inner=o.s.inner();o.bb=[o.s.x0,o.s.y0,o.s.x1,o.s.y1];o.cx=(o.bb[0]+o.bb[2])/2;o.cy=(o.bb[1]+o.bb[3])/2;var e=proj(o.ex[0],o.ex[1],o.ex[2]);o.dx=e[0];o.dy=e[1]});
  window.SXMACHINE={groups:G};
})();
