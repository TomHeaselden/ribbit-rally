
// ================= tiny 3D engine (WebGL1) =================
const GL3={ok:false};
function hex3(h){if(h.startsWith('hsl'))return [1,1,1];const n=parseInt(h.slice(1),16);return [(n>>16)/255,(n>>8&255)/255,(n&255)/255]}
class Geo{constructor(){this.a=[]}
  v(p,n,c){this.a.push(p[0],p[1],p[2],n[0],n[1],n[2],c[0],c[1],c[2])}
  tri(p0,p1,p2,n0,n1,n2,c){this.v(p0,n0,c);this.v(p1,n1,c);this.v(p2,n2,c)}
  quad(a,b,c,d,n,col){this.tri(a,b,c,n,n,n,col);this.tri(a,c,d,n,n,n,col)}
}
function mkXf(t=[0,0,0],s=[1,1,1],r=[0,0,0]){
  const [rx,ry,rz]=r;const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
  // R = Ry*Rx*Rz (rows)
  const Rz=[[cz,-sz,0],[sz,cz,0],[0,0,1]],Rx=[[1,0,0],[0,cx,-sx],[0,sx,cx]],Ry=[[cy,0,sy],[0,1,0],[-sy,0,cy]];
  const m=(A,B)=>A.map((row,i)=>[0,1,2].map(j=>row[0]*B[0][j]+row[1]*B[1][j]+row[2]*B[2][j]));
  return {R:m(m(Ry,Rx),Rz),t,s};
}
function xp(X,p){const q=[p[0]*X.s[0],p[1]*X.s[1],p[2]*X.s[2]],R=X.R;return [R[0][0]*q[0]+R[0][1]*q[1]+R[0][2]*q[2]+X.t[0],R[1][0]*q[0]+R[1][1]*q[1]+R[1][2]*q[2]+X.t[1],R[2][0]*q[0]+R[2][1]*q[1]+R[2][2]*q[2]+X.t[2]]}
function xn(X,n){const q=[n[0]/X.s[0],n[1]/X.s[1],n[2]/X.s[2]],R=X.R;const r=[R[0][0]*q[0]+R[0][1]*q[1]+R[0][2]*q[2],R[1][0]*q[0]+R[1][1]*q[1]+R[1][2]*q[2],R[2][0]*q[0]+R[2][1]*q[1]+R[2][2]*q[2]];const l=Math.hypot(r[0],r[1],r[2])||1;return [r[0]/l,r[1]/l,r[2]/l]}
function gSphere(g,X,col,seg=12,rings=8,top=1){const c=typeof col==='string'?hex3(col):col;
  const P=(i,j)=>{const th=i/rings*Math.PI*top,ph=j/seg*TAU;return [Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
  for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=P(i,j),b=P(i+1,j),d=P(i,j+1),e=P(i+1,j+1);
    const pa=xp(X,a),pb=xp(X,b),pd=xp(X,d),pe=xp(X,e),na=xn(X,a),nb=xn(X,b),nd=xn(X,d),ne=xn(X,e);
    g.tri(pa,pd,pb,na,nd,nb,c);g.tri(pb,pd,pe,nb,nd,ne,c);}
  if(top<1){const y=Math.cos(Math.PI*top),r=Math.sin(Math.PI*top);const n=xn(X,[0,-1,0]);for(let j=0;j<seg;j++){const a=[r*Math.cos(j/seg*TAU),y,r*Math.sin(j/seg*TAU)],b=[r*Math.cos((j+1)/seg*TAU),y,r*Math.sin((j+1)/seg*TAU)];g.tri(xp(X,[0,y,0]),xp(X,a),xp(X,b),n,n,n,c);}}
}
function gCyl(g,X,col,rT=1,rB=1,seg=12,caps=true){const c=typeof col==='string'?hex3(col):col;const sl=(rB-rT);
  for(let j=0;j<seg;j++){const a0=j/seg*TAU,a1=(j+1)/seg*TAU;const c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
    const p=[[rB*c0,-.5,rB*s0],[rT*c0,.5,rT*s0],[rT*c1,.5,rT*s1],[rB*c1,-.5,rB*s1]].map(v=>xp(X,v));
    const n0=xn(X,[c0,sl,s0]),n1=xn(X,[c1,sl,s1]);g.tri(p[0],p[1],p[2],n0,n0,n1,c);g.tri(p[0],p[2],p[3],n0,n1,n1,c);
    if(caps){const nu=xn(X,[0,1,0]),nd=xn(X,[0,-1,0]);if(rT>0)g.tri(xp(X,[0,.5,0]),p[2],p[1],nu,nu,nu,c);if(rB>0)g.tri(xp(X,[0,-.5,0]),p[0],p[3],nd,nd,nd,c);}}
}
function gBox(g,X,col){const c=typeof col==='string'?hex3(col):col;
  const F=[[[1,0,0],[[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]]],[[-1,0,0],[[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]]],
    [[0,1,0],[[-.5,.5,-.5],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5]]],[[0,-1,0],[[-.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5]]],
    [[0,0,1],[[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[-.5,-.5,.5]]],[[0,0,-1],[[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],[.5,-.5,-.5]]]];
  for(const [n,vs] of F){const nn=xn(X,n);const p=vs.map(v=>xp(X,v));g.quad(p[0],p[1],p[2],p[3],nn,c);}
}
// convenience: S(g, x,y,z, sx,sy,sz, col, rx,ry,rz)
const SPH=(g,x,y,z,sx,sy,sz,col,r=[0,0,0],seg=12,rings=8)=>gSphere(g,mkXf([x,y,z],[sx,sy,sz],r),col,seg,rings);
const CYL=(g,x,y,z,rT,rB,h,col,r=[0,0,0],seg=10)=>gCyl(g,mkXf([x,y,z],[1,h,1],r),col,rT,rB,seg);
const BOX=(g,x,y,z,sx,sy,sz,col,r=[0,0,0])=>gBox(g,mkXf([x,y,z],[sx,sy,sz],r),col);

// ---- matrices (column-major) ----
function m4mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}
function m4persp(fov,asp,n,f){const t=1/Math.tan(fov/2),nf=1/(n-f);return new Float32Array([t/asp,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0])}
function m4look(e,c,u){let z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]];let l=Math.hypot(...z);z=z.map(v=>v/l);let x=[u[1]*z[2]-u[2]*z[1],u[2]*z[0]-u[0]*z[2],u[0]*z[1]-u[1]*z[0]];l=Math.hypot(...x);x=x.map(v=>v/l);const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1])}
function m4model(x,y,z,yaw,s=1,roll=0){const c=Math.cos(yaw),sn=Math.sin(yaw);if(!roll)return new Float32Array([c*s,0,-sn*s,0,0,s,0,0,sn*s,0,c*s,0,x,y,z,1]);
  const cr=Math.cos(roll),sr=Math.sin(roll);const Y=new Float32Array([c,0,-sn,0,0,1,0,0,sn,0,c,0,0,0,0,1]),Z=new Float32Array([cr,sr,0,0,-sr,cr,0,0,0,0,1,0,0,0,0,1]);const m=m4mul(Y,Z);for(let i=0;i<12;i++)m[i]*=s;m[12]=x;m[13]=y;m[14]=z;return m}

// ---- GL setup ----
const VS=`attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;uniform mat4 uVP;uniform mat4 uM;varying vec3 vN;varying vec3 vC;varying vec3 vW;
void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=mat3(uM)*aN;vC=aC;gl_Position=uVP*w;}`;
const FS=`precision mediump float;varying vec3 vN;varying vec3 vC;varying vec3 vW;
uniform vec3 uCam;uniform vec3 uL;uniform vec3 uFog;uniform vec3 uTint;uniform vec3 uEm;uniform float uFN;uniform float uFF;uniform float uA;uniform float uGl;uniform float uWater;uniform float uT;
void main(){vec3 n=normalize(vN);vec3 l=normalize(uL);float d=max(dot(n,l),0.);vec3 v=normalize(uCam-vW);
 vec3 base=vC*uTint;vec3 hemi=mix(vec3(.62,.55,.78),vec3(1.05,1.03,1.08),n.y*.5+.5);
 float sp=pow(max(dot(n,normalize(l+v)),0.),36.)*uGl;float rim=pow(1.-max(dot(n,v),0.),3.)*.3*uGl;
 vec3 col=base*(hemi*.62+d*.5)+vec3(sp*.55+rim)+uEm;
 if(uWater>.5&&n.y>.9&&vC.b>.6&&vC.b>vC.g*.9){float w=sin(vW.x*.012+uT*1.3)*sin(vW.z*.010-uT*1.05)+.5*sin((vW.x+vW.z)*.031+uT*2.2);col+=vec3(.05,.07,.07)*w+vec3(.25)*smoothstep(1.25,1.45,w);}
 float f=smoothstep(uFN,uFF,length(vW-uCam));gl_FragColor=vec4(mix(col,uFog,f),uA);}`;
function init3D(){
  const cvs=document.getElementById('gl');let gl=null;
  try{gl=cvs.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false})}catch(e){}
  if(!gl)return false;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
  gl.useProgram(pr);const U={};for(const n of ['uVP','uM','uCam','uL','uFog','uTint','uEm','uFN','uFF','uA','uGl','uWater','uT'])U[n]=gl.getUniformLocation(pr,n);
  const A={P:gl.getAttribLocation(pr,'aP'),N:gl.getAttribLocation(pr,'aN'),C:gl.getAttribLocation(pr,'aC')};
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);
  Object.assign(GL3,{ok:true,gl,cvs,U,A,meshes:{},world:{}});
  gl.disable(gl.CULL_FACE); // geometry winding is mixed; keep it simple
  return true;
}
function upload(g){const gl=GL3.gl;const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);const f=new Float32Array(g.a);gl.bufferData(gl.ARRAY_BUFFER,f,gl.STATIC_DRAW);return {b,n:f.length/9}}
function drawMesh(m,M,tint=[1,1,1],o={}){const gl=GL3.gl,U=GL3.U,A=GL3.A;
  gl.bindBuffer(gl.ARRAY_BUFFER,m.b);gl.enableVertexAttribArray(A.P);gl.enableVertexAttribArray(A.N);gl.enableVertexAttribArray(A.C);
  gl.vertexAttribPointer(A.P,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(A.N,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(A.C,3,gl.FLOAT,false,36,24);
  gl.uniformMatrix4fv(U.uM,false,M);gl.uniform3fv(U.uTint,tint);gl.uniform3fv(U.uEm,o.em||[0,0,0]);gl.uniform1f(U.uA,o.a??1);gl.uniform1f(U.uGl,o.gl??1);
  gl.drawArrays(gl.TRIANGLES,0,m.n);}
const I4=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);

// ---- models ----
// parts=true splits the model into the jetski, the frog's body and each arm (so the frog can dance on the frog picker);
// in that mode the frog also gets a 3D smile instead of a straight mouth
// dance rig arm: upper arm + forearm (with an elbow and a hand) so the arm can bend; rest points S(houlder), E(lbow), H(and)
function armGeo(PT,side,c,rT,rB,h,col){const th=Math.PI/2+.15,a=[-Math.cos(.15),-Math.sin(.15)],hh=h/2,rM=(rT+rB)/2;
  const S=[c[0]+a[0]*hh,c[1]+a[1]*hh,c[2]],H=[c[0]-a[0]*hh,c[1]-a[1]*hh,c[2]],E=c.slice(),up=new Geo(),fo=new Geo();
  CYL(up,(S[0]+E[0])/2,(S[1]+E[1])/2,c[2],rT,rM,hh,col,[0,0,th],8);CYL(fo,(E[0]+H[0])/2,(E[1]+H[1])/2,c[2],rM,rB,hh,col,[0,0,th],8);
  SPH(fo,E[0],E[1],E[2],rM,rM,rM,col,[0,0,0],8,6);SPH(fo,H[0],H[1],H[2],rB*1.2,rB*1.1,rB*1.2,col,[0,0,0],8,6);PT[side]={up,fo,rest:{S,E,H}};}
function kartGeo(f,face,parts){const PT=parts?{ski:new Geo(),body:new Geo()}:null;let g=PT?PT.ski:new Geo();const k=f.kart;
  // hull: long pointed body sitting in the water
  SPH(g,-2,6,0,30,7,13,k,[0,0,0],16,9);SPH(g,-2,3,0,31,4.5,13.6,'#ffffff',[0,0,0],16,8);
  CYL(g,29,6.5,0,0,8.5,20,k,[0,0,-Math.PI/2],14);CYL(g,29,3.5,0,0,9,20.5,'#ffffff',[0,0,-Math.PI/2],14);
  BOX(g,-2,9.5,0,40,3,22,shade(k,.22));BOX(g,-2,10,13.2,40,2,1.5,'#ffffff');BOX(g,-2,10,-13.2,40,2,1.5,'#ffffff');
  // seat, console, windscreen, handlebars
  BOX(g,-10,14,0,24,5,10,'#3b2a66');BOX(g,9,14.5,0,12,8,15,shade(k,.1));BOX(g,16,19,0,3,9,13,'#bfe8ff',[0,0,-.5]);
  CYL(g,12,23,0,1.3,1.3,26,'#2b2140',[Math.PI/2,0,0],8);SPH(g,12,23,13,2.2,2.2,2.2,'#2b2140');SPH(g,12,23,-13,2.2,2.2,2.2,'#2b2140');
  // jet nozzle and twin chrome exhausts at the back
  CYL(g,-32,5,0,4.5,3.6,5,'#8a8f99',[0,0,Math.PI/2],12);CYL(g,-34.6,5,0,2.4,2.4,.6,'#222226',[0,0,Math.PI/2],10);
  for(const z of [-7,7]){CYL(g,-27,11,z,3.2,2.8,10,'#cfd3dc',[0,0,Math.PI/2],12);CYL(g,-32.4,11,z,3.4,3.4,1.4,'#8a8f99',[0,0,Math.PI/2],12);CYL(g,-33.2,11,z,2,2,.6,'#222226',[0,0,Math.PI/2],10);}
  if(f.fat){
    // BIG Bonk: a wide squishy body squashed into the seat, a huge belly pressed against the handlebars,
    // and rolls of fat flopping out over both sides and the back of the jetski
    const sk=f.skin,lt=shade(f.skin,.45),dk=shade(f.skin,-.22);
    for(const z of [-1,1])if(PT)armGeo(PT,z<0?'L':'R',[7.5,23.5,z*11.2],3.1,2.8,12,sk);else CYL(g,7.5,23.5,z*11.2,3.1,2.8,12,sk,[0,0,Math.PI/2+.15],8);     // chubby arms
    if(PT)g=PT.body;
    SPH(g,-5,24,0,15,15,17.5,sk,[0,0,0],20,12);                                          // wide body
    SPH(g,4.5,19,0,10.5,10,12.5,lt,[0,0,0],14,9);                                        // big belly
    SPH(g,7.2,24.6,0,4,2.3,8,lt,[0,0,0],12,6);                                           // double chin
    SPH(g,14.6,19.5,0,.9,1.1,1.1,dk,[0,0,0],8,5);                                        // belly button
    for(const z of [-1,1]){
      // two big soft side rolls; the bottom one flops right out over the rail and down the side of the hull
      SPH(g,-4.5,17.6,z*16.2,13.5,4.6,5.2,sk,[0,z*.16,0],16,9);
      SPH(g,-6,12,z*17.6,12,4.1,5.2,sk,[0,z*.2,0],16,9);
      SPH(g,-5.5,14.6,z*16.4,9.5,.8,4.6,dk,[0,z*.18,0],12,4);                            // crease between the rolls
      SPH(g,-5,8.4,z*17.4,8.5,1.5,3.6,dk,[0,0,0],10,5);                                  // shadow where the roll squashes on the hull
      SPH(g,8.6,28,z*9.6,3,2.4,3,'#ff8fbf',[0,0,0],8,5);                                 // puffy cheeks
    }
    // love handles flopping over the back of the seat
    SPH(g,-18.5,17,0,4.6,3.6,14,sk,[0,0,0],12,8);SPH(g,-19.6,12.6,0,4.4,3.4,13,sk,[0,0,0],12,8);SPH(g,-19.2,15,0,4,.7,13,dk,[0,0,0],10,4);
  }else{
  // the frog's arms reaching for the handlebars
  for(const z of [-9,9])if(PT)armGeo(PT,z<0?'L':'R',[6,24,z],2.2,2.2,13,f.skin);else CYL(g,6,24,z,2.2,2.2,13,f.skin,[0,0,Math.PI/2+.15],8);
  if(PT)g=PT.body;
  // frog
  SPH(g,-3,26,0,13,14,12.5,f.skin,[0,0,0],16,10);SPH(g,4,24,0,8,9,9,shade(f.skin,.45),[0,0,0],12,8);
  }
  for(const z of [-7,7]){SPH(g,4,37,z,6.5,6.5,6.5,f.skin,[0,0,0],12,8);SPH(g,7.5,37.5,z,4.8,4.8,4.8,'#ffffff',[0,0,0],12,8);if(!face){SPH(g,11.2,37.8,z,2.4,2.6,2.4,'#1d1433',[0,0,0],10,6);SPH(g,12.4,39,z+(z>0?-.8:.8),.9,.9,.9,'#ffffff',[0,0,0],6,4);}if(!f.fat)SPH(g,8.5,28,z*1.1,2,1.6,2,'#ff8fbf',[0,0,0],8,5);}
  if(!face&&!PT)BOX(g,10.4,28.5,0,1.2,1.2,8,'#3b1d5a');
  if(PT)for(let q=0;q<=24;q++){const u=q/12-1;SPH(g,10.75-.6*u*u,26.4+2.6*u*u,u*5.6,.8,.8,.8,'#3b1d5a',[0,0,0],8,6);}   // big happy smile
  const a=f.accC;
  switch(f.acc){
    case 'cap':{// tweed flat cap sitting on top, behind the eyes, with a short peak pointing forward
      const tw='#8b6b4e',tw2='#6f533b',tw3='#a3825f';gSphere(g,mkXf([-7,41.5,0],[10.5,5.6,11.5],[0,0,-.1]),tw,18,7,.5);
      gSphere(g,mkXf([-3.5,45.2,0],[7.5,2.4,9.5],[0,0,-.16]),tw3,14,5,.5);CYL(g,-7,41.6,0,10.6,11.6,1.3,tw2,[0,0,-.1],18);
      BOX(g,3.2,45.2,0,7,1,9.5,tw2,[0,0,-.38]);SPH(g,0,47.1,0,1.3,.9,1.3,tw2);
      for(const [x,z] of [[-12,4],[-8,-6],[-4,5],[-10,-1],[-2,-3]])SPH(g,x,46.4-Math.abs(x+7)*.18,z,1.2,.4,1.2,tw2,[0,0,0],6,3);break;}
    case 'bow':CYL(g,-14,36,6,0,6,10,a,[Math.PI/2,0,0]);CYL(g,-14,36,-6,0,6,10,a,[-Math.PI/2,0,0]);SPH(g,-14,36,0,3.6,3.6,3.6,a);
      {// chunky striped knitted scarf
      const sc=['#5fd3c4','#ffffff'];for(let q=0;q<22;q++){const an=q/22*TAU;SPH(g,-3+Math.cos(an)*12.6,20.5+Math.sin(an*2)*.4,Math.sin(an)*12.2,3.7,3.3,3.7,sc[q%2],[0,-an,0],8,5);}
      // the two hanging ends, draped over her front-left
      for(let q=0;q<3;q++){SPH(g,8.8-q*.2,18-q*2.2,-6.5-q*.6,3.2,1.6,3.0,sc[q%2],[0,0,0],8,5);SPH(g,6.6-q*.4,17.6-q*2,-10-q*.3,2.9,1.5,2.7,sc[(q+1)%2],[0,0,0],8,5);}
      for(const [x,z] of [[8.4,-8.4],[6.4,-11.2],[7.6,-9.8]])CYL(g,x,11,z,.55,.55,2.6,'#ffffff',[0,0,0],5);}
      break;
    case 'horns':gSphere(g,mkXf([-4,36,0],[12,7,12]),'#8a5a30',14,6,.5);CYL(g,-5,44,10,0,3.2,14,a,[.7,0,0]);CYL(g,-5,44,-10,0,3.2,14,a,[-.7,0,0]);break;
    case 'propeller':gSphere(g,mkXf([-4,37,0],[11,8,11]),'#2fa3ff',14,6,.5);CYL(g,-4,46,0,1,1,6,a);BOX(g,-4,49,0,28,1.2,3.5,'#ffd23f');BOX(g,-4,49,0,3.5,1.2,28,'#ffd23f');break;
    case 'shades':BOX(g,12,38,0,2.5,5,24,a);BOX(g,6,39,12,10,1.5,1.5,a);BOX(g,6,39,-12,10,1.5,1.5,a);
      // cool backwards snapback cap
      gSphere(g,mkXf([-4,38.5,0],[12,8.5,12]),'#1d1a22',16,7,.5);CYL(g,-4,38.6,0,12.1,12.1,1.6,'#ffd23f',[0,0,0],16);SPH(g,-4,47,0,2,1.4,2,'#ffd23f');
      BOX(g,-19,39.2,0,13,1.3,15,'#ffd23f',[0,0,.12]);BOX(g,-18.5,39.9,0,12,.4,13.6,'#1d1a22',[0,0,.12]);
      CYL(g,5.4,43.2,0,3.4,3.4,.9,'#ffd23f',[0,0,Math.PI/2-.5],5);break;
    case 'phones':CYL(g,-4,41,0,1.6,1.6,28,'#3b2a66',[Math.PI/2,0,0]);CYL(g,-4,30,13.5,5.5,5.5,4,a,[Math.PI/2,0,0]);CYL(g,-4,30,-13.5,5.5,5.5,4,a,[Math.PI/2,0,0]);break;
    case 'flowers':for(let i=0;i<7;i++){const an=Math.PI*.55+i*Math.PI*.15;const x=-3+Math.cos(an)*12.5,z=Math.sin(an)*12.5;SPH(g,x,36,z,3.4,2.2,3.4,i%2?'#ffd23f':'#ffffff');SPH(g,x,37.5,z,1.3,1.3,1.3,'#ff7ab6');}break;
    case 'antenna':CYL(g,-8,47,5,.8,.8,16,'#3b2a66',[-.35,0,0]);CYL(g,-8,47,-5,.8,.8,16,'#3b2a66',[.35,0,0]);SPH(g,-8,55,8,3.6,3.6,3.6,a);SPH(g,-8,55,-8,3.6,3.6,3.6,a);break;
  }
  return PT||g;
}
function getMesh(key,build){return GL3.meshes[key]||(GL3.meshes[key]=upload(build()))}
function kartMesh(fi){return getMesh('kart'+fi,()=>kartGeo(FROGS[fi]))}

// ---- decorations in 3D ----
function deco3(g,d,th){
  if(!FLOATS[d.type]){const r0=d.s*(BIGD[d.type]?1.1:.95);CYL(g,d.x,1,d.y,r0*1.08,r0*1.15,4,'#f2d98a',[0,0,0],14);CYL(g,d.x,3.5,d.y,r0*.92,r0,3,'#6fd36a',[0,0,0],14);}
  const s=d.s,yaw=d.r,cy=Math.cos(yaw),sy=Math.sin(yaw);
  const L=(dx,dz)=>[d.x+dx*cy-dz*sy,d.y+dx*sy+dz*cy];
  const S=(dx,y,dz,sx,syy,sz,col,seg=10,rg=7)=>{const p=L(dx,dz);SPH(g,p[0],y,p[1],sx,syy,sz,col,[0,-yaw,0],seg,rg)};
  const C=(dx,y,dz,rT,rB,h,col,r=[0,0,0],seg=10)=>{const p=L(dx,dz);CYL(g,p[0],y,p[1],rT,rB,h,col,[r[0],-yaw+r[1],r[2]],seg)};
  const B=(dx,y,dz,sx,syy,sz,col,r=[0,0,0])=>{const p=L(dx,dz);BOX(g,p[0],y,p[1],sx,syy,sz,col,[r[0],-yaw+r[1],r[2]])};
  const v=d.v;
  switch(d.type){
  case 'tree':C(0,s*.6,0,s*.12,s*.16,s*1.2,'#8a5a30');S(0,s*1.5,0,s*.75,s*.7,s*.75,'#3fbf55');S(s*.3,s*1.2,s*.2,s*.45,s*.4,s*.45,'#5fd36a');break;
  case 'autumnTree':C(0,s*.6,0,s*.12,s*.16,s*1.2,'#8a5a30');S(0,s*1.5,0,s*.75,s*.7,s*.75,['#ff7a2a','#ffb63a','#ff5a4e'][v%3]);S(-s*.3,s*1.25,s*.2,s*.45,s*.4,s*.45,['#ffb63a','#ff5a4e','#ff7a2a'][v%3]);break;
  case 'bush':S(-s*.3,s*.3,0,s*.5,s*.45,s*.5,'#3fbf55');S(s*.3,s*.3,0,s*.5,s*.45,s*.5,'#3fbf55');S(0,s*.5,0,s*.5,s*.5,s*.5,'#5fd36a');break;
  case 'flower':C(0,s*.3,0,1.5,1.5,s*.6,'#3fbf55');S(0,s*.65,0,s*.3,s*.12,s*.3,['#ff5a8a','#ffd23f','#ffffff','#b46bff'][v%4]);S(0,s*.7,0,s*.12,s*.08,s*.12,'#ffb000');break;
  case 'rock':S(0,s*.2,0,s*.6,s*.45,s*.5,'#b9b3c9',7,5);break;
  case 'rockDark':S(0,s*.2,0,s*.6,s*.5,s*.5,'#4a3a6a',7,5);break;
  case 'mushroom':C(0,s*.4,0,s*.18,s*.22,s*.8,'#fff4e0');S(0,s*.8,0,s*.6,s*.4,s*.6,v%2?'#ff4b5c':'#b46bff');S(s*.3,s*1.05,0,s*.1,s*.08,s*.1,'#ffffff');S(-s*.2,s*1.05,s*.25,s*.1,s*.08,s*.1,'#ffffff');break;
  case 'reed':for(let i=-1;i<=1;i++){C(i*5,s*.5,(i%2)*4,1.4,1.4,s,'#4c9a3a');C(i*5,s*.9,(i%2)*4,3,3,s*.25,'#8a4a24');}break;
  case 'pond':C(0,1.2,0,s*1.3,s*1.3,1,'#3db8ee',[0,0,0],20);C(0,1.6,0,s*.9,s*.9,1,'#7fdcff',[0,0,0],20);break;
  case 'log':C(0,s*.2,0,s*.22,s*.22,s*1.8,'#8a5a30',[0,0,Math.PI/2]);break;
  case 'lolly':C(0,s*.6,0,2,2,s*1.2,'#ffffff');C(0,s*1.3,0,s*.55,s*.55,s*.18,['#ff4f9a','#ffd23f','#5fd3ff'][v%3],[Math.PI/2,0,0],18);break;
  case 'cane':C(0,s*.6,0,s*.1,s*.1,s*1.2,'#ffffff');C(0,s*.6,0,s*.105,s*.105,s*.15,'#ff3b5c');C(0,s*.25,0,s*.105,s*.105,s*.15,'#ff3b5c');C(0,s*.95,0,s*.105,s*.105,s*.15,'#ff3b5c');S(-s*.15,s*1.2,0,s*.18,s*.12,s*.12,'#ffffff');break;
  case 'gumdrop':{const p=L(0,0);gSphere(g,mkXf([p[0],0,p[1]],[s*.55,s*.7,s*.55]),['#62d65a','#ff5a6e','#ffd23f','#b46bff'][v%4],12,6,.5);break;}
  case 'palm':C(0,s*.8,0,s*.08,s*.12,s*1.6,'#a8743a');for(let i=0;i<6;i++){const a=i/6*TAU;B(Math.cos(a)*s*.4,s*1.55,Math.sin(a)*s*.4,s*.8,3,s*.22,'#3fbf55',[0,-a,-.35*Math.cos(0)]);}S(0,s*1.6,0,s*.15,s*.15,s*.15,'#8a5a30');break;
  case 'ball':S(0,s*.45,0,s*.45,s*.45,s*.45,['#ff4b3e','#2fa3ff','#ffd23f'][v%3],14,10);break;
  case 'umbrella':C(0,s*.6,0,1.5,1.5,s*1.2,'#ffffff');C(0,s*1.25,0,0,s*.8,s*.35,['#ff4b3e','#16b5c9','#ffb627'][v%3],[0,0,0],12);break;
  case 'shell':{const p=L(0,0);gSphere(g,mkXf([p[0],0,p[1]],[s*.4,s*.25,s*.4]),['#ffd0c2','#ffe9a8','#e5d0ff'][v%3],10,5,.5);break;}
  case 'cactus':C(0,s*.6,0,s*.18,s*.18,s*1.2,'#3fbf55');S(0,s*1.2,0,s*.18,s*.18,s*.18,'#3fbf55');C(s*.35,s*.75,0,s*.1,s*.1,s*.4,'#3fbf55');C(-s*.35,s*.55,0,s*.1,s*.1,s*.4,'#3fbf55');B(s*.2,s*.55,0,s*.35,s*.15,s*.15,'#3fbf55');B(-s*.2,s*.4,0,s*.35,s*.15,s*.15,'#3fbf55');S(0,s*1.35,0,s*.08,s*.08,s*.08,'#ff7ab6');break;
  case 'tumble':S(0,s*.35,0,s*.35,s*.35,s*.35,'#c99a5a',6,4);break;
  case 'pyramid':C(0,s*.7,0,0,s*1.1,s*1.4,'#ffc46b',[0,Math.PI/4,0],4);break;
  case 'pine':C(0,s*.2,0,s*.1,s*.1,s*.4,'#8a5a30');C(0,s*.65,0,0,s*.6,s*.7,'#2f9a6a');C(0,s*1.05,0,0,s*.45,s*.6,'#3fbf7a');C(0,s*1.4,0,0,s*.3,s*.5,'#5fd38a');S(0,s*1.65,0,s*.08,s*.08,s*.08,'#ffffff');break;
  case 'snowman':S(0,s*.35,0,s*.42,s*.4,s*.42,'#ffffff');S(0,s*.95,0,s*.3,s*.3,s*.3,'#ffffff');C(s*.3,s*.95,0,0,s*.06,s*.25,'#ff8a2a',[0,0,-Math.PI/2]);C(0,s*.7,0,s*.3,s*.3,s*.08,'#ff4b3e');break;
  case 'ice':B(0,s*.4,0,s*.8,s*.8,s*.8,'#bfe8ff');break;
  case 'fern':for(let i=0;i<6;i++){const a=i/6*TAU;B(Math.cos(a)*s*.3,s*.25,Math.sin(a)*s*.3,s*.7,2,s*.15,'#4fc25a',[0,-a,.4]);}break;
  case 'leaves':for(let i=0;i<5;i++)S(Math.cos(i*1.7)*s*.4,1.5,Math.sin(i*2.3)*s*.4,s*.18,1.2,s*.1,['#ff7a2a','#ffb63a','#ff5a4e'][i%3]);break;
  case 'pumpkin':S(0,s*.35,0,s*.5,s*.38,s*.5,'#ff8a1f',14,8);S(s*.18,s*.35,0,s*.3,s*.36,s*.42,'#ffa04a');C(0,s*.75,0,s*.05,s*.06,s*.2,'#3e7a2a');break;
  case 'acorn':S(0,s*.3,0,s*.25,s*.3,s*.25,'#c47a3a');S(0,s*.5,0,s*.28,s*.13,s*.28,'#7a4a24');break;
  case 'hay':C(0,s*.4,0,s*.4,s*.4,s*.9,'#ffd06b',[Math.PI/2,0,0],14);break;
  case 'barn':B(0,s*.5,0,s*1.4,s,s*1.1,'#ff5a5a');C(0,s*1.2,0,0,s*.8,s*.45,'#7a2a40',[0,Math.PI/4,0],4);B(s*.71,s*.35,0,1,s*.6,s*.5,'#ffffff');break;
  case 'fence':for(let i=-2;i<=2;i++)B(i*s*.3,s*.3,0,4,s*.6,4,'#ffffff');B(0,s*.4,0,s*1.3,3,2,'#ffffff');B(0,s*.2,0,s*1.3,3,2,'#ffffff');break;
  case 'sunflower':C(0,s*.6,0,1.8,1.8,s*1.2,'#3fbf55');C(0,s*1.2,0,s*.38,s*.38,3,'#ffd23f',[0,0,Math.PI/2],14);C(1.5,s*1.2,0,s*.18,s*.18,3,'#7a4a24',[0,0,Math.PI/2],12);break;
  case 'block':B(0,s*.45,0,s*.9,s*.9,s*.9,['#ff4b5c','#2fa3ff','#ffd23f','#5cf07a'][v%4]);break;
  case 'duck':S(0,s*.3,0,s*.45,s*.32,s*.35,'#ffe14d');S(s*.32,s*.65,0,s*.22,s*.22,s*.22,'#ffe14d');C(s*.55,s*.62,0,0,s*.08,s*.18,'#ff8a2a',[0,0,-Math.PI/2]);S(s*.45,s*.72,s*.12,s*.04,s*.04,s*.04,'#1d1433');S(s*.45,s*.72,-s*.12,s*.04,s*.04,s*.04,'#1d1433');break;
  case 'island':{const p=L(0,0);gSphere(g,mkXf([p[0],0,p[1]],[s*1,s*.35,s*.75]),'#ffe39a',16,6,.5);C(0,s*.6,0,s*.06,s*.08,s*1.0,'#a8743a');for(let i=0;i<5;i++){const a=i/5*TAU;B(Math.cos(a)*s*.25,s*1.1,Math.sin(a)*s*.25,s*.55,2,s*.15,'#3fbf55',[0,-a,-.3]);}break;}
  case 'barrel':C(0,s*.4,0,s*.35,s*.35,s*.8,'#b5743a');C(0,s*.4,0,s*.37,s*.37,s*.1,'#5a3a20');break;
  case 'chest':B(0,s*.25,0,s,s*.5,s*.65,'#a8743a');B(0,s*.52,0,s*1.02,s*.08,s*.67,'#ffd23f');B(s*.5,s*.35,0,2,s*.15,s*.12,'#ffd23f');break;
  case 'ship':B(0,s*.25,0,s*1.8,s*.5,s*.7,'#8a5a30');B(-s*.2,s*.95,0,s*.08,s*1.2,s*.08,'#ffffff');B(-s*.2,s*1.05,0,s*.06,s*.7,s*.6,'#ffffff');B(-s*.2,s*1.6,0,s*.2,s*.12,2,'#ff4b5c');break;
  case 'crystal':for(let i=0;i<3;i++){const a=i*2.1;C(Math.cos(a)*s*.15,s*.5,Math.sin(a)*s*.15,0,s*.18,s*(1-.2*i),['#7ef3ff','#ff7ad9','#ffe14d'][(i+v)%3],[Math.cos(a)*.3,0,Math.sin(a)*.3],6);}break;
  case 'glow':S(0,s*.2,0,s*.18,s*.18,s*.18,v%2?'#7ef3ff':'#ff7ad9');break;
  case 'building':{const h=s*(1.6+(v%4)*.5);B(0,h/2,0,s*1.3,h,s*1.3,'#5a3fd0');for(let j=1;j<5;j++)B(0,h*j/5,0,s*1.34,s*.12,s*1.34,j%2?'#ff4fd8':'#3df4ff');break;}
  case 'lamp':C(0,s*.7,0,1.5,2,s*1.4,'#3b2a66');S(0,s*1.45,0,s*.15,s*.15,s*.15,'#fff5a0');break;
  case 'lava':C(0,1.3,0,s*1.1,s*1.1,1,'#ff5a1f',[0,0,0],18);C(0,1.8,0,s*.7,s*.7,1,'#ffc23a',[0,0,0],18);break;
  case 'ember':S(0,s*.6,0,s*.12,s*.12,s*.12,'#ffb627');break;
  case 'ghost':S(0,s*.9,0,s*.35,s*.42,s*.35,'#ffffff');C(0,s*.55,0,s*.35,s*.38,s*.4,'#ffffff');S(s*.3,s*1.0,s*.12,s*.06,s*.08,s*.06,'#1d1433');S(s*.3,s*1.0,-s*.12,s*.06,s*.08,s*.06,'#1d1433');break;
  case 'deadTree':C(0,s*.6,0,s*.06,s*.12,s*1.2,'#6a5a7a');C(s*.2,s*1,0,s*.03,s*.05,s*.5,'#6a5a7a',[0,0,-.8]);C(-s*.15,s*.85,s*.1,s*.03,s*.05,s*.45,'#6a5a7a',[.6,0,.6]);break;
  case 'tomb':B(0,s*.3,0,s*.15,s*.6,s*.5,'#aab0c4');C(0,s*.6,0,s*.25,s*.25,s*.15,'#aab0c4',[0,0,Math.PI/2],12);break;
  case 'coral':for(let i=0;i<4;i++){const a=i/4*TAU+.4;C(Math.cos(a)*s*.2,s*.4,Math.sin(a)*s*.2,s*.05,s*.08,s*.8,['#ff7a59','#ff5aa8','#ffd23f','#b46bff'][(i+v)%4],[Math.sin(a)*.4,0,-Math.cos(a)*.4]);}break;
  case 'fish':S(0,s*.5,0,s*.32,s*.18,s*.12,['#ffb627','#ff5a4e','#7ef3ff'][v%3]);C(-s*.35,s*.5,0,0,s*.14,s*.18,['#ffb627','#ff5a4e','#7ef3ff'][v%3],[0,0,Math.PI/2],4);break;
  case 'bubbles':for(let i=0;i<3;i++)S(i*4-4,s*(.4+i*.35),0,s*(.08+i*.03),s*(.08+i*.03),s*(.08+i*.03),'#d8f6ff');break;
  case 'cloud':S(0,s*.4,0,s*.5,s*.4,s*.5,'#ffffff');S(s*.4,s*.3,0,s*.4,s*.32,s*.4,'#ffffff');S(-s*.4,s*.3,0,s*.4,s*.32,s*.4,'#ffffff');break;
  case 'tower':C(0,s*.6,0,s*.45,s*.5,s*1.2,'#f3e9ff',[0,0,0],12);C(0,s*1.5,0,0,s*.55,s*.6,'#ff8cc6',[0,0,0],12);S(0,s*1.85,0,s*.08,s*.08,s*.08,'#ffd23f');break;
  case 'starDeco':C(0,s*.7,0,0,s*.3,s*.35,v%2?'#ffd23f':'#ffffff',[0,0,0],5);C(0,s*.36,0,s*.3,0,s*.35,v%2?'#ffd23f':'#ffffff',[0,0,0],5);break;
  case 'crater':C(0,1.4,0,s*.65,s*.7,2,shade(th.g,-.15),[0,0,0],16);C(0,2,0,s*.45,s*.45,1,shade(th.g,-.25),[0,0,0],16);break;
  case 'planet':S(0,s*1.2,0,s*.5,s*.5,s*.5,['#ff7ab6','#4fd0ef','#ffb627'][v%3],14,10);C(0,s*1.2,0,s*.85,s*.85,1.5,'#ffffff',[.4,0,.2],20);break;
  case 'lilypad':{C(0,1.4,0,s*.75,s*.75,1.2,'#5fd36a',[0,0,0],16);C(0,1.9,0,s*.55,s*.55,.6,'#7fe880',[0,0,0],14);if(v%3===0){S(-s*.2,s*.2,-s*.15,s*.18,s*.14,s*.18,'#ffb3dd');S(-s*.2,s*.3,-s*.15,s*.07,s*.07,s*.07,'#ffe14d');}
    if(v%5===1){S(0,10,0,9,8,8,'#62d65a');S(5,16,4,4,4,4,'#62d65a');S(5,16,-4,4,4,4,'#62d65a');S(7.5,16.5,4,2.8,2.8,2.8,'#ffffff');S(7.5,16.5,-4,2.8,2.8,2.8,'#ffffff');S(9.5,16.8,4,1.4,1.4,1.4,'#1d1433');S(9.5,16.8,-4,1.4,1.4,1.4,'#1d1433');}break;}
  case 'lotus':for(let i=0;i<8;i++){const a=i/8*TAU;S(Math.cos(a)*s*.22,s*.18,Math.sin(a)*s*.22,s*.22,s*.1,s*.1,i%2?'#ff9fd0':'#ffc4e6');}S(0,s*.25,0,s*.12,s*.08,s*.12,'#ffe14d');break;
  case 'ripple':C(0,.8,0,s*.9,s*.9,.4,shade(th.g,.25),[0,0,0],18);C(0,1.0,0,s*.75,s*.75,.4,th.g,[0,0,0],18);break;
  }
}

// ---- height helpers ----
function hh(T,i){return T.hgt?T.hgt[((i%TN)+TN)%TN]:0}
// height of the track under a kart. A kart's position between two track points is found along the track's
// smoothly-turning sideways direction, so the height changes evenly even round tight curves like the tower spiral
// (no little steps as the nearest point changes).
function segT(q,n,x,y){const dx=n.x-q.x,dy=n.y-q.y,ex=n.nx-q.nx,ey=n.ny-q.ny,wx=x-q.x,wy=y-q.y,cr=(ax,ay,bx,by)=>ax*by-ay*bx;
  const A=-cr(dx,dy,ex,ey),B=cr(wx,wy,ex,ey)-cr(dx,dy,q.nx,q.ny),C=cr(wx,wy,q.nx,q.ny);
  if(Math.abs(A)<1e-9)return Math.abs(B)<1e-12?-1:-C/B;const D=B*B-4*A*C;if(D<0)return -1;
  const r=Math.sqrt(D),t1=(-B+r)/(2*A),t2=(-B-r)/(2*A),ok=t=>t>=-1e-6&&t<=1+1e-6;
  return ok(t1)&&ok(t2)?(Math.abs(t1-.5)<Math.abs(t2-.5)?t1:t2):ok(t1)?t1:ok(t2)?t2:-1}
function kH(T,k){if(!T.hgt)return 0;const i=k.idx,q=T.pts[i];let t=segT(q,T.pts[(i+1)%TN],k.x,k.y);if(t>=0)return lerp(hh(T,i),hh(T,i+1),Math.min(1,t));
  t=segT(T.pts[(i-1+TN)%TN],q,k.x,k.y);if(t>=0)return lerp(hh(T,i-1),hh(T,i),Math.min(1,t));return hh(T,i)}
// smooth track height near a point, searching along the track from a known index (for tracks that cross over themselves)
function hNear(T,x,y,guess){return kH(T,{idx:nearestIdx(T,x,y,guess,30),x,y})}
const FLOATS={lilypad:1,lotus:1,ripple:1,duck:1,fish:1,log:1,bubbles:1,reed:1,ship:1,ball:1,barrel:1,cloud:1,ghost:1,starDeco:1,planet:1,glow:1,ember:1};
const BIGD={barn:1,ship:1,building:1,island:1,tower:1,pyramid:1,lava:1};
// ---- world build ----
function buildWorld3D(T){
  if(GL3.world[T.idx])return GL3.world[T.idx];
  const th=T.th,g=new Geo(),P=T.pts,w=T.w;
  // pond water everywhere
  const WATER='#2ab0dc',LANE='#55cdf0',LILY='#5fd36a',LILY2='#47bf57';
  const bb=T.bb,M=3400,ts=320;const x0=Math.floor((bb.minX-M)/ts)*ts,x1=bb.maxX+M,z0=Math.floor((bb.minY-M)/ts)*ts,z1=bb.maxY+M;
  const cw=hex3(WATER),up=[0,1,0];
  for(let x=x0;x<x1;x+=ts)for(let z=z0;z<z1;z+=ts)g.quad([x,0,z],[x,0,z+ts],[x+ts,0,z+ts],[x+ts,0,z],up,cw);
  // grassy shore all around the pond
  const cx=(bb.minX+bb.maxX)/2,cz=(bb.minY+bb.maxY)/2,R=Math.max(bb.maxX-bb.minX,bb.maxY-bb.minY)/2+2300;const hr=mulberry(T.idx*31+5);
  for(let i=0;i<46;i++){const a=i/46*TAU+hr()*.1;const r=R+hr()*500;const sz=380+hr()*420;SPH(g,cx+Math.cos(a)*r,-sz*.15,cz+Math.sin(a)*r,sz,sz*(.55+hr()*.5),sz,shade('#4cc363',i%2?-.08:-.18),[0,0,0],12,7);}
  for(let i=0;i<70;i++){const a=hr()*TAU,r=R-250+hr()*300;CYL(g,cx+Math.cos(a)*r,30,cz+Math.sin(a)*r,8,10,60,'#8a5a30');SPH(g,cx+Math.cos(a)*r,95,cz+Math.sin(a)*r,55,55,55,shade('#3fbf55',hr()*.2-.1),[0,0,0],10,7);}
  // the racing lane: slightly brighter water
  const strips=[[-.5,.5,WATER]];
  for(let i=0;i<TN;i++){const a=P[i],b=P[(i+1)%TN];
    const ha=hh(T,i),hb=hh(T,i+1);for(const [l0,l1,col] of strips){const c=hex3(col);const p=(q,l,h)=>[q.x+q.nx*l*w,1+h,q.y+q.ny*l*w];g.quad(p(a,l0,ha),p(b,l0,hb),p(b,l1,hb),p(a,l1,ha),up,c);}
  }
  // lily pads lining both edges (these are the barriers)
  const lilyPad=(x,y,z,rad,rot,col,notch=true)=>{const c=hex3(col),c2=hex3(shade(col,-.2)),n=12,gap=notch?1:0;
    for(let k=gap;k<n;k++){const a0=rot+k/n*TAU,a1=rot+(k+1)/n*TAU;const p0=[x+Math.cos(a0)*rad,y,z+Math.sin(a0)*rad],p1=[x+Math.cos(a1)*rad,y,z+Math.sin(a1)*rad];
      g.tri([x,y+.6,z],p1,p0,up,up,up,c);const q0=[p0[0],y-3,p0[2]],q1=[p1[0],y-3,p1[2]];const nn=[Math.cos((a0+a1)/2),0,Math.sin((a0+a1)/2)];g.quad(p0,p1,q1,q0,nn,c2);}
    if(notch){const a0=rot,a1=rot+TAU/n;g.tri([x,y+.6,z],[x+Math.cos(a0)*rad,y,z+Math.sin(a0)*rad],[x,y-3,z],up,up,up,c2);g.tri([x,y+.6,z],[x+Math.cos(a1)*rad,y,z+Math.sin(a1)*rad],[x,y-3,z],up,up,up,c2);}};
  {const lr=mulberry(T.idx*97+3);const cum=[0];for(let i=1;i<=TN;i++){const a=P[i-1],b=P[i%TN];cum.push(cum[i-1]+Math.hypot(b.x-a.x,b.y-a.y));}
   const CL=cum[TN];const at=(s,lat)=>{s=((s%CL)+CL)%CL;let i=0;while(i<TN-1&&cum[i+1]<s)i++;const f=(s-cum[i])/(cum[i+1]-cum[i]);const a=P[i],b=P[(i+1)%TN];const nx=lerp(a.nx,b.nx,f),ny=lerp(a.ny,b.ny,f);
     return {x:lerp(a.x,b.x,f)+nx*lat,y:lerp(a.y,b.y,f)+ny*lat,h:lerp(hh(T,i),hh(T,i+1),f)}};
   // grey stone edging, like a modern garden pond
   const STONES=['#8e9196','#9fa2a7','#7b7f85','#b1b3b6','#6f7378','#a6a39c'];
   const lowOK=h=>!T.tower||h<6;
   const stone=(x,y,z,rad,ht,rot,col)=>!lowOK(y-4)?0:gSphere(g,mkXf([x,y,z],[rad,ht,rad*(.7+lr()*.3)],[0,rot,0]),col,6,3);
   for(const side of [-1,1]){for(let s=0;s<T.L;s+=32+lr()*16){const rad=17+lr()*13,q=at(s,side*(w/2+8+rad*.6+lr()*6));stone(q.x,q.h+2,q.y,rad,rad*(.45+lr()*.35),lr()*TAU,STONES[(lr()*STONES.length)|0]);
       if(lr()<.22){const r2=8+lr()*7,q2=at(s+lr()*20,side*(w/2+rad*1.6+r2+lr()*10));stone(q2.x,q2.h+1,q2.y,r2,r2*.5,lr()*TAU,STONES[(lr()*STONES.length)|0]);}}
     // tall thin greenery dotted off the track: rushes, grasses and bulrushes
     for(let s=lr()*200;s<T.L;s+=150+lr()*260){const q=at(s,side*(w/2+70+lr()*520));if(!lowOK(q.h))continue;const n=5+(lr()*6|0),cat=lr()<.45;
       for(let m=0;m<n;m++){const ox=(lr()-.5)*26,oz=(lr()-.5)*26,ht=70+lr()*90,lean=(lr()-.5)*.25,lean2=(lr()-.5)*.25;const col=['#3f9a3f','#4fae45','#5cbf52','#2f8a3a','#6cc85e'][(lr()*5)|0];
         gCyl(g,mkXf([q.x+ox,q.h+ht/2,q.y+oz],[1,ht,1],[lean,0,lean2]),col,.6,2.2,5,false);
         if(cat&&m<3){const tx=q.x+ox+Math.sin(lean2)*ht*.4*-1,tz=q.y+oz+Math.sin(lean)*ht*.4;gCyl(g,mkXf([q.x+ox-Math.sin(lean2)*ht*.38,q.h+ht*.86,q.y+oz+Math.sin(lean)*ht*.38],[1,16,1],[lean,0,lean2]),'#7a4a24',3.4,3.4,6,true);}}
       for(let m=0;m<3;m++)stone(q.x+(lr()-.5)*40,q.h+1,q.y+(lr()-.5)*40,7+lr()*8,4+lr()*4,lr()*TAU,STONES[(lr()*STONES.length)|0]);}
     for(let s=20;s<T.L;s+=150+lr()*120){const q=at(s,side*(w/2+90+lr()*80));if(!lowOK(q.h))continue;lilyPad(q.x,q.h+3,q.y,26+lr()*18,lr()*TAU,lr()<.5?LILY:LILY2);if(lr()<.2){SPH(g,q.x,q.h+9,q.y,8,6,8,'#ffb3dd',[0,0,0],8,5);SPH(g,q.x,q.h+12,q.y,3.5,3,3.5,'#ffe14d');}}}}
  // raised wave sections stand on walls of foamy water
  if(T.hgt&&!T.tower){const e0=w/2+34;for(const side of [-1,1])for(let i=0;i<TN;i++){const a=P[i],b=P[(i+1)%TN],ha=hh(T,i),hb=hh(T,i+1);if(ha<1&&hb<1)continue;
    const pt=(q,y)=>[q.x+q.nx*e0*side,y,q.y+q.ny*e0*side];const n=[a.nx*side,0,a.ny*side];const lip=Math.min(ha,hb,10);
    g.quad(pt(a,ha+3),pt(b,hb+3),pt(b,hb+3-lip),pt(a,ha+3-lip),n,hex3('#f2fdff'));g.quad(pt(a,ha+3-lip),pt(b,hb+3-lip),pt(b,0),pt(a,0),n,hex3(Math.floor(i/3)%2?'#7fdaf3':'#6fd1ee'));}}
  if(T.tower)buildTower(g,T,P,w);
  // start line checker + arch
  const s0=P[0];const nC=Math.ceil(w/20);
  for(let i=0;i<nC;i++)for(let j=0;j<3;j++){const c=(i+j)%2?[.1,.08,.2]:[1,1,1];const l0=-w/2+i*20,l1=Math.min(w/2,l0+20),o0=-30+j*20,o1=o0+20;const p=(l,o)=>[s0.x+s0.nx*l+s0.tx*o,1.4,s0.y+s0.ny*l+s0.ty*o];g.quad(p(l0,o0),p(l0,o1),p(l1,o1),p(l1,o0),up,c);}
  const aw=w/2+50;for(const sd of [-1,1])CYL(g,s0.x+s0.nx*aw*sd,70,s0.y+s0.ny*aw*sd,9,11,140,th.eB,[0,0,0],12);
  const ay=-s0.a;BOX(g,s0.x,140,s0.y,14,36,aw*2+24,th.eB,[0,ay,0]);BOX(g,s0.x,140,s0.y,16,26,aw*2,'#ffffff',[0,ay,0]);
  // boost pads
  for(const pd of T.pads){const a=pd.a,ph=hh(T,pd.i);BOX(g,pd.x,1.6+ph,pd.y,100,1,72,'#ff8a1a',[0,-a,0]);BOX(g,pd.x,1.8+ph,pd.y,90,1,62,'#ffb627',[0,-a,0]);
    for(let i=-1;i<=1;i++){const o=i*26;const c=[1,1,1];const p=(f,l)=>[pd.x+Math.cos(a)*(o+f)-Math.sin(a)*l,2.6+ph,pd.y+Math.sin(a)*(o+f)+Math.cos(a)*l];g.tri(p(-8,-22),p(10,0),p(2,0),up,up,up,c);g.tri(p(-8,-22),p(2,0),p(-16,-22),up,up,up,c);g.tri(p(-8,22),p(2,0),p(10,0),up,up,up,c);g.tri(p(-8,22),p(-16,22),p(2,0),up,up,up,c);}}
  // sprinkler bases: a little rock island with a garden post
  for(const sp of T.spinners){const sh=hh(T,sp.i);CYL(g,sp.x,sh+2,sp.y,34,40,6,'#9a958d',[0,0,0],14);SPH(g,sp.x,sh+5,sp.y,30,8,30,'#6fd36a',[0,0,0],12,6);CYL(g,sp.x,sh+18,sp.y,5,6,26,'#3fa34d',[0,0,0],10);}
  // decorations
  for(const d of T.decos)deco3(g,d,th);
  return GL3.world[T.idx]=upload(g);
}
// Tower Twister: a candy-striped tower with the water slide corkscrewing round it, slide rails and an underside on
// every raised stretch, and pillars holding up the big drop (never placed where they'd hit the track below)
function buildTower(g,T,P,w){const tw=T.tower,up=[0,1,0];
  const RA='#ffffff',RB='#ff4f6d',UNDER='#8b97b0';
  for(let i=0;i<TN;i++){const a=P[i],b=P[(i+1)%TN],ha=hh(T,i),hb=hh(T,i+1);if(ha<6&&hb<6)continue;
    const c=hex3(Math.floor(i/2)%2?RA:RB);
    for(const sd of [-1,1]){const e=w/2+6,pt=(q,l,y)=>[q.x+q.nx*l*sd,y,q.y+q.ny*l*sd],n=[a.nx*sd,0,a.ny*sd];
      g.quad(pt(a,e,ha),pt(b,e,hb),pt(b,e,hb+28),pt(a,e,ha+28),[-n[0],0,-n[2]],c);
      g.quad(pt(a,e,ha+28),pt(b,e,hb+28),pt(b,e+16,hb+28),pt(a,e+16,ha+28),up,c);
      g.quad(pt(a,e+16,ha+28),pt(b,e+16,hb+28),pt(b,e+16,hb-16),pt(a,e+16,ha-16),n,c);}
    const u=(q,l,y)=>[q.x+q.nx*l,y,q.y+q.ny*l],e2=w/2+22;g.quad(u(a,-e2,ha-16),u(a,e2,ha-16),u(b,e2,hb-16),u(b,-e2,hb-16),[0,-1,0],hex3(UNDER));}
  // the tower: red and white bands, a gold cone roof and a flag on top
  const cr=tw.r-w/2-40,top=tw.top+260,band=280;
  for(let y=0;y<top;y+=band){const h=Math.min(band,top-y);CYL(g,tw.x,y+h/2,tw.y,cr,cr,h,Math.floor(y/band)%2?'#ffffff':'#ff4f6d',[0,0,0],40);}
  for(let k=0;k<12;k++){const a=k/12*TAU;for(let y=420;y<top-200;y+=560)BOX(g,tw.x+Math.cos(a)*(cr+1),y+(k%2)*280,tw.y+Math.sin(a)*(cr+1),4,70,40,'#5fc8ff',[0,-a,0]);}
  CYL(g,tw.x,top+300,tw.y,0,cr+70,600,'#ffd23f',[0,0,0],40);CYL(g,tw.x,top+12,tw.y,cr+80,cr+80,24,'#ffb627',[0,0,0],40);
  CYL(g,tw.x,top+720,tw.y,5,5,260,'#3b2a66');BOX(g,tw.x+60,top+800,tw.y,120,70,4,'#5cf07a');SPH(g,tw.x,top+855,tw.y,12,12,12,'#ffd23f');
  // ledges tying the slide to the tower wall
  for(let i=0;i<TN;i+=3){const q=P[i],h=hh(T,i);if(h<40)continue;const dx=q.x-tw.x,dz=q.y-tw.y,d=Math.hypot(dx,dz);if(Math.abs(d-tw.r)>90)continue;
    const a=Math.atan2(dz,dx),mid=(cr+d-w/2)/2;BOX(g,tw.x+Math.cos(a)*mid,h-26,tw.y+Math.sin(a)*mid,d-w/2-cr+30,20,46,'#e8e3d9',[0,-a,0]);}
  // pillars under the rest of the raised slide
  for(let i=0;i<TN;i+=4){const q=P[i],h=hh(T,i);if(h<60)continue;if(Math.hypot(q.x-tw.x,q.y-tw.y)<tw.r+w/2+40)continue;
    let clear=true;for(let j=0;j<TN;j++){let dj=Math.abs(j-i);dj=Math.min(dj,TN-dj);if(dj<12)continue;const o=P[j];if(hh(T,j)<h-40&&(o.x-q.x)**2+(o.y-q.y)**2<(w/2+60)**2){clear=false;break}}
    if(!clear)continue;CYL(g,q.x,(h-16)/2,q.y,24,30,h-16,'#e8e3d9',[0,0,0],12);CYL(g,q.x,4,q.y,46,52,10,'#9a958d',[0,0,0],14);}
}
function extraMeshes(){
  return {
    box:getMesh('box',()=>{const g=new Geo();BOX(g,0,0,0,1,1,1,'#ffffff');BOX(g,0,0,0,.84,1.04,.84,'#ffffff');return g}),
    sphere:getMesh('sph',()=>{const g=new Geo();gSphere(g,mkXf(),'#ffffff',18,12);return g}),
    lily:getMesh('lily',()=>{const g=new Geo();CYL(g,0,2,0,22,22,2,'#5fd36a',[0,0,0],16);CYL(g,0,3.2,0,15,15,.6,'#8af08a',[0,0,0],14);SPH(g,-6,6,-6,5,4,5,'#ff9fd0');return g}),
    fly:getMesh('fly',()=>{const g=new Geo();SPH(g,0,0,0,10,7,7,'#2b2140');SPH(g,8,2,4,3.5,3.5,3.5,'#ff4b5c');SPH(g,8,2,-4,3.5,3.5,3.5,'#ff4b5c');BOX(g,-2,7,8,12,1,9,'#e8f8ff',[.4,0,0]);BOX(g,-2,7,-8,12,1,9,'#e8f8ff',[-.4,0,0]);return g}),
    bird:[0,1,2].map(c=>getMesh('bird'+c,()=>{const g=new Geo();const body=['#f2f2ee','#9aa1ad','#e9e6df'][c],head=['#f7f7f4','#7c8794','#f2f0ea'][c],beak=['#f2c230','#3b3b40','#e8b23a'][c];
      SPH(g,0,0,0,15,7,7,body,[0,0,0],12,8);SPH(g,12,3.5,0,5.5,5,5,head,[0,0,0],12,8);CYL(g,19,3,0,.6,1.8,6,beak,[0,0,-Math.PI/2],8);
      SPH(g,15,5,2.8,1.1,1.1,1.1,'#111111');SPH(g,15,5,-2.8,1.1,1.1,1.1,'#111111');BOX(g,-16,.5,0,10,1.2,8,c===1?'#5e6672':'#c9ccd2',[0,0,-.1]);
      if(c===1){SPH(g,7,1,0,4,4,4.5,'#6f8a7e');}return g})),
    wingUp:getMesh('wingUp',()=>{const g=new Geo();for(const sd of [1,-1]){BOX(g,0,5,sd*12,11,1.2,18,'#b9bec6',[sd*.45,0,0]);BOX(g,-2,10,sd*24,9,1,10,'#3a3d44',[sd*.55,0,0]);}return g}),
    wingDn:getMesh('wingDn',()=>{const g=new Geo();for(const sd of [1,-1]){BOX(g,0,-1,sd*12,11,1.2,18,'#b9bec6',[-sd*.2,0,0]);BOX(g,-2,-4,sd*24,9,1,10,'#3a3d44',[-sd*.35,0,0]);}return g}),
    poo:getMesh('poo',()=>{const g=new Geo();SPH(g,0,0,0,3.6,4.6,3.6,'#f1f1ea');SPH(g,.8,-.6,.8,1.8,2.2,1.8,'#6c705a');SPH(g,-.5,2.4,-.4,2.2,2.4,2.2,'#e7e7de');return g}),
    splat:[0,1,2,3].map(v=>getMesh('splat'+v,()=>{const g=new Geo();const rn=mulberry(31+v*17);const H=.06;
      // main uneven white blob
      for(let i=0;i<7;i++){const a=rn()*TAU,d=rn()*.35,s=.45+rn()*.35;CYL(g,Math.cos(a)*d,0,Math.sin(a)*d,s,s,H,'#f3f3ec',[0,0,0],14);}
      // drips and streaks flung outward
      for(let i=0;i<10;i++){const a=rn()*TAU,l=.3+rn()*.5,w=.05+rn()*.07,d=.55+l/2;
        gCyl(g,mkXf([Math.cos(a)*d,0,Math.sin(a)*d],[l/2,H,w],[0,-a,0]),i%3?'#efefe8':'#e2e2d9',1,1,12);
        const e=.55+l;gCyl(g,mkXf([Math.cos(a)*e,0,Math.sin(a)*e],[w*1.5,H,w*1.5]),'#efefe8',1,1,8);}
      // darker wet core, off-centre
      const cx=(rn()-.5)*.3,cz=(rn()-.5)*.3;CYL(g,cx,.02,cz,.26,.26,H,'#7c8068',[0,0,0],12);CYL(g,cx+.12,.03,cz-.06,.14,.14,H,'#55594a',[0,0,0],10);CYL(g,cx-.14,.03,cz+.1,.09,.09,H,'#9a9d86',[0,0,0],8);
      // tiny specks
      for(let i=0;i<10;i++){const a=rn()*TAU,d=1.1+rn()*.6,s=.03+rn()*.05;CYL(g,Math.cos(a)*d,0,Math.sin(a)*d,s,s,H,i%4?'#efefe8':'#868a74',[0,0,0],6);}
      return g})),
    flyer:FROGS.map((f,fi)=>getMesh('flyer'+fi,()=>{const g=new Geo();const sk=f.skin;
      SPH(g,0,0,0,15,8,10,sk,[0,0,0],14,9);SPH(g,13,4,0,9,8,9,sk,[0,0,0],12,8);SPH(g,8,-1,0,10,5,7,shade(sk,.4),[0,0,0],10,6);
      for(const z of [-5,5]){SPH(g,15,11,z,4.2,4.2,4.2,sk);SPH(g,17.5,11.5,z,3.2,3.2,3.2,'#ffffff');SPH(g,19.6,11.8,z,1.6,1.6,1.6,'#1d1433');}
      BOX(g,20.5,4,0,1,1,7,'#3b1d5a');
      for(const z of [-1,1]){CYL(g,23,1,z*9,2.2,2.2,16,sk,[0,0,Math.PI/2],8);SPH(g,31,1,z*9,3,2,3.6,shade(sk,-.1));CYL(g,-16,-1,z*6,2.6,2.6,16,sk,[0,0,Math.PI/2],8);SPH(g,-25,-1,z*7,4,1.6,5,shade(sk,-.1));}
      // goggles in kart colour
      BOX(g,16,12.5,0,2,2,20,f.kart);return g})),
    cape:['#ff4f6d','#ffe14d','#5b6cff','#5cf07a','#ff8ad8'].map((c,ci)=>[0,1].map(fr=>getMesh('cape'+ci+'_'+fr,()=>{const g=new Geo();const n=10,col=hex3(c),col2=hex3(shade(c,-.18));
      const P=(i,s)=>{const u=i/n,x=7-u*40,y=8.5+Math.sin(u*3.2+fr*Math.PI)*u*7+u*3,z=s*(7+u*7);return [x,y,z]};
      for(let i=0;i<n;i++){const a=P(i,-1),b=P(i+1,-1),c2=P(i+1,1),d=P(i,1);g.quad(a,b,c2,d,[0,1,0],i%2?col:col2);}return g}))),
    sprHead:getMesh('sprHead',()=>{const g=new Geo();CYL(g,0,0,0,8,8,8,'#c9ced8',[0,0,0],12);CYL(g,8,2,0,2.6,3.4,14,'#8a8f99',[0,0,-Math.PI/2+.3],10);SPH(g,0,5,0,5,3,5,'#ffd23f');return g}),
    insect:[0,1,2,3].map(kind=>getMesh('insect'+kind,()=>{const g=new Geo();
      if(kind===0){CYL(g,-6,0,0,1.8,2.6,30,'#1fb5a3',[0,0,Math.PI/2],8);for(let i=0;i<5;i++)CYL(g,-10-i*5,0,0,2.2,2.2,.8,'#0f7f73',[0,0,Math.PI/2],8);SPH(g,10,0,0,5,4.5,5,'#2fd6c2');SPH(g,15,1,2.6,3.2,3.2,3.2,'#1d1433');SPH(g,15,1,-2.6,3.2,3.2,3.2,'#1d1433');}
      if(kind===1){const s=new Geo();gSphere(g,mkXf([0,0,0],[12,9,10]),'#ff3b3b',14,7,.5);for(const [x,z] of [[3,4],[3,-4],[-4,5],[-4,-5],[-7,0],[2,0]])SPH(g,x,7.5,z,2.2,1.4,2.2,'#1d1433');BOX(g,0,5,0,22,1,1,'#1d1433');SPH(g,11,1,0,5,4,6,'#1d1433');SPH(g,14,3,2.4,1.4,1.4,1.4,'#ffffff');SPH(g,14,3,-2.4,1.4,1.4,1.4,'#ffffff');}
      if(kind===2){SPH(g,0,0,0,12,9,9,'#ffd23f',[0,0,0],14,9);for(const x of [-6,0,6])CYL(g,x,0,0,9.1,9.1,2.4,'#1d1433',[0,0,Math.PI/2],14);SPH(g,11,1,0,6,6,6,'#1d1433');SPH(g,15,3,2.5,1.6,1.6,1.6,'#ffffff');SPH(g,15,3,-2.5,1.6,1.6,1.6,'#ffffff');CYL(g,-13,0,0,0,2,4,'#1d1433',[0,0,Math.PI/2],8);}
      if(kind===3){SPH(g,0,3,0,12,3,3.4,'#4a3a2a',[0,0,0],10,6);SPH(g,11,3.5,0,3.6,3,3,'#4a3a2a');for(const [x,a] of [[6,.5],[0,1.6],[-6,2.6]])for(const sd of [-1,1]){BOX(g,x+Math.cos(a)*10,1.5,sd*(Math.sin(a)*10+4),24,1,1.2,'#2a2a2a',[0,sd*(Math.PI/2-a),0]);}}
      return g})),
    iwing:[0,1].map(fr=>getMesh('iwing'+fr,()=>{const g=new Geo();const tilt=fr?.5:-.25;for(const sd of [-1,1])for(const dx of [3,-4]){BOX(g,dx,6+tilt*6,sd*12,7,.6,22,'#dff6ff',[sd*tilt,0,0]);}return g})),
    koi:[0,1,2,3,4].map(v=>getMesh('koi'+v,()=>{const g=new Geo();const base=['#fbfaf5','#f2c230','#fbfaf5','#ff7a1a','#1d1a22'][v],p1=['#ff3b2a','#ffd960','#ff3b2a','#ffb347','#ff3b2a'][v],p2=['#ff3b2a','#ffe48a','#1d1a22','#fff2d6','#fbfaf5'][v];
      SPH(g,0,0,0,34,10,13,base,[0,0,0],16,9);SPH(g,26,1,0,12,9,10.5,base,[0,0,0],12,8);
      SPH(g,12,4,0,13,8,11.3,p1,[0,0,0],10,6);SPH(g,-10,4.5,2,11,7.5,11,p2,[0,0,0],10,6);SPH(g,26,5,0,7,6,8.8,p1,[0,0,0],8,5);if(v===2||v===4)SPH(g,-2,6,-4,6,5,8,'#1d1a22',[0,0,0],8,5);
      for(const z of [-6.5,6.5]){SPH(g,31,4.5,z,2.6,2.6,2.6,'#1d1433');SPH(g,32.5,5.4,z*1.05,.9,.9,.9,'#ffffff');}
      BOX(g,-4,10,0,30,6,1.4,shade(p1,.15),[0,0,-.1]);for(const z of [-1,1])BOX(g,14,-4,z*14,12,1.2,10,shade(base,-.05),[z*.6,z*.5,0]);
      for(const z of [-1,1])CYL(g,36,-2,z*4,.5,.9,8,'#d8b48a',[z*.4,0,-1.2],5);return g})),
    koiTail:[0,1,2,3,4].map(v=>getMesh('koiTail'+v,()=>{const g=new Geo();const c=['#ff3b2a','#f2c230','#fbfaf5','#ff7a1a','#1d1a22'][v];
      BOX(g,-4,0,0,10,6,6,c);BOX(g,-14,4,0,18,1.4,12,shade(c,.1),[.9,0,.35]);BOX(g,-14,-4,0,18,1.4,12,shade(c,.1),[-.9,0,-.35]);return g})),
    koiMouth:getMesh('koiMouth',()=>{const g=new Geo();CYL(g,0,0,0,10,10,3,'#ff9a6b',[0,0,Math.PI/2],14);CYL(g,1,0,0,7.5,7.5,3.4,'#3a0d14',[0,0,Math.PI/2],12);CYL(g,1.3,-4,0,3,3,3.5,'#c2364a',[0,0,Math.PI/2],8);return g}),
    shadow:getMesh('shadow',()=>{const g=new Geo();CYL(g,0,0,0,1,1,.2,'#000000',[0,0,0],20);return g}),
  };
}

// ---- per-frame ----
let VP3=null,P3=null,CAM3=[0,0,0];
function render3D(){
  const gl=GL3.gl,U=GL3.U,T=G.T,th=T.th;const cvs=GL3.cvs;
  const R=Math.min(1.5,DPR);const cw=W*R|0,ch=H*R|0;if(cvs.width!==cw||cvs.height!==ch){cvs.width=cw;cvs.height=ch;}
  gl.viewport(0,0,cw,ch);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const P=G.player,yaw=G.camYaw+(G.camOrbit||0);
  const sh=G.shake>0?(Math.random()-.5)*10*G.shake:0;
  const port=H>W*1.05;const dist=port?175:150,hgt=port?78:66;let ex=P.x-Math.cos(yaw)*dist,ez=P.y-Math.sin(yaw)*dist;
  {const ci=nearestIdx(T,ex,ez,P.idx,30),q=T.pts[ci];const lat=(ex-q.x)*q.nx+(ez-q.y)*q.ny,lim=T.w/2-8;if(Math.abs(lat)>lim){const e=Math.abs(lat)-lim;ex-=q.nx*Math.sign(lat)*e;ez-=q.ny*Math.sign(lat)*e;}}
  const lh=(x,z)=>T.tower?hNear(T,x,z,P.idx):T.hAt(x,z);
  let pH=kH(T,P)+P.z*.6,eH=Math.max(lh(ex,ez),pH-20),tH=lh(P.x+Math.cos(yaw)*140,P.y+Math.sin(yaw)*140);
  if(T.tower){const sm=(key,v)=>G[key]=G[key]==null||Math.abs(G[key]-v)>400?v:G[key]+(v-G[key])*.3;eH=sm('_cEH',eH);tH=sm('_cTH',tH);}
  const eye=[ex+sh,hgt+eH+sh*.5,ez],tgt=[P.x+Math.cos(yaw)*140,16+Math.max(tH,pH-60),P.y+Math.sin(yaw)*140];CAM3=eye;
  const fov=((port?74:60)+(P.boost>0||P.star>0?8:0)+Math.max(0,P.speed)/P.maxS*4)*Math.PI/180;G.fov3=(G.fov3||fov)+(fov-(G.fov3||fov))*.08;
  const hiV=Math.max(0,pH);P3=m4persp(G.fov3,W/H,4,(T.tower?11000:7000)+hiV*1.6);VP3=m4mul(P3,m4look(eye,tgt,[0,1,0]));
  const sky=th.sky||['#5ec8ff','#e4f7ff'];
  gl.uniformMatrix4fv(U.uVP,false,VP3);gl.uniform3fv(U.uCam,eye);gl.uniform3fv(U.uL,[.45,1,.3]);gl.uniform3fv(U.uFog,hex3(sky[1]));gl.uniform1f(U.uFN,(T.tower?2600:1500)+hiV*.5);gl.uniform1f(U.uFF,(T.tower?9000:4200)+hiV*1.2);
  gl.disable(gl.BLEND);gl.depthMask(true);
  gl.uniform1f(U.uWater,1);gl.uniform1f(U.uT,G.t);drawMesh(buildWorld3D(T),I4,[1,1,1],{gl:.35});gl.uniform1f(U.uWater,0);
  const X=extraMeshes(),t=G.t;
  // item boxes
  for(const b of T.boxes){let sc=34;if(b.t>0){if(b.t<.4)sc*=1-b.t/.4;else continue}
    const h=((t*120+b.lat)%360)/360;const col=hsl2rgb(h,.9,.62);drawMesh(X.box,m4model(b.x,hh(T,b.i)+26+Math.sin(t*3+b.x)*4,b.y,t*1.6+b.lat,sc,.35),col,{gl:1.2,em:[.12,.12,.12]});}
  for(const sp of T.spinners){const a=sp.ph+sp.spd*G.t;drawMesh(X.sprHead,m4model(sp.x,hh(T,sp.i)+33,sp.y,-a,1),[1,1,1],{gl:1.3});}
  for(const bm of T.bumpers){if(bm.gone>0)continue;const bh=hh(T,bm.i),fl=bm.kind===0||bm.kind===2;const y=bh+(fl?40+Math.sin(t*4+bm.ph)*7:4+Math.sin(t*2+bm.ph)*1);
    const yaw=-(T.pts[bm.i].a+Math.PI/2*Math.sign(Math.cos(G.t*bm.sw+bm.ph)||1)+Math.sin(t*1.5+bm.ph)*.4);
    drawMesh(X.insect[bm.kind],m4model(bm.x,y,bm.y,yaw,2.3),[1,1,1],{gl:1.2});if(fl)drawMesh(X.iwing[Math.floor(t*30+bm.ph)%2],m4model(bm.x,y,bm.y,yaw,2.3),[1,1,1],{a:1,gl:1.5});}
  // birds and falling poo
  for(const b of G.birds){const yaw=-Math.atan2(b.vy,b.vx);const flap=Math.floor((t+b.ph)*8)%2;const h=hh(T,b.ti)+160+Math.sin(t*3+b.ph)*8;
    drawMesh(X.bird[b.c],m4model(b.x,h,b.y,yaw,1),[1,1,1],{gl:1});drawMesh(flap?X.wingUp:X.wingDn,m4model(b.x,h,b.y,yaw,1),[1,1,1].map((v,j)=>[[1,1,1],[.55,.8,1],[1,.75,.85]][b.c][j]),{gl:.8});}
  for(const p of G.poos)drawMesh(X.poo,m4model(p.x,hh(T,p.i)+p.h+6,p.y,0,1),[1,1,1],{gl:1.4});
  for(const h of G.haz)drawMesh(X.lily,m4model(h.x,T.hAt(h.x,h.y),h.y,h.r,1),[1,1,1],{gl:.8});
  for(const p of G.proj){const a=Math.atan2(p.vy,p.vx);if(p.type==='fly')drawMesh(X.fly,m4model(p.x,hh(T,p.idx)+26+Math.sin(t*20)*3,p.y,-a,1),[1,1,1]);}
  // karts
  for(const k of G.karts){if(k.gulped)continue;if(k.inv>0&&Math.floor(t*12)%2)continue;
    const hop=k.hop>0?Math.sin(k.hop/.35*Math.PI)*14:(k.ko>0?Math.abs(Math.sin(k.ko*6))*12:0);
    const roll=(k.dizzy>0?Math.sin(t*10)*.12:0)+(k.flip>0?(1-k.flip/1.25)*TAU*2:0);
    const tint=k.star>0?hsl2rgb((t*1.2)%1,.9,.7):[1,1,1];const em=k.hurt>0?[k.hurt*1.6,0,k.hurt*.4]:k.star>0?[.15,.15,.15]:[0,0,0];
    const pt0=T.hgt&&k.spin<=0&&k.ko<=0?Math.atan(k.slope)+(k.z>0?clamp(k.vz/1500,-.25,.25):0):0;k._pt=k._pt==null?pt0:k._pt+(pt0-k._pt)*.25;const pitch=k._pt;   // eased so the nose doesn't twitch
    const rv=k.rev||0;const vib=rv>0?(Math.random()-.5)*1.6*rv:0;
    const bob=Math.sin(t*3.2+k.id*1.7)*1.6,plane=clamp(k.speed/k.maxS,0,1.2)*.07,wh=wheelieAngle(k);
    // wheelie pivots on the back of the hull so the tail stays in the water
    const wx=k.x-Math.cos(k.a)*30*(1-Math.cos(wh)),wy=k.y-Math.sin(k.a)*30*(1-Math.cos(wh));
    drawMesh(kartMesh(k.fi),m4model(wx,hop+kH(T,k)+k.z+vib+bob+Math.sin(wh)*30,wy,-k.a,1,roll+pitch+rv*.07+plane+wh+Math.sin(t*2.3+k.id)*.02),tint,{gl:1.1,em});}
  // sticky tongues
  for(const k of G.karts){const tg=k.tng;if(!tg||k.gulped)continue;const ca=Math.cos(k.a),sa=Math.sin(k.a);const g0=kH(T,k)+k.z;const m=[k.x+ca*16,g0+31,k.y+sa*16];
    let e;if(tg.tgt){const o=tg.tgt,oa=Math.cos(o.a),ob=Math.sin(o.a);e=[o.x-oa*22,kH(T,o)+o.z+22,o.y-ob*22];}else e=[m[0]+ca*480,m[1]-10,m[2]+sa*480];
    const f=tg.phase==='out'?clamp(tg.t/tg.out,0,1):1-clamp(tg.t/.22,0,1);const tip=[lerp(m[0],e[0],f),lerp(m[1],e[1],f),lerp(m[2],e[2],f)];const L=Math.hypot(tip[0]-m[0],tip[1]-m[1],tip[2]-m[2]);
    const n=Math.max(3,Math.min(50,Math.ceil(L/11)));for(let i=1;i<n;i++){const u=i/n;drawMesh(X.sphere,m4model(lerp(m[0],tip[0],u),lerp(m[1],tip[1],u)-Math.sin(u*Math.PI)*L*.05,lerp(m[2],tip[2],u),0,7),[1,.42,.6],{gl:1.3});}
    drawMesh(X.sphere,m4model(tip[0],tip[1],tip[2],0,13),[1,.27,.5],{gl:1.6});}
  // koi carp popping up
  for(const c of G.carp){if(c.rise<=.02)continue;const gh=T.hgt&&!T.tower?T.hAt(c.x,c.y):0;const S=3.2,yaw=-c.a,y=gh-26+c.rise*50,pit=c.rise*.6;
    drawMesh(X.koi[c.v],m4model(c.x,y,c.y,yaw,S,pit),[1,1,1],{gl:1.4});const tx=c.x-Math.cos(c.a)*32*S*Math.cos(pit),ty=c.y-Math.sin(c.a)*32*S*Math.cos(pit);
    drawMesh(X.koiTail[c.v],m4model(tx,y-Math.sin(pit)*32*S,ty,yaw+Math.sin(c.wag)*.35,S,pit),[1,1,1],{gl:1.2});
    if(c.mouth>.05){const mx=c.x+Math.cos(c.a)*36*S*Math.cos(pit),my=c.y+Math.sin(c.a)*36*S*Math.cos(pit);drawMesh(X.koiMouth,m4model(mx,y+Math.sin(pit)*36*S,my,yaw,(.4+c.mouth*.8)*S,pit),[1,1,1],{gl:.8});}}
  // flying frogs
  for(const f of G.flyers){const p=f.t/f.dur,yaw=-Math.atan2(f.vy,f.vx);const h=f.h0+Math.sin(p*Math.PI)*f.arc;const roll=f.spin?p*TAU*2:Math.sin(t*3+f.ph)*.25;
    drawMesh(X.flyer[f.fi],m4model(f.x,h,f.y,yaw,1.15,roll),[1,1,1],{gl:1.1});drawMesh(X.cape[f.cape][Math.floor((t+f.ph)*12)%2],m4model(f.x,h,f.y,yaw,1.15,roll),[1,1,1],{gl:.9});}
  // transparent pass
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
  for(const k of G.karts){if(k.gulped)continue;const M=new Float32Array([28,0,0,0,0,1,0,0,0,0,20,0,k.x+4,1.9,k.y,1]);const c=Math.cos(-k.a),s=Math.sin(-k.a);M[0]=c*28;M[2]=-s*28;M[8]=s*20;M[10]=c*20;M[13]=1.9+kH(T,k);drawMesh(X.shadow,M,[1,1,1],{a:.22/(1+k.z/60),gl:0});}
  for(const sp of T.spinners){const a=sp.ph+sp.spd*G.t,ux=Math.cos(a),uy=Math.sin(a),bh=hh(T,sp.i)+34;
    for(let j=1;j<=14;j++){const f=j/14,d=f*sp.len,fl=Math.sin(t*25+j*1.7)*2;drawMesh(X.sphere,m4model(sp.x+ux*d,bh+Math.sin(f*Math.PI)*28-f*22+fl,sp.y+uy*d,0,5+f*5),[.78,.94,1],{a:.55-.2*f,gl:1.4,em:[.1,.15,.2]});}
    for(let j=0;j<6;j++){const f=.9+((t*1.3+j*.17)%1)*.3,d=f*sp.len,b2=a-sp.spd*.08*j;drawMesh(X.sphere,m4model(sp.x+Math.cos(b2)*d,bh-25*((t*1.3+j*.17)%1)+4,sp.y+Math.sin(b2)*d,0,3),[.85,.97,1],{a:.5,gl:1});}}
  for(const c of G.carp){if(c.rise>.02)continue;const gh=T.hgt&&!T.tower?T.hAt(c.x,c.y):0;drawMesh(X.koi[c.v],m4model(c.x,gh-28,c.y,-c.a,3.2,0),[.75,.92,1],{a:.75,gl:.3});
    drawMesh(X.koiTail[c.v],m4model(c.x-Math.cos(c.a)*102,gh-28,c.y-Math.sin(c.a)*102,-c.a+Math.sin(c.wag)*.4,3.2,0),[.75,.92,1],{a:.75,gl:.3});}
  for(const f of G.fire){if(!f.spray)continue;const dc=Math.hypot(f.x-CAM3[0],f.h-CAM3[1],f.y-CAM3[2]);const fade=clamp((dc-110)/130,0,1);if(fade<=0)continue;const a=clamp(f.life/f.max,0,1);drawMesh(X.sphere,m4model(f.x,f.h,f.y,0,f.s*(1.3-a*.5)),[.9,.98,1],{a:.55*a*fade,gl:.6,em:[.15,.18,.2]});}
  for(const f of G.fire){if(!f.smoke)continue;const dcs=Math.hypot(f.x-CAM3[0],f.h-CAM3[1],f.y-CAM3[2]);if(dcs<120)continue;const a=f.life/f.max*clamp((dcs-120)/120,0,1);drawMesh(X.sphere,m4model(f.x,f.h,f.y,0,f.s),[.35,.33,.38],{a:.35*a,gl:0});}
  for(const f of G.fire){if(f.smoke||f.spray)continue;const dcf=Math.hypot(f.x-CAM3[0],f.h-CAM3[1],f.y-CAM3[2]);if(dcf<120)continue;const a=clamp(f.life/f.max,0,1)*clamp((dcf-120)/120,0,1);const col=a>.7?[1,.86,.25]:a>.4?[1,.5,.1]:[.95,.22,.12];
    drawMesh(X.sphere,m4model(f.x,f.h,f.y,0,f.s*(.55+a*.5)),col,{a:.55+.4*a,gl:0,em:[col[0]*.35,col[1]*.25,0]});
    if(a>.55)drawMesh(X.sphere,m4model(f.x,f.h,f.y,0,f.s*.35),[1,1,.75],{a:.9,gl:0,em:[.3,.3,.1]});}
  for(const pd of G.puddles){const s=pd.r*pd.grow;const c=Math.cos(pd.rot),sn=Math.sin(pd.rot);const M=new Float32Array([c*s,0,-sn*s,0,0,30,0,0,sn*s,0,c*s,0,pd.x,1.6+hh(T,pd.i),pd.y,1]);drawMesh(X.splat[pd.v||0],M,[1,1,1],{a:Math.min(.97,pd.life),gl:2.2,em:[.02,.02,.02]});}
  for(const p of G.poos){const f=Math.max(0,1-p.h/150);const s=6+18*f;drawMesh(X.shadow,m4model(p.x,1.9+hh(T,p.i),p.y,0,s),[1,1,1],{a:.2+.3*f,gl:0});}
  for(const p of G.proj)if(p.type==='bubble')drawMesh(X.sphere,m4model(p.x,hh(T,p.idx)+20,p.y,0,15),[.66,.92,1],{a:.6,gl:1.6,em:[.15,.2,.25]});
  for(const k of G.karts)if(k.shield>0)drawMesh(X.sphere,m4model(k.x,kH(T,k)+k.z+24,k.y,t,38),[.5,.95,1],{a:.25+Math.sin(t*8)*.06,gl:1.6,em:[.1,.2,.25]});
  gl.depthMask(true);gl.disable(gl.BLEND);
}
function hsl2rgb(h,s,l){const f=n=>{const k=(n+h*12)%12;const a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return [f(0),f(8),f(4)]}
function proj3(x,h,z){if(!VP3)return null;const m=VP3;const cx=m[0]*x+m[4]*h+m[8]*z+m[12],cy=m[1]*x+m[5]*h+m[9]*z+m[13],w=m[3]*x+m[7]*h+m[11]*z+m[15];if(w<6)return null;
  return {x:(cx/w*.5+.5)*W,y:(1-(cy/w*.5+.5))*H,s:P3[5]*H/2/w,w};}
// 2D overlay in screen space, drawn above the 3D view
function overlay3D(c){
  const T=G.T,t=G.t;c.textAlign='center';c.textBaseline='middle';
  // banner text
  const s0=T.pts[0];const pb=proj3(s0.x,140,s0.y);if(pb&&pb.w<2600){const fs=Math.max(8,pb.s*22);c.font=fs+'px '+FONT;c.lineWidth=fs/5;c.strokeStyle='#3b1d8f';c.strokeText('START  ★  FINISH',pb.x,pb.y);c.fillStyle=T.th.eB==='#ffffff'?'#ff5fa2':T.th.eB;c.fillText('START  ★  FINISH',pb.x,pb.y);}
  // item box marks
  for(const b of T.boxes){if(b.t>0)continue;const p=proj3(b.x,hh(T,b.i)+26+Math.sin(t*3+b.x)*4,b.y);if(!p||p.w>2200)continue;const fs=p.s*30;if(fs<5)continue;c.font=fs+'px '+FONT;c.lineWidth=fs/6;c.strokeStyle='rgba(59,29,143,.8)';c.strokeText('?',p.x,p.y);c.fillStyle='#fff';c.fillText('?',p.x,p.y);}
  // particles
  for(const p of G.parts){const a=p.life/p.max;if(p.ring){const q=proj3(p.x,6+T.hAt(p.x,p.y),p.y);if(!q)continue;c.strokeStyle=`rgba(255,225,77,${a})`;c.lineWidth=10*a;c.beginPath();c.ellipse(q.x,q.y,(1-a)*700*q.s,(1-a)*700*q.s*.35,0,0,TAU);c.stroke();continue}
    const q=proj3(p.x,(p.type==='star'?30:10)+T.hAt(p.x,p.y),p.y);if(!q)continue;const r=Math.max(1,p.s*q.s*(.5+a*.5)*1.4);c.globalAlpha=a;c.fillStyle=p.c;if(p.type==='star'){star(c,q.x,q.y-(1-a)*20,r*1.6,r*.7,5);c.fill()}else circ(c,q.x,q.y,r);c.globalAlpha=1;}
  // karts: tags, hp, stars
  const ks=[...G.karts].map(k=>({k,p:proj3(k.x,60+kH(T,k)+k.z,k.y)})).filter(o=>o.p&&o.p.w<3200).sort((a,b)=>b.p.w-a.p.w);
  for(const {k,p} of ks){
    if(k.dizzy>0||k.spin>0||k.ko>0){for(let i=0;i<4;i++){const a=t*6+i*TAU/4;const q=proj3(k.x+Math.cos(a)*24,52+kH(T,k)+k.z+Math.sin(a*2)*2,k.y+Math.sin(a)*24);if(q){c.fillStyle='#ffe14d';star(c,q.x,q.y,7*q.s*1.6,3*q.s*1.6,5);c.fill();}}}
    if(k.isP)continue;
    const sc=clamp(p.s*1.4,.45,1.3);
    const by=p.y-6*sc;
    c.font=`600 ${15*sc|0}px ${BFONT}`;const tw=c.measureText(k.f.name).width+12*sc;c.fillStyle='rgba(59,29,143,.7)';rr(c,p.x-tw/2,by-24*sc,tw,19*sc,9*sc);c.fill();c.fillStyle='#fff';c.fillText(k.f.name,p.x,by-14.5*sc);
  }
  // tongue lock-on
  {const P=G.player,o=P.lock;if(P.tongueT>0&&o){const q=proj3(o.x,kH(T,o)+o.z+24,o.y);if(q){const R=clamp(q.s*55,22,70),sp=t*3;c.save();c.translate(q.x,q.y);c.rotate(sp);c.strokeStyle=P.tongueCD>0?'rgba(255,138,216,.5)':'#ff3d78';c.lineWidth=4;
      c.beginPath();c.arc(0,0,R,0,TAU);c.stroke();for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(R-8,0);c.lineTo(R+10,0);c.stroke();}c.restore();
      c.font='14px '+FONT;c.textAlign='center';c.lineWidth=4;c.strokeStyle='#3b1d8f';c.strokeText('LOCKED',q.x,q.y+R+20);c.fillStyle='#ff8ad8';c.fillText('LOCKED',q.x,q.y+R+20);}}}
  // floating texts
  for(const p of G.texts){const q=proj3(p.x,50+T.hAt(p.x,p.y),p.y);if(!q)continue;const a=Math.min(1,p.life/p.max*2);c.globalAlpha=a;const fs=clamp((p.big?54:28)*q.s*1.3,10,p.big?90:40);c.font=fs+'px '+FONT;c.lineWidth=fs/6;c.strokeStyle='#3b1d8f';c.strokeText(p.s,q.x,q.y-(1-p.life/p.max)*30);c.fillStyle=p.c;c.fillText(p.s,q.x,q.y-(1-p.life/p.max)*30);c.globalAlpha=1}
}
// thumbnails of frogs rendered in 3D, used on menus
const THUMBS=[];
function makeThumbs(){
  const gl=GL3.gl,cvs=GL3.cvs,U=GL3.U,S=256;
  if(cvs.width<S||cvs.height<S){cvs.width=Math.max(cvs.width,S);cvs.height=Math.max(cvs.height,S);}
  for(let i=0;i<FROGS.length;i++){
    gl.viewport(0,0,S,S);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const eye=[78,62,58];const vp=m4mul(m4persp(.62,1,4,1000),m4look(eye,[2,22,0],[0,1,0]));
    gl.uniformMatrix4fv(U.uVP,false,vp);gl.uniform3fv(U.uCam,eye);gl.uniform3fv(U.uL,[.6,1,.7]);gl.uniform3fv(U.uFog,[1,1,1]);gl.uniform1f(U.uFN,5000);gl.uniform1f(U.uFF,6000);
    drawMesh(kartMesh(i),I4,[1,1,1],{gl:1.1});
    const t=document.createElement('canvas');t.width=t.height=S;t.getContext('2d').drawImage(cvs,0,cvs.height-S,S,S,0,0,S,S);THUMBS[i]=t;
    // where the mouth sits in the picture, so it can be animated when the frog talks
    const pj=p=>{const m=vp,x=m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],y=m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];return [(x/w*.5+.5)*S,(1-(y/w*.5+.5))*S]};
    THUMB_MOUTH[i]={a:pj([10.6,28.4,-5.2]),b:pj([10.6,28.4,5.2]),c:pj([10.8,28.4,0]),down:pj([10.2,22.4,0])};
    THUMB_EYES[i]=[-7,7].map(z=>{const c=pj([7.5,37.5,z]),top=pj([7.5,42.3,z]),p0=pj([11.2,37.8,z]),pt=pj([11.2,40.3,z]);return {c,r:Math.hypot(top[0]-c[0],top[1]-c[1]),p0,pr:Math.hypot(pt[0]-p0[0],pt[1]-p0[1]),near:z>0}});
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawMesh(getMesh('kartFace'+i,()=>kartGeo(FROGS[i],true)),I4,[1,1,1],{gl:1.1});
    const tf=document.createElement('canvas');tf.width=tf.height=S;tf.getContext('2d').drawImage(cvs,0,cvs.height-S,S,S,0,0,S,S);THUMBS_FACE[i]=tf;
  }
}
const THUMB_MOUTH=[],THUMB_EYES=[],THUMBS_FACE=[];
// ---- frog picker dances: the frog's body, head and arms move on the jetski (rendered live for the hovered card) ----
const m4T=(x,y,z)=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]);
const m4Rx=a=>{const c=Math.cos(a),s=Math.sin(a);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1])};
const m4Ry=a=>{const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1])};
const m4Rz=a=>{const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1])};
const m4S=(x,y,z)=>new Float32Array([x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]);
const m4chain=(...ms)=>ms.reduce((a,b)=>m4mul(a,b));
const v3=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k],v3n=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)},v3mix=(a,b,k)=>a.map((x,j)=>x+(b[j]-x)*k);
function segM(A0,B0,A,B){const d0=v3(B0,A0,-1),d=v3(B,A,-1),l0=Math.hypot(...d0),l=Math.hypot(...d),u=d0.map(x=>x/l0),w=d.map(x=>x/l),sc=l/l0;
  const v=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],c=u[0]*w[0]+u[1]*w[1]+u[2]*w[2],K=[[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]];
  const R=[0,1,2].map(r=>[0,1,2].map(q=>(r===q?1:0)+K[r][q]+(c>-.999?(K[r][0]*K[0][q]+K[r][1]*K[1][q]+K[r][2]*K[2][q])/(1+c):0)));
  const M=[0,1,2].map(r=>[0,1,2].map(q=>R[r][q]+(sc-1)*(R[r][0]*u[0]+R[r][1]*u[1]+R[r][2]*u[2])*u[q]));
  const t=[0,1,2].map(r=>A[r]-(M[r][0]*A0[0]+M[r][1]*A0[1]+M[r][2]*A0[2]));
  return new Float32Array([M[0][0],M[1][0],M[2][0],0,M[0][1],M[1][1],M[2][1],0,M[0][2],M[1][2],M[2][2],0,t[0],t[1],t[2],1])}
const DANCE_MESH={},DANCE_CV={};
// each dance returns the body's offset (bx,by,bz), twist/roll/pitch, squash and each arm's [raise, spread]
const DANCE_POSES={
  shake:t=>{const w=Math.sin(t*TAU*2.4);return {tw:w*.5,by:Math.abs(w)*3,bz:w*2,rl:w*.1,aL:[1.4+.9*w,.45],aR:[1.4-.9*w,.45]}},                       // Zippy: hip shimmy, arms pumping
  twirl:t=>{const p=(t%1.5)/1.5,e=p<.7?(1-Math.cos(p/.7*Math.PI))/2:1;return {tw:e*TAU,by:Math.sin(Math.min(1,p/.7)*Math.PI)*4.5,aL:[1.1,1.25],aR:[1.1,1.25]}}, // Lulu: ballerina twirl, arms out
  wobble:t=>{const w=Math.sin(t*TAU*1.7);return {sy:1+.13*w,sx:1-.09*w,by:-1.5*w,rl:.09*Math.sin(t*TAU*.85),aL:[.6+.8*Math.max(0,w),.6],aR:[.6+.8*Math.max(0,-w),.6]}}, // Bonk: belly jiggle
  hop:t=>{const p=(t*1.7)%1,h=Math.sin(p*Math.PI),land=p<.12||p>.88;return {by:h*3,sy:land?.88:1.05,sx:land?1.08:.98,pt:-.12*h,aL:[.3+1.9*h,.5*h],aR:[.3+1.9*h,.5*h]}}, // Pip: bouncy hops, arms up
  dab:(t,rig)=>{const p=t%3,s=p<1.5?1:-1,q=p%1.5,ez=x=>1-Math.pow(1-x,3),pop=x=>1+3.4*Math.pow(x-1,3)+2.4*Math.pow(x-1,2), // Mango: DAB! one way, then the other
    k=q<.16?pop(q/.16):q>1.3?1-ez((q-1.3)/.2):1,hit=q>.16&&q<.46?Math.sin((q-.16)/.3*Math.PI):0;
    const D=v3n(s>0?[-.45,.6,.66]:[.4,.52,-.8]),St=[2,25,8*s],Sb=[3,24,-7*s],Eb=[17,26,-4*s],str=rig[s>0?'R':'L'],bnt=rig[s>0?'L':'R'];  // aimed so both dabs point diagonally up across the picture
    const A=(r,P)=>({S:v3mix(r.S,P.S,k),E:v3mix(r.E,P.E,k),H:v3mix(r.H,P.H,k)}),aS=A(str,{S:St,E:v3(St,D,11),H:v3(St,D,22)}),aB=A(bnt,{S:Sb,E:Eb,H:v3(Eb,D,12)});
    return {[s>0?'aR':'aL']:aS,[s>0?'aL':'aR']:aB,pt:-.26*k,rl:-.2*s*k,tw:-.2*s*k,by:2.4*hit+.6*Math.sin(t*TAU*2)*(1-Math.min(1,k)),sy:1-.07*hit,sx:1+.05*hit,fx:{p:aS.H,k,q,s}}},
  robot:t=>{const st=Math.floor(t*4)%4;return {tw:[0,-.45,0,.45][st],by:st%2?2.5:0,aL:[st<2?1.57:.35,.15],aR:[st<2?.35:1.57,.15]}},          // Douglas: stiff, jerky robot moves
  sway:t=>{const w=Math.sin(t*TAU);return {rl:.24*w,bz:w*3,tw:.12*Math.sin(t*TAU*2),aL:[2.3,.35+.45*w],aR:[2.3,.35-.45*w]}},                   // Fern: hula sway, arms waving overhead
  moonwalk:t=>{const p=(t*.75)%1,g=p<.8?p/.8:1-(p-.8)/.2;return {bx:5-12*g,pt:.14,by:Math.abs(Math.sin(t*TAU*1.5))*1.5,aL:[.6+.5*Math.sin(t*TAU*1.5),.2],aR:[.6-.5*Math.sin(t*TAU*1.5),.2]}} // Rocket: smooth backwards glide
};
function danceFrame(i,t,style){if(!GL3.ok)return null;const gl=GL3.gl,cvs=GL3.cvs,U=GL3.U,S=256,f=FROGS[i];
  const M=DANCE_MESH[i]||(DANCE_MESH[i]=(()=>{const P=kartGeo(f,false,true),A=s=>({up:upload(P[s].up),fo:upload(P[s].fo),rest:P[s].rest});return {ski:upload(P.ski),body:upload(P.body),L:A('L'),R:A('R')}})());
  const po=Object.assign({bx:0,by:0,bz:0,tw:0,rl:0,pt:0,sx:1,sy:1,aL:[0,0],aR:[0,0]},(DANCE_POSES[style]||DANCE_POSES.shake)(t,{L:M.L.rest,R:M.R.rest}));
  if(cvs.width<S||cvs.height<S){cvs.width=Math.max(cvs.width,S);cvs.height=Math.max(cvs.height,S);}
  gl.viewport(0,0,S,S);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const eye=[78,62,58];const vp=m4mul(m4persp(.62,1,4,1000),m4look(eye,[2,22,0],[0,1,0]));
  gl.uniformMatrix4fv(U.uVP,false,vp);gl.uniform3fv(U.uCam,eye);gl.uniform3fv(U.uL,[.6,1,.7]);gl.uniform3fv(U.uFog,[1,1,1]);gl.uniform1f(U.uFN,5000);gl.uniform1f(U.uFF,6000);
  const piv=[-3,14,0],Mb=m4chain(m4T(piv[0]+po.bx,piv[1]+po.by,piv[2]+po.bz),m4Ry(po.tw),m4Rx(po.rl),m4Rz(po.pt),m4S(po.sx,po.sy,po.sx),m4T(-piv[0],-piv[1],-piv[2]));
  const sh=f.fat?[1.6,24.4,11.2]:[0,25,9];
  const arm=(sd,[raise,spread])=>m4chain(Mb,m4T(sh[0],sh[1],sd*sh[2]),m4Rx(sd*spread),m4Rz(raise),m4T(-sh[0],-sh[1],-sd*sh[2]));
  drawMesh(M.ski,m4T(0,Math.sin(t*TAU*1.2)*.6,0),[1,1,1],{gl:1.1});
  drawMesh(M.body,Mb,[1,1,1],{gl:1.1});
  // an arm pose is either [raise, spread] (the whole arm swings from the shoulder) or {S,E,H} points for shoulder, elbow and hand (the arm bends)
  for(const [sd,A,P] of [[-1,M.L,po.aL],[1,M.R,po.aR]]){const r=A.rest,mu=Array.isArray(P)?arm(sd,P):m4mul(Mb,segM(r.S,r.E,P.S,P.E)),mf=Array.isArray(P)?mu:m4mul(Mb,segM(r.E,r.H,P.E,P.H));
    drawMesh(A.up,mu,[1,1,1],{gl:1.1});drawMesh(A.fo,mf,[1,1,1],{gl:1.1});}
  const o=DANCE_CV[i]||(DANCE_CV[i]=Object.assign(document.createElement('canvas'),{width:S,height:S}));
  // where the dabbing hand lands in the picture, for the DAB! burst drawn on the card
  o.fx=null;if(po.fx){const h=po.fx.p,w=[0,1,2,3].map(r=>Mb[r]*h[0]+Mb[4+r]*h[1]+Mb[8+r]*h[2]+Mb[12+r]),X=vp[0]*w[0]+vp[4]*w[1]+vp[8]*w[2]+vp[12],Y=vp[1]*w[0]+vp[5]*w[1]+vp[9]*w[2]+vp[13],Wc=vp[3]*w[0]+vp[7]*w[1]+vp[11]*w[2]+vp[15];
    o.fx={x:(X/Wc*.5+.5)*S,y:(1-(Y/Wc*.5+.5))*S,k:po.fx.k,q:po.fx.q,s:po.fx.s};}const c=o.getContext('2d');
  c.clearRect(0,0,S,S);c.drawImage(cvs,0,cvs.height-S,S,S,0,0,S,S);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);return o}
