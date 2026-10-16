
// ================= helpers =================
const $=s=>document.querySelector(s);
const TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
function angDiff(a,b){let d=b-a;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function circ(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,TAU);if(col){c.fillStyle=col;}c.fill()}
const ORD=n=>n+(n%100>=11&&n%100<=13?'th':['th','st','nd','rd'][n%10]||'th');
function fmtT(t){const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(2)}
function shade(hex,amt){let n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=amt<0?0:255,p=Math.abs(amt);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

// ================= frogs =================
const FROGS=[
 {name:'Zippy',skin:'#7bdc3c',kart:'#ff4b3e',acc:'cap',accC:'#ff4b3e',spd:3,acl:4,hnd:3,line:'Zoom zoom, ribbit boom!'},
 {name:'Lulu',skin:'#ff8cc6',kart:'#9b5cff',acc:'bow',accC:'#ff3d8b',posh:1,spd:3,acl:3,hnd:5,line:"White, no sugar. I'm sweet enough!"},
 {name:'Bonk',skin:'#2fbfa8',kart:'#ffb627',acc:'horns',accC:'#fff1cf',fat:1,dopey:1,spd:5,acl:2,hnd:2,line:'Which way is forwards?'},
 {name:'Pip',skin:'#ffe14d',kart:'#2fa3ff',acc:'propeller',accC:'#ff4b3e',spd:2,acl:5,hnd:4,line:'Wizz round ya like a potataaaa!'},
 {name:'Mango',skin:'#ff9a3c',kart:'#14b37d',acc:'shades',accC:'#15151a',spd:4,acl:3,hnd:3,line:'My shades are HARD!'},
 {name:'Douglas Moleseed',skin:'#4aa8ff',kart:'#ffd23f',acc:'phones',accC:'#ff4b3e',spd:3,acl:4,hnd:4,line:'Beep boop, ribbit.'},
 {name:'Fern',skin:'#3e9b4f',kart:'#ff7ab6',acc:'flowers',accC:'#ffffff',spd:4,acl:4,hnd:2,line:'Smell my flower power!'},
 {name:'Rocket',skin:'#9b6bff',kart:'#e8e8f0',acc:'antenna',accC:'#ffd23f',spd:5,acl:3,hnd:2,line:'Sometimes I forget to turn.'},
];
function drawFrogKart(c,f,o={}){
  const t=o.t||0;
  const kc=o.star?`hsl(${(t*420)%360},95%,62%)`:f.kart;
  const ol='rgba(45,20,90,.55)';
  c.lineJoin='round';
  for(const [wx,wy] of [[13,-15],[13,15],[-14,-16],[-14,16]]){c.fillStyle='#2b2140';rr(c,wx-8,wy-5,16,10,4);c.fill();c.fillStyle='rgba(255,255,255,.25)';rr(c,wx-6,wy-4,12,3,1.5);c.fill();}
  // body with gloss
  let g=c.createLinearGradient(0,-14,0,14);g.addColorStop(0,shade(kc.startsWith('#')?kc:'#ff66cc',.35));g.addColorStop(.5,kc);g.addColorStop(1,shade(kc.startsWith('#')?kc:'#ff66cc',-.25));
  c.fillStyle=o.star?kc:g;rr(c,-23,-14,46,28,12);c.fill();c.strokeStyle=ol;c.lineWidth=2.5;c.stroke();
  c.fillStyle='rgba(255,255,255,.45)';rr(c,-17,-11,30,5,2.5);c.fill();
  c.fillStyle='#fff';rr(c,18,-9,8,18,4);c.fill();c.strokeStyle=ol;c.lineWidth=2;c.stroke();
  c.fillStyle='#3b2a66';rr(c,-29,-16,8,32,4);c.fill();
  // frog head, glossy bean
  const sk=f.skin;
  g=c.createRadialGradient(-7,-5,2,-4,0,14);g.addColorStop(0,shade(sk,.45));g.addColorStop(.6,sk);g.addColorStop(1,shade(sk,-.2));
  if(f.fat){for(const sy of [-1,1])for(let r=0;r<2;r++){c.fillStyle=r?shade(sk,-.12):sk;c.beginPath();c.ellipse(-6+r*1.5,sy*(15+r*3.2),13-r*2,4.2,0,0,TAU);c.fill();c.strokeStyle=ol;c.lineWidth=1.6;c.stroke();}}  // fat rolls flopping over the sides
  c.fillStyle=g;circ(c,-4,0,f.fat?16:12.5);c.strokeStyle=ol;c.lineWidth=2;c.beginPath();c.arc(-4,0,f.fat?16:12.5,0,TAU);c.stroke();
  for(const ey of [-8.5,8.5]){g=c.createRadialGradient(3,ey-2,1,4,ey,8);g.addColorStop(0,shade(sk,.4));g.addColorStop(1,sk);c.fillStyle=g;circ(c,4,ey,7);c.beginPath();c.arc(4,ey,7,0,TAU);c.stroke();
    c.fillStyle='#fff';circ(c,5.2,ey,5);c.fillStyle='#1d1433';circ(c,6.8,ey,2.8);c.fillStyle='#fff';circ(c,7.6,ey-1,1.1);}
  c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(-8,-5,4,2.2,-.5,0,TAU);c.fill();
  c.strokeStyle='rgba(45,20,90,.7)';c.lineWidth=1.8;c.beginPath();c.arc(-4,0,9.5,-.5,.5);c.stroke();
  c.fillStyle='rgba(255,110,170,.6)';circ(c,2,-4,1.8);circ(c,2,4,1.8);
  const a=f.accC;
  switch(f.acc){
    case 'cap':c.fillStyle='#8b6b4e';c.beginPath();c.ellipse(-3,0,11,10,0,0,TAU);c.fill();c.fillStyle='#6f533b';rr(c,4,-6,7,12,3);c.fill();break;
    case 'bow':c.fillStyle=a;c.beginPath();c.moveTo(-14,0);c.lineTo(-22,-9);c.lineTo(-22,-1);c.closePath();c.fill();c.beginPath();c.moveTo(-14,0);c.lineTo(-22,9);c.lineTo(-22,1);c.closePath();c.fill();circ(c,-14,0,3.4);c.strokeStyle='#5fd3c4';c.lineWidth=4;c.beginPath();c.arc(-4,0,12,0,TAU);c.stroke();break;
    case 'horns':c.fillStyle='#8a5a30';rr(c,-14,-9,14,18,6);c.fill();c.fillStyle=a;c.beginPath();c.moveTo(-8,-8);c.quadraticCurveTo(-6,-20,-16,-22);c.lineTo(-12,-8);c.closePath();c.fill();c.beginPath();c.moveTo(-8,8);c.quadraticCurveTo(-6,20,-16,22);c.lineTo(-12,8);c.closePath();c.fill();break;
    case 'propeller':{c.fillStyle='#2fa3ff';circ(c,-6,0,7.5);c.fillStyle=a;c.fillRect(-8,-7,4,14);c.save();c.translate(-6,0);c.rotate(t*25);c.fillStyle='rgba(255,210,63,.9)';c.beginPath();c.ellipse(0,0,12,3,0,0,TAU);c.fill();c.restore();c.fillStyle='#333';circ(c,-6,0,1.8);break;}
    case 'shades':c.fillStyle='#1d1a22';c.beginPath();c.arc(-6,0,9.5,0,TAU);c.fill();c.fillStyle='#ffd23f';rr(c,-24,-7,10,14,3);c.fill();circ(c,-6,0,2.2);c.fillStyle=a;rr(c,2,-13.5,7,27,3);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(4,-11,2,6);c.fillRect(4,5,2,6);break;
    case 'phones':c.strokeStyle='#333';c.lineWidth=3;c.beginPath();c.arc(-5,0,12,Math.PI*.5,Math.PI*1.5);c.stroke();c.fillStyle=a;rr(c,-9,-15,8,6,2);c.fill();rr(c,-9,9,8,6,2);c.fill();break;
    case 'flowers':for(let i=0;i<5;i++){const an=Math.PI*.6+i*Math.PI*.2;const x=-4+Math.cos(an)*11,y=Math.sin(an)*11;c.fillStyle=i%2?'#ffd23f':a;circ(c,x,y,3);c.fillStyle='#ff7ab6';circ(c,x,y,1.2);}break;
    case 'antenna':c.strokeStyle='#333';c.lineWidth=2;c.beginPath();c.moveTo(-8,-4);c.lineTo(-18,-12);c.moveTo(-8,4);c.lineTo(-18,12);c.stroke();c.fillStyle=a;circ(c,-18,-12,3.4);circ(c,-18,12,3.4);break;
  }
}

// ================= themes & decorations =================
const THEMES={
 pond:{lab:'Pond',g:'#4fd68a',g2:'#45c97f',road:'#8e7dff',eA:'#ffffff',eB:'#ff5fa2',d:['pond','reed','flower','bush']},
 meadow:{lab:'Meadow',g:'#8fe05a',g2:'#82d24f',road:'#ff9f43',eA:'#ffffff',eB:'#4d7cff',d:['tree','flower','bush','rock']},
 mushroom:{lab:'Forest',g:'#7ee08a',g2:'#70d27c',road:'#c58cff',eA:'#ffffff',eB:'#ff4f6d',d:['mushroom','flower','bush','mushroom']},
 swamp:{lab:'Swamp',g:'#5fbf74',g2:'#55b169',road:'#9b8cff',eA:'#d6ff5c',eB:'#2f9a5a',d:['pond','reed','log','bush']},
 candy:{lab:'Candy',g:'#ffc6ec',g2:'#ffb8e5',road:'#8f5cff',eA:'#ffffff',eB:'#ff4fa8',d:['lolly','cane','gumdrop']},
 beach:{lab:'Beach',g:'#ffe39a',g2:'#ffd985',road:'#4fc3ff',eA:'#ffffff',eB:'#ff7a59',d:['palm','ball','umbrella','shell']},
 desert:{lab:'Desert',g:'#ffc978',g2:'#ffbe66',road:'#ff6f7d',eA:'#fff3d6',eB:'#ff9d00',d:['cactus','rock','tumble','pyramid']},
 snow:{lab:'Snow',g:'#eef7ff',g2:'#e0efff',road:'#6fa8ff',eA:'#ffffff',eB:'#ff6fb5',d:['pine','snowman','ice','pine']},
 jungle:{lab:'Jungle',g:'#3fcf6f',g2:'#36c065',road:'#ffb347',eA:'#ffffff',eB:'#ff5fa2',d:['palm','fern','tree','flower']},
 autumn:{lab:'Autumn',g:'#ffb056',g2:'#ffa548',road:'#a26bff',eA:'#ffffff',eB:'#ff5a4e',d:['autumnTree','leaves','pumpkin','acorn']},
 farm:{lab:'Farm',g:'#a4e36a',g2:'#97d65e',road:'#ffcc4d',eA:'#ffffff',eB:'#ff5a5a',d:['hay','barn','fence','sunflower']},
 toy:{lab:'Toys',g:'#8fdcff',g2:'#80d2fb',road:'#ff6fb5',eA:'#ffe14d',eB:'#5b6cff',d:['block','ball','duck','block']},
 pirate:{lab:'Ocean',g:'#36c6f4',g2:'#2fbbe9',road:'#ffcf7a',eA:'#ffffff',eB:'#ff7a3d',d:['island','barrel','chest','ship']},
 crystal:{lab:'Cave',g:'#6b4fd8',g2:'#6247cc',road:'#ff7ad9',eA:'#7ef3ff',eB:'#ffffff',d:['crystal','rockDark','glow','crystal']},
 neon:{lab:'City',g:'#4a35b8',g2:'#4230a8',road:'#ff4fd8',eA:'#3df4ff',eB:'#ffe14d',d:['building','lamp','glow','building']},
 volcano:{lab:'Volcano',g:'#ff8a5c',g2:'#ff7d4f',road:'#6f4bd8',eA:'#ffd23f',eB:'#ff3d5a',d:['lava','rockDark','ember','lava']},
 haunted:{lab:'Spooky',g:'#7a63d6',g2:'#7059ca',road:'#9fe870',eA:'#ffffff',eB:'#ff8a2a',d:['ghost','deadTree','pumpkin','tomb']},
 reef:{lab:'Undersea',g:'#3fc9e8',g2:'#36bddc',road:'#ffe2a8',eA:'#ffffff',eB:'#ff6f91',d:['coral','fish','shell','bubbles']},
 cloud:{lab:'Sky',g:'#b9e3ff',g2:'#addcff',road:'#fdf3ff',eA:'#ffd23f',eB:'#ff8cc6',d:['cloud','tower','starDeco','cloud']},
 moon:{lab:'Space',g:'#4b3fa8',g2:'#43389a',road:'#c9b8ff',eA:'#ffffff',eB:'#ffd23f',d:['crater','planet','starDeco','crater']},
 lagoon:{lab:'Pond',g:'#29c4f0',g2:'#22b6e3',road:'#eaa865',eA:'#9bf06a',eB:'#3fbf55',d:['lilypad','lilypad','lotus','reed','ripple','ripple','duck','fish','log'],water:1,planks:1},
};
const SKIES={pond:['#5ec8ff','#dff6ff'],meadow:['#5ec8ff','#e6f8ff'],mushroom:['#6fd0ff','#e9fbff'],swamp:['#7fd6c8','#e2fff4'],candy:['#ff9ad5','#ffe6f6'],beach:['#3fc0ff','#dcf7ff'],desert:['#ffb15e','#fff0c9'],snow:['#9fd2ff','#f4faff'],jungle:['#4fd3b0','#e0fff0'],autumn:['#ff9f6b','#ffe8cc'],farm:['#6fd0ff','#e8f9ff'],toy:['#a98bff','#ffe3f6'],pirate:['#4fc0ff','#e0f7ff'],crystal:['#3a2a8f','#b7a2ff'],neon:['#1d1660','#ff8ae0'],volcano:['#ff5a4e','#ffc98a'],haunted:['#3b2a7a','#b3a0ff'],reef:['#1f8fd6','#9cecff'],cloud:['#7fc8ff','#ffffff'],moon:['#140f3a','#7a62d8'],lagoon:['#4fc8ff','#e8fbff']};
for(const k in THEMES)THEMES[k].sky=SKIES[k];
const BIG={pond:1,barn:1,ship:1,building:1,island:1,tower:1,pyramid:1,lava:1};
function drawDeco(c,d,t){
  const s=d.s;c.save();c.translate(d.x,d.y);c.rotate(d.r);
  const sh=()=>{c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(s*.15,s*.2,s*.9,s*.7,0,0,TAU);c.fill();};
  switch(d.type){
  case 'lilypad':{c.fillStyle='rgba(0,60,90,.18)';circ(c,4,5,s*.8);const g=c.createRadialGradient(-s*.2,-s*.2,2,0,0,s*.8);g.addColorStop(0,'#9bf06a');g.addColorStop(1,'#3fbf55');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.arc(0,0,s*.75,.35,TAU-.05);c.closePath();c.fill();c.strokeStyle='rgba(30,110,50,.5)';c.lineWidth=2;for(let i=0;i<6;i++){const a=.8+i*.95;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*s*.62,Math.sin(a)*s*.62);c.stroke();}if(d.v%3===0){c.fillStyle='#ff8cc6';circ(c,-s*.2,-s*.15,s*.18);c.fillStyle='#ffe14d';circ(c,-s*.2,-s*.15,s*.07);}if(d.v%5===1){c.save();c.rotate(-d.r);c.scale(.9,.9);c.fillStyle='#62d65a';circ(c,0,0,9);circ(c,5,-5,4.5);circ(c,5,5,4.5);c.fillStyle='#fff';circ(c,6,-5,3);circ(c,6,5,3);c.fillStyle='#111';circ(c,7,-5,1.5);circ(c,7,5,1.5);c.restore();}break;}
  case 'lotus':for(let i=0;i<8;i++){c.save();c.rotate(i/8*TAU);c.fillStyle=i%2?'#ff9fd0':'#ffc4e6';c.beginPath();c.ellipse(s*.28,0,s*.3,s*.13,0,0,TAU);c.fill();c.restore();}c.fillStyle='#ffe14d';circ(c,0,0,s*.14);break;
  case 'ripple':{c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;for(let i=0;i<3;i++){const p=((t*.6+i/3+d.v*.1)%1);c.globalAlpha=1-p;c.beginPath();c.ellipse(0,0,s*p*1.2,s*p*.8,0,0,TAU);c.stroke();}c.globalAlpha=1;break;}
  case 'pond':c.fillStyle='#2f9fd6';c.beginPath();c.ellipse(0,0,s*1.4,s,0,0,TAU);c.fill();c.fillStyle='#5bc4ef';c.beginPath();c.ellipse(-s*.2,-s*.2,s*.9,s*.55,0,0,TAU);c.fill();
    for(let i=0;i<3;i++){c.fillStyle='#3fae3f';c.beginPath();const x=(i-1)*s*.6,y=(i%2?.3:-.2)*s;c.moveTo(x,y);c.arc(x,y,s*.22,.4,TAU-.1);c.closePath();c.fill();}c.fillStyle='#ff8cc6';circ(c,s*.6,s*.3,s*.08);break;
  case 'reed':c.strokeStyle='#4c7a2a';c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*4,s*.4);c.lineTo(i*6,-s*.4);c.stroke();c.fillStyle='#7a4a24';c.fillRect(i*6-2.5,-s*.4,5,s*.25);}break;
  case 'flower':for(let i=0;i<5;i++){const a=i/5*TAU;c.fillStyle=['#ff5a8a','#ffd23f','#ffffff','#b46bff'][d.v%4];circ(c,Math.cos(a)*s*.3,Math.sin(a)*s*.3,s*.25);}c.fillStyle='#ffb000';circ(c,0,0,s*.2);break;
  case 'bush':sh();c.fillStyle='#2f8a3a';circ(c,-s*.35,0,s*.5);circ(c,s*.35,0,s*.5);circ(c,0,-s*.25,s*.55);c.fillStyle='#45a84e';circ(c,-s*.1,-s*.35,s*.25);break;
  case 'tree':case 'autumnTree':sh();c.fillStyle=d.type=='tree'?'#2e8b3a':['#e36b2a','#f2a33a','#c9452b'][d.v%3];circ(c,0,0,s*.8);c.fillStyle='rgba(255,255,255,.15)';circ(c,-s*.25,-s*.25,s*.35);c.fillStyle='rgba(0,0,0,.1)';circ(c,s*.25,s*.25,s*.3);break;
  case 'rock':case 'rockDark':sh();c.fillStyle=d.type=='rock'?'#9a958d':'#2a2230';c.beginPath();c.moveTo(-s*.6,s*.2);c.lineTo(-s*.4,-s*.4);c.lineTo(s*.3,-s*.5);c.lineTo(s*.6,0);c.lineTo(s*.3,s*.45);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.moveTo(-s*.4,-s*.4);c.lineTo(s*.3,-s*.5);c.lineTo(0,-s*.1);c.closePath();c.fill();break;
  case 'mushroom':sh();c.fillStyle=d.v%2?'#ff4b3e':'#b46bff';circ(c,0,0,s*.7);c.fillStyle='#fff';circ(c,-s*.3,-s*.2,s*.15);circ(c,s*.25,-s*.3,s*.12);circ(c,s*.15,s*.3,s*.17);circ(c,-s*.25,s*.3,s*.1);break;
  case 'log':c.fillStyle='#7a4a24';rr(c,-s,-s*.25,s*2,s*.5,s*.25);c.fill();c.fillStyle='#c48a52';c.beginPath();c.ellipse(s,0,s*.12,s*.25,0,0,TAU);c.fill();break;
  case 'lolly':c.fillStyle='#fff';c.fillRect(-2,0,4,s*.9);for(let i=0;i<3;i++){c.fillStyle=['#ff4f9a','#ffd23f','#5fd3ff'][(i+d.v)%3];circ(c,0,0,s*.6-i*s*.18);}break;
  case 'cane':c.lineWidth=s*.2;c.lineCap='round';c.strokeStyle='#fff';c.beginPath();c.moveTo(0,s*.7);c.lineTo(0,-s*.2);c.arc(-s*.25,-s*.2,s*.25,0,Math.PI,true);c.stroke();c.strokeStyle='#ff3b5c';c.setLineDash([s*.15,s*.15]);c.stroke();c.setLineDash([]);break;
  case 'gumdrop':sh();c.fillStyle=['#62d65a','#ff5a4e','#ffd23f','#b46bff'][d.v%4];c.beginPath();c.arc(0,s*.2,s*.55,Math.PI,0);c.lineTo(s*.55,s*.3);c.lineTo(-s*.55,s*.3);c.fill();c.fillStyle='rgba(255,255,255,.4)';circ(c,-s*.2,-s*.05,s*.1);break;
  case 'palm':sh();c.fillStyle='#8a5a30';circ(c,0,0,s*.15);c.fillStyle='#2f9a3a';for(let i=0;i<6;i++){c.save();c.rotate(i/6*TAU);c.beginPath();c.ellipse(s*.45,0,s*.45,s*.13,0,0,TAU);c.fill();c.restore();}c.fillStyle='#6b3f1f';circ(c,s*.1,0,s*.08);circ(c,-s*.06,s*.08,s*.08);break;
  case 'ball':sh();for(let i=0;i<6;i++){c.fillStyle=['#ff4b3e','#fff','#2fa3ff','#fff','#ffd23f','#fff'][i];c.beginPath();c.moveTo(0,0);c.arc(0,0,s*.5,i/6*TAU,(i+1)/6*TAU);c.fill();}break;
  case 'umbrella':sh();for(let i=0;i<8;i++){c.fillStyle=i%2?'#fff':['#ff4b3e','#16b5c9','#ffb627'][d.v%3];c.beginPath();c.moveTo(0,0);c.arc(0,0,s*.8,i/8*TAU,(i+1)/8*TAU);c.fill();}break;
  case 'shell':c.fillStyle=['#ffd0c2','#ffe9a8','#e5d0ff'][d.v%3];c.beginPath();c.moveTo(0,s*.4);c.arc(0,0,s*.4,Math.PI*.8,Math.PI*.2,false);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1.5;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(0,s*.4);c.lineTo(i*s*.15,-s*.35);c.stroke();}break;
  case 'cactus':sh();c.fillStyle='#3e9b4f';rr(c,-s*.18,-s*.6,s*.36,s*1.2,s*.18);c.fill();rr(c,-s*.55,-s*.25,s*.25,s*.5,s*.12);c.fill();rr(c,s*.3,-s*.45,s*.25,s*.5,s*.12);c.fill();c.fillStyle='#ff7ab6';circ(c,0,-s*.6,s*.1);break;
  case 'tumble':c.strokeStyle='#a87a40';c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.arc(0,0,s*(.2+i*.07),i,i+4);c.stroke();}break;
  case 'pyramid':c.fillStyle='#d9a24f';c.beginPath();c.moveTo(-s,s*.8);c.lineTo(0,-s*.8);c.lineTo(s,s*.8);c.fill();c.fillStyle='#c48a3a';c.beginPath();c.moveTo(0,-s*.8);c.lineTo(s,s*.8);c.lineTo(s*.2,s*.8);c.fill();break;
  case 'pine':sh();c.fillStyle='#1f6b46';for(let i=0;i<3;i++){c.beginPath();c.moveTo(0,-s*.8+i*s*.35);c.lineTo(s*.6-i*s*.1,-s*.1+i*s*.35);c.lineTo(-s*.6+i*s*.1,-s*.1+i*s*.35);c.fill();}c.fillStyle='#fff';circ(c,0,-s*.75,s*.12);break;
  case 'snowman':sh();c.fillStyle='#fff';circ(c,0,s*.2,s*.45);circ(c,0,-s*.35,s*.32);c.fillStyle='#ff8a2a';c.beginPath();c.moveTo(0,-s*.35);c.lineTo(s*.35,-s*.3);c.lineTo(0,-s*.28);c.fill();c.fillStyle='#222';circ(c,-s*.1,-s*.45,s*.05);circ(c,s*.1,-s*.45,s*.05);c.fillStyle='#ff4b3e';c.fillRect(-s*.3,-s*.12,s*.6,s*.1);break;
  case 'ice':c.fillStyle='rgba(160,220,255,.9)';rr(c,-s*.5,-s*.5,s,s,s*.15);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(-s*.35,-s*.35,s*.15,s*.5);break;
  case 'fern':c.strokeStyle='#4fc25a';c.lineWidth=3;for(let i=0;i<7;i++){c.save();c.rotate(i/7*TAU);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(s*.3,-s*.2,s*.7,0);c.stroke();c.restore();}break;
  case 'leaves':for(let i=0;i<6;i++){c.fillStyle=['#e36b2a','#f2a33a','#c9452b','#ffcf3a'][i%4];c.beginPath();c.ellipse(Math.cos(i*1.7)*s*.5,Math.sin(i*2.3)*s*.4,s*.15,s*.08,i,0,TAU);c.fill();}break;
  case 'pumpkin':sh();c.fillStyle='#ff8a1f';c.beginPath();c.ellipse(-s*.2,0,s*.3,s*.45,0,0,TAU);c.fill();c.beginPath();c.ellipse(s*.2,0,s*.3,s*.45,0,0,TAU);c.fill();c.fillStyle='#ff9d3a';c.beginPath();c.ellipse(0,0,s*.3,s*.47,0,0,TAU);c.fill();c.fillStyle='#3e7a2a';c.fillRect(-s*.06,-s*.6,s*.12,s*.2);break;
  case 'acorn':c.fillStyle='#a5672d';c.beginPath();c.ellipse(0,s*.1,s*.25,s*.32,0,0,TAU);c.fill();c.fillStyle='#6b4423';c.beginPath();c.ellipse(0,-s*.15,s*.3,s*.15,0,0,TAU);c.fill();break;
  case 'hay':sh();c.fillStyle='#e9c46a';rr(c,-s*.6,-s*.4,s*1.2,s*.8,s*.1);c.fill();c.strokeStyle='#c9a24a';c.lineWidth=2;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*s*.2,-s*.4);c.lineTo(i*s*.2,s*.4);c.stroke();}break;
  case 'barn':sh();c.fillStyle='#c8333a';c.fillRect(-s*.8,-s*.6,s*1.6,s*1.2);c.fillStyle='#8a1f25';c.fillRect(-s*.8,-s*.08,s*1.6,s*.16);c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=4;c.strokeRect(-s*.8,-s*.6,s*1.6,s*1.2);break;
  case 'fence':c.fillStyle='#fff';for(let i=-2;i<=2;i++)c.fillRect(i*s*.3-3,-s*.3,6,s*.6);c.fillRect(-s*.7,-s*.15,s*1.4,5);c.fillRect(-s*.7,s*.1,s*1.4,5);break;
  case 'sunflower':for(let i=0;i<10;i++){const a=i/10*TAU;c.fillStyle='#ffd23f';c.beginPath();c.ellipse(Math.cos(a)*s*.3,Math.sin(a)*s*.3,s*.18,s*.08,a,0,TAU);c.fill();}c.fillStyle='#6b3f1f';circ(c,0,0,s*.22);break;
  case 'block':sh();c.fillStyle=['#ff4b3e','#2fa3ff','#ffd23f','#62d65a'][d.v%4];rr(c,-s*.45,-s*.45,s*.9,s*.9,s*.1);c.fill();c.fillStyle='rgba(255,255,255,.85)';c.font=`${s*.55|0}px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.fillText('ABCF'[d.v%4],0,s*.03);break;
  case 'duck':sh();c.fillStyle='#ffd23f';c.beginPath();c.ellipse(0,0,s*.5,s*.35,0,0,TAU);c.fill();circ(c,s*.35,-s*.15,s*.22);c.fillStyle='#ff8a1f';c.beginPath();c.ellipse(s*.6,-s*.12,s*.12,s*.06,0,0,TAU);c.fill();c.fillStyle='#111';circ(c,s*.4,-s*.22,s*.04);break;
  case 'island':c.fillStyle='#f5d995';c.beginPath();c.ellipse(0,0,s,s*.7,0,0,TAU);c.fill();c.fillStyle='#8a5a30';circ(c,0,0,s*.08);c.fillStyle='#2f9a3a';for(let i=0;i<5;i++){c.save();c.rotate(i/5*TAU);c.beginPath();c.ellipse(s*.3,0,s*.3,s*.09,0,0,TAU);c.fill();c.restore();}break;
  case 'barrel':sh();c.fillStyle='#9a6334';circ(c,0,0,s*.4);c.strokeStyle='#4a3020';c.lineWidth=3;c.beginPath();c.arc(0,0,s*.3,0,TAU);c.stroke();break;
  case 'chest':sh();c.fillStyle='#8a5a30';rr(c,-s*.5,-s*.32,s,s*.64,s*.08);c.fill();c.fillStyle='#ffd23f';c.fillRect(-s*.5,-s*.05,s,s*.1);c.fillRect(-s*.07,-s*.12,s*.14,s*.24);break;
  case 'ship':c.fillStyle='#7a4a24';c.beginPath();c.moveTo(-s,-s*.35);c.lineTo(s*.7,-s*.35);c.lineTo(s,0);c.lineTo(s*.7,s*.35);c.lineTo(-s,s*.35);c.closePath();c.fill();c.fillStyle='#fff';c.fillRect(-s*.3,-s*.6,s*.16,s*1.2);c.fillRect(s*.25,-s*.5,s*.14,s);c.fillStyle='#ff4b3e';c.fillRect(-s*.9,-s*.06,s*.3,s*.12);break;
  case 'crystal':for(let i=0;i<3;i++){c.save();c.rotate(i*2.1);c.fillStyle=['#7ef3ff','#c86bff','#ff7ab6'][(i+d.v)%3];c.beginPath();c.moveTo(0,-s*.7);c.lineTo(s*.18,0);c.lineTo(0,s*.1);c.lineTo(-s*.18,0);c.fill();c.restore();}break;
  case 'glow':{const g=c.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,d.v%2?'rgba(126,243,255,.45)':'rgba(255,61,240,.4)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;circ(c,0,0,s);break;}
  case 'building':c.fillStyle='#24244a';c.fillRect(-s*.7,-s*.7,s*1.4,s*1.4);for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.fillStyle=(i*7+j*3+d.v)%5<2?'#ffd23f':'#3df4ff';c.globalAlpha=.25+((i+j+d.v)%3)*.25;c.fillRect(-s*.55+i*s*.32,-s*.55+j*s*.32,s*.18,s*.18);}c.globalAlpha=1;c.strokeStyle='#ff3df0';c.lineWidth=3;c.strokeRect(-s*.7,-s*.7,s*1.4,s*1.4);break;
  case 'lamp':{const g=c.createRadialGradient(0,0,0,0,0,s);g.addColorStop(0,'rgba(255,240,180,.5)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;circ(c,0,0,s);c.fillStyle='#fff5c0';circ(c,0,0,s*.12);break;}
  case 'lava':{c.fillStyle='#ff5a1f';c.beginPath();c.ellipse(0,0,s*1.2,s*.8,0,0,TAU);c.fill();c.fillStyle='#ffb627';c.beginPath();c.ellipse(0,0,s*.8,s*.5,0,0,TAU);c.fill();c.fillStyle='#ffe66b';const b=Math.sin(t*3+d.v)*.1;circ(c,s*.2,-s*.1,s*(.15+b));circ(c,-s*.3,s*.15,s*(.1-b*.5));break;}
  case 'ember':c.fillStyle=`rgba(255,${120+((t*200+d.v*40)%100)|0},40,.8)`;circ(c,0,0,s*.15);break;
  case 'ghost':{const y=Math.sin(t*2+d.v)*s*.12;c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(0,y-s*.1,s*.4,Math.PI,0);c.lineTo(s*.4,y+s*.4);for(let i=0;i<4;i++)c.lineTo(s*.4-(i+.5)*s*.2,y+s*(i%2?.4:.3));c.lineTo(-s*.4,y+s*.4);c.fill();c.fillStyle='#222';circ(c,-s*.13,y-s*.12,s*.06);circ(c,s*.13,y-s*.12,s*.06);break;}
  case 'deadTree':c.strokeStyle='#4a3a40';c.lineWidth=4;c.lineCap='round';for(let i=0;i<5;i++){c.save();c.rotate(i/5*TAU);c.beginPath();c.moveTo(0,0);c.lineTo(s*.6,0);c.lineTo(s*.8,s*.15);c.stroke();c.restore();}c.fillStyle='#4a3a40';circ(c,0,0,s*.15);break;
  case 'tomb':sh();c.fillStyle='#8a8f9a';c.beginPath();c.arc(0,-s*.1,s*.3,Math.PI,0);c.lineTo(s*.3,s*.4);c.lineTo(-s*.3,s*.4);c.fill();c.fillStyle='#6f7480';c.fillRect(-s*.15,-s*.12,s*.3,s*.06);break;
  case 'coral':c.strokeStyle=['#ff7a59','#ff5aa8','#ffd23f','#b46bff'][d.v%4];c.lineWidth=s*.12;c.lineCap='round';for(let i=0;i<5;i++){c.save();c.rotate(i/5*TAU+.3);c.beginPath();c.moveTo(0,0);c.lineTo(s*.35,0);c.lineTo(s*.55,s*.15);c.moveTo(s*.35,0);c.lineTo(s*.55,-s*.15);c.stroke();c.restore();}break;
  case 'fish':{const x=Math.sin(t*1.5+d.v)*s*.4;c.fillStyle=['#ffb627','#ff5a4e','#7ef3ff'][d.v%3];c.beginPath();c.ellipse(x,0,s*.3,s*.16,0,0,TAU);c.fill();c.beginPath();c.moveTo(x-s*.25,0);c.lineTo(x-s*.45,-s*.15);c.lineTo(x-s*.45,s*.15);c.fill();c.fillStyle='#111';circ(c,x+s*.15,-s*.04,s*.04);break;}
  case 'bubbles':c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.arc(Math.cos(i*2)*s*.3,((t*30+i*20)%(s))-s*.5,s*(.06+i*.03),0,TAU);c.stroke();}break;
  case 'cloud':c.fillStyle='rgba(255,255,255,.95)';circ(c,-s*.4,0,s*.4);circ(c,s*.4,0,s*.4);circ(c,0,-s*.2,s*.5);circ(c,0,s*.15,s*.45);break;
  case 'tower':sh();c.fillStyle='#f3e9ff';circ(c,0,0,s*.6);c.fillStyle='#ff8cc6';c.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU;c.lineTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);}c.fill();c.fillStyle='#ffd23f';circ(c,0,0,s*.12);break;
  case 'starDeco':{c.fillStyle=d.v%2?'#ffd23f':'#fff';c.globalAlpha=.6+Math.sin(t*3+d.v)*.4;star(c,0,0,s*.3,s*.12,5);c.fill();c.globalAlpha=1;break;}
  case 'crater':c.fillStyle='rgba(0,0,0,.25)';circ(c,0,0,s*.6);c.fillStyle='rgba(255,255,255,.07)';circ(c,-s*.08,-s*.08,s*.45);break;
  case 'planet':c.fillStyle=['#ff7ab6','#4fd0ef','#ffb627'][d.v%3];circ(c,0,0,s*.5);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.beginPath();c.ellipse(0,0,s*.85,s*.2,-.4,0,TAU);c.stroke();break;
  }
  c.restore();
}
function star(c,x,y,R,r,n){c.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,rad=i%2?r:R;c.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad);}c.closePath()}
const patCache={};
function groundPattern(c,th){
  if(patCache[th.g])return patCache[th.g];
  const p=document.createElement('canvas');p.width=p.height=320;const x=p.getContext('2d');x.fillStyle=th.g;x.fillRect(0,0,320,320);
  if(th.water){x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=5;x.lineCap='round';const r=mulberry(3);for(let i=0;i<14;i++){const px=r()*320,py=r()*320;for(const ox of[-320,0,320])for(const oy of[-320,0,320]){x.beginPath();x.moveTo(px+ox-22,py+oy);x.quadraticCurveTo(px+ox-11,py+oy-8,px+ox,py+oy);x.quadraticCurveTo(px+ox+11,py+oy+8,px+ox+22,py+oy);x.stroke();}}}
  else{x.fillStyle=th.g2;x.fillRect(0,0,160,160);x.fillRect(160,160,160,160);
    x.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<2;i++)for(let j=0;j<2;j++){x.beginPath();x.arc(80+i*160,80+j*160,22,0,TAU);x.fill();}
    x.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<2;i++)for(let j=0;j<2;j++){x.beginPath();x.arc(i*160,j*160,12,0,TAU);x.fill();}}
  return patCache[th.g]=c.createPattern(p,'repeat');
}

// ================= items =================
const ITEMS={
 bubble:{name:'Bubble Blaster',desc:'Shoots a bouncy bubble ahead. Pop! They spin out.'},
 fly:{name:'Buzzy Fly',desc:'Chases the frog in front and makes them spin out.'},
 lily:{name:'Slippy Lily Pad',desc:'Drop it behind you. Oops, slippy!'},
 turbo:{name:'Turbo Hop',desc:'A big burst of speed.'},
 shield:{name:'Bubble Shield',desc:'Blocks the next thing that hits you.'},
 croak:{name:'Mega Croak',desc:'A giant CROAK makes the frogs ahead wobble.'},
 star:{name:'Rainbow Frog',desc:'Super fast, nothing can stop you, and bumping others spins them out!'},
 tongue:{name:'Sticky Tongue',desc:'Locks on to the frog in front. Press again and again to yank them back into a spin, until it runs out!'},
};
const ITEM_TABLE=[
 {lily:30,bubble:30,shield:20,fly:10,turbo:10,tongue:6},
 {bubble:20,fly:22,turbo:20,lily:10,shield:15,croak:10,tongue:18},
 {turbo:25,fly:18,star:20,croak:18,shield:10,bubble:5,tongue:16},
];
function pickItem(place,n){const f=(place-1)/Math.max(1,n-1);const tb=ITEM_TABLE[f<.25?0:f<.7?1:2];let tot=0;for(const k in tb)tot+=tb[k];let r=Math.random()*tot;for(const k in tb){r-=tb[k];if(r<=0)return k}return 'turbo'}
function drawItemIcon(c,type,x,y,s,t=0){
  c.save();c.translate(x,y);c.scale(s/40,s/40);
  switch(type){
  case 'bubble':{const g=c.createRadialGradient(-6,-6,2,0,0,16);g.addColorStop(0,'#ffffff');g.addColorStop(.4,'#a8ecff');g.addColorStop(1,'#3bb8e8');c.fillStyle=g;circ(c,0,0,15);c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(0,0,15,0,TAU);c.stroke();break;}
  case 'fly':c.fillStyle='rgba(220,245,255,.85)';c.beginPath();c.ellipse(-3,-9,9,5,-.5+Math.sin(t*40)*.3,0,TAU);c.fill();c.beginPath();c.ellipse(-3,9,9,5,.5-Math.sin(t*40)*.3,0,TAU);c.fill();c.fillStyle='#2a2a33';c.beginPath();c.ellipse(0,0,12,7,0,0,TAU);c.fill();c.fillStyle='#ff4b3e';circ(c,9,-4,4);circ(c,9,4,4);break;
  case 'lily':c.fillStyle='#3fae3f';c.beginPath();c.moveTo(0,0);c.arc(0,0,16,.45,TAU-.1);c.closePath();c.fill();c.strokeStyle='#2a7a2a';c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(0,0);const a=.9+i*1.05;c.lineTo(Math.cos(a)*13,Math.sin(a)*13);c.stroke();}c.fillStyle='#ff8cc6';circ(c,-4,-4,4);break;
  case 'turbo':c.fillStyle='#ffb627';c.beginPath();c.moveTo(-14,-12);c.lineTo(0,-12);c.lineTo(14,0);c.lineTo(0,12);c.lineTo(-14,12);c.lineTo(0,0);c.closePath();c.fill();c.fillStyle='#ff5a1f';c.beginPath();c.moveTo(-4,-6);c.lineTo(4,0);c.lineTo(-4,6);c.closePath();c.fill();break;
  case 'shield':c.strokeStyle='#7ef3ff';c.lineWidth=4;c.beginPath();c.arc(0,0,15,0,TAU);c.stroke();c.fillStyle='rgba(126,243,255,.3)';circ(c,0,0,15);c.fillStyle='#fff';circ(c,-6,-6,3);break;
  case 'croak':c.strokeStyle='#ffd23f';c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();c.arc(-8,0,6+i*7,-.8,.8);c.stroke();}c.fillStyle='#62d65a';circ(c,-10,0,7);c.fillStyle='#fff';circ(c,-8,-4,2.5);circ(c,-8,4,2.5);break;
  case 'tongue':c.lineCap='round';c.strokeStyle='#c2364a';c.lineWidth=9;c.beginPath();c.moveTo(-16,10);c.quadraticCurveTo(-4,-16,10,-3);c.stroke();c.strokeStyle='#ff5f8f';c.lineWidth=6;c.stroke();c.fillStyle='#ff3d78';circ(c,11,-2,7);c.fillStyle='rgba(255,255,255,.65)';circ(c,9,-4,2.4);c.fillStyle='#62d65a';c.beginPath();c.ellipse(-16,12,8,5,0,0,TAU);c.fill();break;
  case 'star':for(let i=0;i<6;i++){c.fillStyle=`hsl(${i*60+t*300},95%,60%)`;star(c,0,0,17-i*2.2,7-i*.9,5);c.fill();}break;
  }
  c.restore();
}

// ================= audio =================
let AC=null,sound=true;
function audio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();}
function beep(f,d=.12,type='square',v=.08,slide=0){if(!sound||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),AC.currentTime+d);g.gain.value=v;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d+.02)}
// "Oof!" - a rattly frog croak then a deflating wheeze, like the wind's been knocked out of it
let lastOof=0;
function frogOof(power=1,vol=1){
  if(!sound||!AC)return;const now=AC.currentTime;if(now-lastOof<.45)return;lastOof=now;
  const p=clamp(power,0,1),pf=.85+Math.random()*.35,V=(.35+.65*p)*vol,t=now+.01;
  const out=AC.createGain();out.gain.value=V*.9;out.connect(AC.destination);
  // 1) the croak "HURK": buzzy sawtooth, rattled by a fast wobble, shaped into an "oo" vowel
  const cr=AC.createOscillator();cr.type='sawtooth';const f0=200*pf;cr.frequency.setValueAtTime(f0,t);cr.frequency.exponentialRampToValueAtTime(f0*.42,t+.22+.1*p);
  const rat=AC.createOscillator();rat.type='square';rat.frequency.value=28+Math.random()*8;const ratG=AC.createGain();ratG.gain.value=.5;
  const crG=AC.createGain();crG.gain.setValueAtTime(0,t);crG.gain.linearRampToValueAtTime(1.1,t+.015);crG.gain.setTargetAtTime(0,t+.16+.1*p,.05);
  const am=AC.createGain();am.gain.value=.5;rat.connect(ratG).connect(am.gain);
  const vow=AC.createBiquadFilter();vow.type='bandpass';vow.Q.value=4;vow.frequency.setValueAtTime(950,t);vow.frequency.exponentialRampToValueAtTime(380,t+.25);
  const vow2=AC.createBiquadFilter();vow2.type='lowpass';vow2.frequency.value=2200;
  cr.connect(am).connect(vow).connect(vow2).connect(crG).connect(out);
  cr.start(t);rat.start(t);cr.stop(t+.5);rat.stop(t+.5);
  // 2) the wheeze "pfffffff": breathy noise sweeping down
  const wt=t+.17+.08*p,wd=.35+.45*p;
  const len=Math.floor(AC.sampleRate*(wd+.1)),buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  const nz=AC.createBufferSource();nz.buffer=buf;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.6;bp.frequency.setValueAtTime(2400,wt);bp.frequency.exponentialRampToValueAtTime(450,wt+wd);
  const nG=AC.createGain();nG.gain.setValueAtTime(0,wt);nG.gain.linearRampToValueAtTime(.55,wt+.04);nG.gain.exponentialRampToValueAtTime(.001,wt+wd);
  nz.connect(bp).connect(nG).connect(out);nz.start(wt);nz.stop(wt+wd+.05);
  // 3) a squeaky deflating-balloon whistle riding on top
  const wh=AC.createOscillator();wh.type='triangle';wh.frequency.setValueAtTime(820*pf,wt);wh.frequency.exponentialRampToValueAtTime(230*pf,wt+wd);
  const vib=AC.createOscillator();vib.frequency.value=11;const vibG=AC.createGain();vibG.gain.value=40*pf;vib.connect(vibG).connect(wh.frequency);
  const whG=AC.createGain();whG.gain.setValueAtTime(0,wt);whG.gain.linearRampToValueAtTime(.12+.1*p,wt+.05);whG.gain.exponentialRampToValueAtTime(.001,wt+wd);
  wh.connect(whG).connect(out);wh.start(wt);vib.start(wt);wh.stop(wt+wd+.05);vib.stop(wt+wd+.05);
  // 4) a little "gulp" at the very end on big hits
  if(p>.5){const gt=wt+wd*.9;const gp=AC.createOscillator();gp.type='sine';gp.frequency.setValueAtTime(300*pf,gt);gp.frequency.exponentialRampToValueAtTime(700*pf,gt+.08);
    const gG=AC.createGain();gG.gain.setValueAtTime(0,gt);gG.gain.linearRampToValueAtTime(.25,gt+.01);gG.gain.exponentialRampToValueAtTime(.001,gt+.12);gp.connect(gG).connect(out);gp.start(gt);gp.stop(gt+.15);}
}
function birdChirp(v){if(!sound||!AC||v<=0)return;const t=AC.currentTime;for(let i=0;i<3;i++){const o=AC.createOscillator(),gg=AC.createGain();o.type='sine';const t0=t+i*.09;o.frequency.setValueAtTime(2200,t0);o.frequency.exponentialRampToValueAtTime(3200,t0+.05);gg.gain.setValueAtTime(0,t0);gg.gain.linearRampToValueAtTime(.06*v,t0+.01);gg.gain.exponentialRampToValueAtTime(.001,t0+.07);o.connect(gg).connect(AC.destination);o.start(t0);o.stop(t0+.08);}}
function splatSound(v){if(!sound||!AC||v<=0)return;const t=AC.currentTime;const len=AC.sampleRate*.25|0,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),gg=AC.createGain();s.buffer=buf;f.type='lowpass';f.frequency.setValueAtTime(1400,t);f.frequency.exponentialRampToValueAtTime(300,t+.2);gg.gain.value=.5*v;s.connect(f).connect(gg).connect(AC.destination);s.start(t);
  const o=AC.createOscillator(),og=AC.createGain();o.frequency.setValueAtTime(260,t);o.frequency.exponentialRampToValueAtTime(70,t+.15);og.gain.setValueAtTime(.25*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+.2);}
function skidSound(v){if(!sound||!AC||v<=0)return;splatSound(v*.7);const t=AC.currentTime+.05;
  const o=AC.createOscillator(),og=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(500,t);for(let i=1;i<=8;i++)o.frequency.linearRampToValueAtTime(i%2?900:420,t+i*.08);og.gain.setValueAtTime(.09*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.75);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+.8);}
function revClassic(v=1){if(!sound||!AC)return;const t=AC.currentTime,d=.75;const out=AC.createGain();out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.16*v,t+.06);out.gain.setValueAtTime(.16*v,t+.4);out.gain.exponentialRampToValueAtTime(.001,t+d);out.connect(AC.destination);
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(2200,t+.32);lp.frequency.exponentialRampToValueAtTime(500,t+d);lp.connect(out);
  for(const [type,mul,det] of [['sawtooth',1,0],['square',1,-14],['sawtooth',.5,8]]){const o=AC.createOscillator();o.type=type;o.detune.value=det;o.frequency.setValueAtTime(55*mul,t);o.frequency.exponentialRampToValueAtTime(190*mul,t+.32);o.frequency.exponentialRampToValueAtTime(70*mul,t+d);
    const am=AC.createGain();am.gain.value=.6;const lfo=AC.createOscillator();lfo.type='square';lfo.frequency.setValueAtTime(18,t);lfo.frequency.linearRampToValueAtTime(42,t+.32);lfo.frequency.linearRampToValueAtTime(22,t+d);const lg=AC.createGain();lg.gain.value=.35;lfo.connect(lg).connect(am.gain);
    o.connect(am).connect(lp);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05);}}
function popClassic(v=1){if(!sound||!AC)return;const t0=AC.currentTime;const n=3+Math.random()*3|0;for(let i=0;i<n;i++){const t=t0+i*(.055+Math.random()*.05);const len=AC.sampleRate*.08|0,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let j=0;j<len;j++)d[j]=(Math.random()*2-1)*Math.pow(1-j/len,3);
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=buf;f.type='bandpass';f.frequency.value=700+Math.random()*900;f.Q.value=.8;g.gain.value=(.5+Math.random()*.4)*v;s.connect(f).connect(g).connect(AC.destination);s.start(t);
  const o=AC.createOscillator(),og=AC.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.06);og.gain.setValueAtTime(.35*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.08);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+.1);}}
// ---- start-line engine styles (chosen on the track screen) ----
function distCurve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=(1+k)*x/(1+k*Math.abs(x))}return c}
function nb(len){const b=AC.createBuffer(1,AC.sampleRate*len|0,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function envOut(t,peak,hold,d){const g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.05);g.gain.setValueAtTime(peak,t+hold);g.gain.exponentialRampToValueAtTime(.001,t+d);g.connect(AC.destination);return g}
function revEngine(v,cfg){const t=AC.currentTime,d=cfg.d;const out=envOut(t,cfg.vol*v,d*.55,d);const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cfg.lp[0],t);lp.frequency.linearRampToValueAtTime(cfg.lp[1],t+d*.45);lp.frequency.exponentialRampToValueAtTime(cfg.lp[0],t+d);lp.connect(out);
  for(const [type,mul,det] of cfg.osc){const o=AC.createOscillator();o.type=type;o.detune.value=det;o.frequency.setValueAtTime(cfg.f[0]*mul,t);o.frequency.exponentialRampToValueAtTime(cfg.f[1]*mul,t+d*.45);o.frequency.exponentialRampToValueAtTime(cfg.f[2]*mul,t+d);
    const am=AC.createGain();am.gain.value=.6;const lfo=AC.createOscillator();lfo.type='square';lfo.frequency.setValueAtTime(cfg.am[0],t);lfo.frequency.linearRampToValueAtTime(cfg.am[1],t+d*.45);lfo.frequency.linearRampToValueAtTime(cfg.am[0],t+d);const lg=AC.createGain();lg.gain.value=cfg.amDepth;lfo.connect(lg).connect(am.gain);
    o.connect(am).connect(lp);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05);}}
function bang(t,v,bp,q,dur,thump){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb(dur);f.type='bandpass';f.frequency.value=bp;f.Q.value=q;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f).connect(g).connect(AC.destination);s.start(t);
  if(thump){const o=AC.createOscillator(),og=AC.createGain();o.frequency.setValueAtTime(thump,t);o.frequency.exponentialRampToValueAtTime(thump*.3,t+dur);og.gain.setValueAtTime(v*.8,t);og.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+dur+.02);}}
const REV_STYLES={
  classic:{name:'Classic',rev:v=>revClassic(v),pop:v=>popClassic(v)},
  muscle:{name:'Muscle',rev:v=>revEngine(v,{d:1,vol:.2,f:[34,105,42],lp:[260,1300],am:[9,22],amDepth:.55,osc:[['sawtooth',1,0],['square',1,-18],['sawtooth',2,6]]}),
    pop:v=>{const t=AC.currentTime,n=5+Math.random()*4|0;for(let i=0;i<n;i++)bang(t+i*(.045+Math.random()*.06),(.45+Math.random()*.35)*v,280+Math.random()*260,.7,.11,95);}},
  moto:{name:'Motorbike',rev:v=>revEngine(v,{d:.7,vol:.13,f:[95,560,150],lp:[1200,5200],am:[45,95],amDepth:.4,osc:[['square',1,0],['sawtooth',1,12],['square',.5,-6]]}),
    pop:v=>{const t=AC.currentTime,n=2+Math.random()*3|0;for(let i=0;i<n;i++)bang(t+i*.07,(.4+Math.random()*.3)*v,1900+Math.random()*900,1.2,.045,180);}},
  jet:{name:'Jet',rev:v=>{const t=AC.currentTime,d=1.9;
      // gritty distortion stage feeding a deep lowpass
      const sh=AC.createWaveShaper();sh.curve=distCurve(38);sh.oversample='2x';const lp=AC.createBiquadFilter();lp.type='lowpass';lp.Q.value=4;lp.frequency.setValueAtTime(220,t);lp.frequency.exponentialRampToValueAtTime(1500,t+.55);lp.frequency.exponentialRampToValueAtTime(320,t+d);
      const out=envOut(t,.2*v,.6,d);sh.connect(lp).connect(out);
      // deep turbine core: detuned saws with a hard rumbling flutter
      for(const [type,mul,det] of [['sawtooth',1,0],['sawtooth',1,-22],['square',.5,9]]){const o=AC.createOscillator();o.type=type;o.detune.value=det;o.frequency.setValueAtTime(42*mul,t);o.frequency.exponentialRampToValueAtTime(128*mul,t+.55);o.frequency.exponentialRampToValueAtTime(58*mul,t+d);
        const am=AC.createGain();am.gain.value=.55;const fl=AC.createOscillator();fl.type='sawtooth';fl.frequency.setValueAtTime(24,t);fl.frequency.linearRampToValueAtTime(58,t+.55);fl.frequency.linearRampToValueAtTime(28,t+d);const fg=AC.createGain();fg.gain.value=.45;fl.connect(fg).connect(am.gain);
        o.connect(am).connect(sh);o.start(t);fl.start(t);o.stop(t+d+.05);fl.stop(t+d+.05);}
      // sub-bass growl
      const sub=AC.createOscillator();sub.type='sine';sub.frequency.setValueAtTime(30,t);sub.frequency.exponentialRampToValueAtTime(62,t+.55);sub.frequency.exponentialRampToValueAtTime(34,t+d);const sg=envOut(t,.3*v,.6,d);sub.connect(sg);sub.start(t);sub.stop(t+d+.05);
      // low, menacing turbine whine
      const wh=AC.createOscillator();wh.type='triangle';wh.frequency.setValueAtTime(160,t);wh.frequency.exponentialRampToValueAtTime(820,t+.55);wh.frequency.exponentialRampToValueAtTime(260,t+d);const wg=envOut(t,.05*v,.6,d);wh.connect(wg);wh.start(t);wh.stop(t+d+.05);
      // roaring exhaust air
      const s2=AC.createBufferSource(),f2=AC.createBiquadFilter(),g2=envOut(t,.32*v,.6,d);s2.buffer=nb(d+.1);f2.type='bandpass';f2.Q.value=.9;f2.frequency.setValueAtTime(140,t);f2.frequency.exponentialRampToValueAtTime(900,t+.55);f2.frequency.exponentialRampToValueAtTime(200,t+d);s2.connect(f2).connect(g2);s2.start(t);},
    pop:v=>{const t=AC.currentTime;
      // big afterburner FWOOMP: low thump, deep roar and a crackling tail
      const o=AC.createOscillator(),og=AC.createGain();o.type='sine';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(22,t+.45);og.gain.setValueAtTime(.55*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+.52);
      const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),sh=AC.createWaveShaper();sh.curve=distCurve(25);s.buffer=nb(.7);f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(110,t+.6);
      g.gain.setValueAtTime(.45*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.65);s.connect(sh).connect(f).connect(g).connect(AC.destination);s.start(t);
      for(let i=0;i<5;i++)bang(t+.12+i*(.05+Math.random()*.05),(.25+Math.random()*.2)*v,350+Math.random()*400,.8,.06,80);
      overrunTail(t+.3,1.1,v*.6);}},
  toy:{name:'Cartoon',rev:v=>{const t=AC.currentTime;let tt=t;for(let i=0;i<9;i++){const gap=.13-i*.011,f=130+i*28;const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(f,tt);o.frequency.exponentialRampToValueAtTime(f*.7,tt+gap*.8);g.gain.setValueAtTime(.26*v,tt);g.gain.exponentialRampToValueAtTime(.001,tt+gap*.9);o.connect(g).connect(AC.destination);o.start(tt);o.stop(tt+gap);tt+=gap;}
      const sw=AC.createOscillator(),sg=AC.createGain();sw.type='sine';sw.frequency.setValueAtTime(500,tt);sw.frequency.exponentialRampToValueAtTime(1600,tt+.25);sg.gain.setValueAtTime(.3*v,tt);sg.gain.exponentialRampToValueAtTime(.001,tt+.3);sw.connect(sg).connect(AC.destination);sw.start(tt);sw.stop(tt+.32);},
    pop:v=>{const t=AC.currentTime;for(let i=0;i<3;i++){const t0=t+i*.11;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(950,t0);o.frequency.exponentialRampToValueAtTime(260,t0+.07);g.gain.setValueAtTime(.3*v,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.09);o.connect(g).connect(AC.destination);o.start(t0);o.stop(t0+.1);bang(t0,.25*v,3000,1,.02,0);}}},
  froggy:{name:'Froggy',rev:v=>{const t=AC.currentTime,d=.8;const out=envOut(t,1.2*v,.45,d);const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=3;f.frequency.setValueAtTime(500,t);f.frequency.linearRampToValueAtTime(1400,t+.35);f.frequency.exponentialRampToValueAtTime(600,t+d);f.connect(out);
      const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(80,t);o.frequency.exponentialRampToValueAtTime(240,t+.35);o.frequency.exponentialRampToValueAtTime(95,t+d);const am=AC.createGain();am.gain.value=.5;const r=AC.createOscillator();r.type='square';r.frequency.value=27;const rg=AC.createGain();rg.gain.value=.5;r.connect(rg).connect(am.gain);
      o.connect(am).connect(f);o.start(t);r.start(t);o.stop(t+d+.05);r.stop(t+d+.05);},
    pop:v=>{ribbitSound(1.4*v);setTimeout(()=>plopSound(v),180);setTimeout(()=>plopSound(.8*v),280);}},
};
function revSound(v=1){if(!sound||!AC)return;(REV_STYLES[opts.revStyle]||REV_STYLES.classic).rev(v)}
function popSound(v=1){if(!sound||!AC)return;(REV_STYLES[opts.revStyle]||REV_STYLES.classic).pop(v)}
function previewRev(){audio();if(!sound||!AC)return;revSound(1);setTimeout(()=>popSound(1),opts.revStyle==='toy'?1150:opts.revStyle==='jet'?600:380);}
function ribbitSound(v=1){if(!sound||!AC)return;const t=AC.currentTime;for(let i=0;i<2;i++){const t0=t+i*.13;const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(170+i*40,t0);o.frequency.exponentialRampToValueAtTime(260+i*60,t0+.08);
  f.type='bandpass';f.frequency.value=900;f.Q.value=3;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.16*v,t0+.01);g.gain.exponentialRampToValueAtTime(.001,t0+.1);o.connect(f).connect(g).connect(AC.destination);o.start(t0);o.stop(t0+.12);}}
function buzzSound(v=1){if(!sound||!AC)return;const t=AC.currentTime,d=.5;const o=AC.createOscillator(),lfo=AC.createOscillator(),lg=AC.createGain(),g=AC.createGain(),f=AC.createBiquadFilter();
  o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(520,t+d);lfo.frequency.value=34;lg.gain.value=40;lfo.connect(lg).connect(o.frequency);f.type='bandpass';f.frequency.value=1200;f.Q.value=1.5;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.14*v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(f).connect(g).connect(AC.destination);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05);splatSound(.5*v);}
function plopSound(v=1){if(!sound||!AC||v<=0)return;const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(900,t+.08);g.gain.setValueAtTime(.18*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.14);}
function gulpSound(v=1){if(!sound||!AC||v<=0)return;const t=AC.currentTime;for(let i=0;i<2;i++){const t0=t+i*.16;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(240-i*60,t0);o.frequency.exponentialRampToValueAtTime(70,t0+.14);g.gain.setValueAtTime(.35*v,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.16);o.connect(g).connect(AC.destination);o.start(t0);o.stop(t0+.18);}splatSound(.6*v);}
function spitSound(v=1){if(!sound||!AC||v<=0)return;const t=AC.currentTime;const len=AC.sampleRate*.5|0,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  const sN=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();sN.buffer=buf;f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(3500,t+.45);g.gain.value=.35*v;sN.connect(f).connect(g).connect(AC.destination);sN.start(t);
  const o=AC.createOscillator(),og=AC.createGain();o.type='square';o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(700,t+.18);og.gain.setValueAtTime(.12*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+.27);splatSound(.8*v);}
function thwipSound(v=1){if(!sound||!AC||v<=0)return;const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(260,t);o.frequency.exponentialRampToValueAtTime(1500,t+.12);g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.18);}
function slurpSound(v=1){if(!sound||!AC||v<=0)return;const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain(),lfo=AC.createOscillator(),lg=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(140,t+.35);lfo.frequency.value=22;lg.gain.value=60;lfo.connect(lg).connect(o.frequency);
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=1600;g.gain.setValueAtTime(.18*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(f).connect(g).connect(AC.destination);o.start(t);lfo.start(t);o.stop(t+.42);lfo.stop(t+.42);
  setTimeout(()=>beep(300,.25,'sine',.1*v,500),220);}
// funny noises for each frog on the selection screen
function fvTone(type,f0,f1,t0,dur,vol,o={}){const os=AC.createOscillator(),g=AC.createGain();os.type=type;os.frequency.setValueAtTime(f0,t0);os.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);
  if(o.vib){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=o.vib;lg.gain.value=o.vd||f0*.06;l.connect(lg).connect(os.frequency);l.start(t0);l.stop(t0+dur+.05);}
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.015);g.gain.setValueAtTime(vol,t0+dur*.7);g.gain.exponentialRampToValueAtTime(.001,t0+dur);let n=os;if(o.bp){const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=o.bp;f.Q.value=o.q||2;os.connect(f);n=f;}n.connect(g).connect(AC.destination);os.start(t0);os.stop(t0+dur+.05);}
function fvNoise(t0,dur,vol,bp,q=1){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb(dur+.05);f.type='bandpass';f.frequency.value=bp;f.Q.value=q;g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f).connect(g).connect(AC.destination);s.start(t0);}
// realistic frog calls: pulse trains of a harmonic croak shaped by throat resonances
function croak(t0,notes,formants,vol=1){const sr=AC.sampleRate;let end=0;for(const n of notes)end=Math.max(end,n.at+n.dur);const len=Math.ceil((end+.08)*sr),buf=AC.createBuffer(1,len,sr),d=buf.getChannelData(0);
  for(const n of notes){const s0=Math.floor(n.at*sr),ns=Math.floor(n.dur*sr);let ph=0,pp=0;const H=n.harm||8,sharp=n.sharp||5;
    for(let i=0;i<ns;i++){const u=i/ns,t=i/sr;const f=n.f0[0]*Math.pow(n.f0[1]/n.f0[0],u);const rate=n.rate?n.rate[0]+(n.rate[1]-n.rate[0])*u:0;
      ph+=2*Math.PI*f/sr;let c=0;for(let h=1;h<=H;h++)c+=Math.sin(ph*h)/Math.pow(h,n.tilt||1.1);c+=(Math.random()*2-1)*(n.noise||.15);
      let e=1;if(rate>0){pp+=rate/sr;if(pp>=1)pp-=1;e=Math.exp(-sharp*pp)*(1-Math.exp(-pp*60));}
      const env=Math.min(1,u*n.dur/.012)*Math.min(1,(1-u)*n.dur/.03);d[s0+i]+=c*e*env*(n.vol||1);}}
  const src=AC.createBufferSource();src.buffer=buf;const out=AC.createGain();out.gain.value=.16*vol;out.connect(AC.destination);
  for(const [f,q,g] of formants){const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=q;const fg=AC.createGain();fg.gain.value=g;src.connect(bp).connect(fg).connect(out);}
  src.start(t0);}
// a croaky talking frog: shapes a buzzy voice with mouth resonances to say "ohhh... okaaay"
function frogSpeak(t0,v=1){const sr=AC.sampleRate;
  // keyframes: time, pitch, loudness, F1, F2, F3
  const K=[[0,150,0,520,920,2500],[.06,150,1,500,900,2500],[.55,122,.9,380,760,2400],[.66,118,0,380,760,2400],
           [.86,142,0,480,880,2450],[.9,142,.9,480,880,2450],[1.0,138,.85,470,900,2450],[1.02,138,0,470,900,2450],
           [1.1,140,0,600,1750,2600],[1.12,140,.95,600,1750,2600],[1.35,152,1,520,1950,2650],[1.65,128,.9,420,2150,2700],[1.85,108,0,380,2250,2700]];
  const end=K[K.length-1][0]+.05,len=Math.ceil(end*sr),buf=AC.createBuffer(1,len,sr),d=buf.getChannelData(0);
  const at=(t,c)=>{let i=0;while(i<K.length-2&&K[i+1][0]<t)i++;const a=K[i],b=K[i+1];const u=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]||1)));return a[c]+(b[c]-a[c])*u};
  let ph=0;for(let i=0;i<len;i++){const t=i/sr;const f=at(t,1)*(1+.02*Math.sin(t*2*Math.PI*5));const amp=at(t,2);ph+=2*Math.PI*f/sr;if(amp<=0.001)continue;
    let c=0;const H=Math.min(28,Math.floor(4200/f));for(let h=1;h<=H;h++)c+=Math.sin(ph*h)/h;
    const rasp=1-.3*(.5+.5*Math.sin(t*2*Math.PI*32));d[i]=(c*rasp+(Math.random()*2-1)*.06)*amp;}
  const src=AC.createBufferSource();src.buffer=buf;const out=AC.createGain();out.gain.value=.38*v;out.connect(AC.destination);
  [[3,6,1.4],[4,10,.9],[5,12,.35]].forEach(([c,q,g])=>{const bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=q;bp.frequency.setValueAtTime(K[0][c],t0);for(const k of K)bp.frequency.linearRampToValueAtTime(k[c],t0+k[0]);const fg=AC.createGain();fg.gain.value=g;src.connect(bp).connect(fg).connect(out);});
  src.start(t0);
  // the "k" in okay
  const nb2=AC.createBufferSource(),nf=AC.createBiquadFilter(),ng=AC.createGain();nb2.buffer=nb(.06);nf.type='bandpass';nf.frequency.value=2100;nf.Q.value=1.5;ng.gain.setValueAtTime(.35*v,t0+1.05);ng.gain.exponentialRampToValueAtTime(.001,t0+1.1);nb2.connect(nf).connect(ng).connect(AC.destination);nb2.start(t0+1.04);}
const FROG_VOICES=[
  // Zippy: a quick, bright "rib-BIT!"
  t=>croak(t,[{at:0,dur:.09,f0:[380,470],rate:[55,60]},{at:.15,dur:.15,f0:[430,600],rate:[60,75]}],[[900,3,1.2],[1900,4,.8]],4.5),
  // Lulu: a sweet tree-frog "peep! peep! peeep!"
  t=>croak(t,[0,.2,.4].map((a,i)=>({at:a,dur:i===2?.22:.13,f0:[2500+i*80,3000+i*120],harm:2,tilt:2.5,noise:.03})),[[2900,1.2,1.4]],0.63),
  // Bonk: a little bullfrog "hrrm" then a slow, dopey "ohhh... okaaay"
  t=>{croak(t,[{at:0,dur:.16,f0:[115,100],rate:[22,20],sharp:3}],[[330,2.5,1.6],[780,3,1]],2.3);frogSpeak(t+.3,1);},
  // Pip: a tiny cricket-frog "gick-gick-gick-gick"
  t=>croak(t,[0,.08,.15,.21,.26].map(a=>({at:a,dur:.035,f0:[2800,3200],rate:[0,0],harm:4,noise:.35})),[[3000,2,1.3],[5500,3,.4]],2.1),
  // Mango: a lazy toad "brrrrr-ROAK"
  t=>croak(t,[{at:0,dur:.42,f0:[200,215],rate:[28,30],sharp:4},{at:.48,dur:.22,f0:[240,190],rate:[40,30],sharp:3,vol:1.2}],[[600,2.5,1.4],[1250,3,.8]],2.9),
  // Douglas Moleseed (was Gizmo): a chorus-frog "crrrreeeek" like a finger along a comb
  t=>croak(t,[{at:0,dur:.5,f0:[1300,1900],rate:[16,62],sharp:6,noise:.25}],[[1700,2,1.3],[3200,3,.6]],2.5),
  // Fern: a wood-frog "quack-quack-quack" chuckle
  t=>croak(t,[0,.13,.25].map((a,i)=>({at:a,dur:.08,f0:[330-i*15,280-i*15],rate:[45,40],sharp:4})),[[720,3,1.4],[1450,4,.7]],4.0),
  // Rocket: a big excited "ribbit-ribbit-RIBBIIIIT!"
  t=>croak(t,[{at:0,dur:.07,f0:[420,500],rate:[60,65]},{at:.1,dur:.09,f0:[460,560],rate:[65,70]},{at:.25,dur:.07,f0:[450,540],rate:[60,65]},{at:.35,dur:.38,f0:[500,820],rate:[70,90],vol:1.2}],[[950,3,1.2],[2000,4,.8]],3.5),
];
// each frog says a funny line, using the device's built-in voice tuned per frog, wrapped in frog sounds
// (a croak before, a gargly throat rumble that pulses on each word, and a ribbit after; croak only if there's no voice)
const FROG_LINES=[
  {line:'Zoom zoom! Catch me if you can!',pitch:1.15,rate:1.1,f0:150,fm:[[900,3,1.2],[1900,4,.7]]},
  {line:"I loike my coffee whoite, no sugar... I'm sweet enough, darl!",say:"I loike my coffee whoite, no sugar... I'm sweet enough, darl!",pitch:1.45,rate:1.05,f0:260,fm:[[1300,3,1.1],[2600,4,.6]]},
  {line:'Uhhh... okaaay... which way is forwards? I might need a poo... before the race.',say:'Uhhh okay which way is forwards? I might need a poo before the race.',pitch:.1,rate:.68,f0:62,fm:[[330,2.5,1.6],[780,3,1]]},
  {line:"I'm Pippa! I'm a beat ya, wizz round ya like a potataaaa!",say:"I'm Pippa! I'm a beat ya, whizz round ya like a potatahhh!",pitch:1.75,rate:1.15,f0:320,fm:[[1800,3,1.1],[3200,4,.5]]},
  {line:'Which loser is gonna hit the barrier first? My shades are HARD!',say:'Which loser is gonna hit the barrier first? My shades are hard!',pitch:.45,rate:.9,f0:95,fm:[[600,2.5,1.4],[1250,3,.8]]},
  {line:'Engines ready. Snacks ready. Let\'s go!',pitch:.8,rate:1,f0:130,fm:[[800,3,1.2],[1700,4,.7]]},
  {line:'Smell my flower power! Achoo!',pitch:1.25,rate:.95,f0:180,fm:[[720,3,1.4],[1450,4,.7]]},
  {line:'Sometimes... I forget to turn.',pitch:1,rate:1,f0:140,fm:[[950,3,1.2],[2000,4,.8]]},
];
let FV=null;function pickVoice(){try{const vs=speechSynthesis.getVoices();if(!vs.length)return null;
  return vs.find(v=>/en-GB/i.test(v.lang)&&/natural|google|neural/i.test(v.name))||vs.find(v=>/en-GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang)&&/natural|google|neural/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang))||vs[0]}catch(e){return null}}
try{if(window.speechSynthesis){FV=pickVoice();speechSynthesis.onvoiceschanged=()=>{FV=pickVoice()};}}catch(e){}
// short frog croaks in each frog's own throat
function frogCroak(L,t0,kind,v=1){const f=L.f0*1.6;const notes=kind==='intro'?[{at:0,dur:.1,f0:[f*.95,f*1.05],rate:[40,45],sharp:3.5},{at:.14,dur:.13,f0:[f,f*1.3],rate:[45,55],sharp:3.5}]
    :[{at:0,dur:.08,f0:[f*1.05,f*1.15],rate:[50,55],sharp:3.5},{at:.12,dur:.16,f0:[f*1.1,f*1.5],rate:[55,70],sharp:3.5}];croak(t0,notes,L.fm,2.6*v);}
// gargly throat rumble under the speech
let THROAT=null;
function throatStart(L){throatStop();if(!AC)return;const t=AC.currentTime;const o=AC.createOscillator(),o2=AC.createOscillator(),am=AC.createGain(),rat=AC.createOscillator(),rg=AC.createGain(),lp=AC.createBiquadFilter(),bp=AC.createBiquadFilter(),g=AC.createGain();
  o.type='sawtooth';o.frequency.value=L.f0;o2.type='sawtooth';o2.frequency.value=L.f0*1.01;rat.type='square';rat.frequency.value=22+L.f0/20;rg.gain.value=.5;am.gain.value=.5;rat.connect(rg).connect(am.gain);
  lp.type='lowpass';lp.frequency.value=Math.min(650,L.f0*4);bp.type='peaking';bp.frequency.value=L.fm[0][0];bp.gain.value=6;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07*(L.tv||1),t+.12);
  o.connect(am);o2.connect(am);am.connect(lp).connect(bp).connect(g).connect(AC.destination);o.start(t);o2.start(t);rat.start(t);THROAT={o,o2,rat,g,L};}
function throatPulse(){if(!THROAT||!AC)return;const t=AC.currentTime,{g,o,L}=THROAT;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(.16*(L.tv||1),t+.03);g.gain.exponentialRampToValueAtTime(.07*(L.tv||1),t+.2);
  o.frequency.cancelScheduledValues(t);o.frequency.setValueAtTime(L.f0*1.25,t);o.frequency.exponentialRampToValueAtTime(L.f0,t+.18);}
function throatStop(){if(!THROAT||!AC){THROAT=null;return}const t=AC.currentTime,{o,o2,rat,g}=THROAT;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+.1);[o,o2,rat].forEach(x=>{try{x.stop(t+.12)}catch(e){}});THROAT=null;}
// ---- talking mouths on the frog cards: real lip-sync shapes for each sound ----
// shape: open (jaw drop), width (stretch), round (pucker), teeth (upper teeth showing), tongue (tongue tip up), press (lips together), lipbite (f/v)
const VIS={rest:{open:0,width:1,round:0,teeth:0,tongue:0,press:0,lipbite:0},
  A:{open:.95,width:1,round:.1,teeth:.35,tongue:0},E:{open:.55,width:1.12,round:0,teeth:.6,tongue:0},I:{open:.36,width:1.25,round:0,teeth:1,tongue:0},
  O:{open:.7,width:.72,round:.85,teeth:.15,tongue:0},U:{open:.32,width:.52,round:1,teeth:0,tongue:0},MBP:{open:0,width:.92,round:0,teeth:0,tongue:0,press:1},
  FV:{open:.22,width:1.02,round:0,teeth:1,tongue:0,lipbite:1},TH:{open:.3,width:1,round:0,teeth:.6,tongue:1},L:{open:.42,width:1,round:0,teeth:.5,tongue:.8},
  S:{open:.28,width:1.12,round:0,teeth:1,tongue:0},K:{open:.35,width:1,round:0,teeth:.4,tongue:.2},R:{open:.3,width:.82,round:.5,teeth:.3,tongue:.2},W:{open:.22,width:.55,round:1,teeth:0,tongue:0}};
function textToVisemes(text){const out=[];const words=[];const re=/[A-Za-z']+|[.,!?;:]+|\.\.\./g;let m;
  while((m=re.exec(text))){const tok=m[0];if(/^[.,!?;:]+$/.test(tok)){out.push(['rest',/[.!?]/.test(tok)?3.2:2.2]);continue}
    words.push({char:m.index,at:out.length});let w=tok.toLowerCase().replace(/'/g,'');if(w.length>3)w=w.replace(/e$/,'');
    for(let k=0;k<w.length;){const two=w.substr(k,2),c=w[k];let v=null,n=1,len=1;
      if(two==='th'){v='TH';n=2}else if(two==='sh'||two==='ch'){v='S';n=2}else if(two==='ph'){v='FV';n=2}else if(two==='oo'||two==='ou'){v='U';n=2;len=1.6}
      else if(two==='ee'||two==='ea'||two==='ey'){v='I';n=2;len=1.6}else if(two==='ay'||two==='ai'){v='E';n=2;len=1.6}else if(two==='ow'){v='O';n=2;len=1.6}else if(two==='ck'||two==='ng'){v='K';n=2}
      else if('a'.includes(c)){v='A';len=1.4}else if(c==='e'){v='E';len=1.2}else if(c==='i'||c==='y'){v=k===w.length-1&&c==='y'?'I':'I';len=1.1}else if(c==='o'){v='O';len=1.4}else if(c==='u'){v='A';len=1.1}
      else if('mbp'.includes(c)){v='MBP'}else if('fv'.includes(c)){v='FV'}else if('tdnl'.includes(c)){v=c==='l'?'L':'TH';len=.7}else if('szcxj'.includes(c)){v='S';len=.8}else if('kgqh'.includes(c)){v='K';len=.7}else if(c==='r'){v='R'}else if(c==='w'){v='W'}else{v='K';len=.6}
      if(out.length&&out[out.length-1][0]===v&&v==='MBP'){out[out.length-1][1]+=.4}else out.push([v,len]);k+=n;}
    out.push(['gap',.35]);}
  return {segs:out,words};}
const SPK={i:-1,t:0};
const DANCE={i:-1,t0:0};const REDUCE_MOTION=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};   // which frog is dancing on the frog picker (the one under the mouse)   // which frog is talking right now (they bounce and go wide-eyed while they speak)
const MOUTH={i:-1,cur:Object.assign({},VIS.rest),tl:null,start:0,raf:0,last:0,unit:.08,active:false};
function mouthSay(text,rate,unit=.078){const v=textToVisemes(text);let t=0;const segs=v.segs.map(([k,l])=>{const d=l*unit/rate;const s={k,t,d};t+=d;return s});
  MOUTH.tl={segs,words:v.words.map(w=>({char:w.char,t:segs[w.at]?segs[w.at].t:t})),end:t};MOUTH.start=performance.now();MOUTH.active=true;mouthRun();}
function mouthSync(charIndex){const tl=MOUTH.tl;if(!tl)return;let best=null;for(const w of tl.words)if(Math.abs(w.char-charIndex)<=1){best=w;break}if(best)MOUTH.start=performance.now()-best.t*1000;}
function mouthTarget(now){const tl=MOUTH.tl;if(!tl)return VIS.rest;const t=(now-MOUTH.start)/1000;if(t<0||t>tl.end)return VIS.rest;for(const s of tl.segs)if(t>=s.t&&t<s.t+s.d)return s.k==='gap'?{open:.12,width:1,round:0,teeth:.2,tongue:0}:(VIS[s.k]||VIS.rest);return VIS.rest}
function drawMouth(i,s){drawCard(i,s)}
// ---- living frog cards: eyes that look around and blink, and smiles ----
const FACE=FROGS.map(()=>({look:[0,0],lookT:[0,0],nextLook:0,blink:0,nextBlink:performance.now()+1000+Math.random()*3000,smile:.4,smileT:.4,nextSmile:performance.now()+2000+Math.random()*4000}));
let POINTER={x:0,y:0,t:-1e9};
document.addEventListener('pointermove',e=>{POINTER={x:e.clientX,y:e.clientY,t:performance.now()}},{passive:true});
function cardEyesScreen(i){const cv=frogGrid.children[i]&&frogGrid.children[i].querySelector('canvas');if(!cv||!THUMB_EYES[i])return null;const r=cv.getBoundingClientRect(),k=r.width/256;const e=THUMB_EYES[i][1];return [r.left+e.c[0]*k,r.top+e.c[1]*k]}
function faceUpdate(now,dt){const speaking=MOUTH.raf&&MOUTH.i>=0;const ptr=now-POINTER.t<1500;const spk=speaking?cardEyesScreen(MOUTH.i):null;
  FACE.forEach((F,i)=>{
    {const ex=SPK.i===i&&SPK.mode==='excite',dp=SPK.i===i&&SPK.mode==='dope',po=SPK.i===i&&SPK.mode==='posh';F.posh=(F.posh||0)+((po?1:0)-(F.posh||0))*Math.min(1,dt*5);F.excite=(F.excite||0)+((ex?1:0)-(F.excite||0))*Math.min(1,dt*7);F.dope=(F.dope||0)+((dp?1:0)-(F.dope||0))*Math.min(1,dt*3);
     const card=frogGrid.children[i];if(card){if(card.classList.contains('talking')!==ex)card.classList.toggle('talking',ex);if(card.classList.contains('dopetalk')!==dp)card.classList.toggle('dopetalk',dp);if(card.classList.contains('poshtalk')!==po)card.classList.toggle('poshtalk',po);}}
    if(spk&&i!==MOUTH.i){const me=cardEyesScreen(i);if(me){const dx=spk[0]-me[0],dy=spk[1]-me[1],d=Math.hypot(dx,dy)||1;F.lookT=[dx/d*.9,dy/d*.7]}}
    else if(ptr){const me=cardEyesScreen(i);if(me){const dx=POINTER.x-me[0],dy=POINTER.y-me[1],d=Math.hypot(dx,dy)||1;const m=Math.min(.95,d/120);F.lookT=[dx/d*m,dy/d*m*.8]}}
    else if(speaking&&i===MOUTH.i)F.lookT=[0,0];
    else if(now>F.nextLook){const r=Math.random();F.lookT=r<.25?[0,0]:r<.4?[.55,.05]:[(Math.random()*2-1)*.9,(Math.random()*2-1)*.6];F.nextLook=now+700+Math.random()*2200;}
    const a=1-Math.exp(-dt*18);F.look[0]+=(F.lookT[0]-F.look[0])*a;F.look[1]+=(F.lookT[1]-F.look[1])*a;
    if(now>F.nextBlink){F.blinkStart=now;const fs=FUNNY_BLINK[i];F.style=fs&&Math.random()<.55?fs:'normal';F.nextBlink=now+(BLINK_LEN[F.style]||.2)*1000+2200+Math.random()*4200+(F.style==='normal'&&Math.random()<.2?-1800:0);}
    blinkShape(F,(now-(F.blinkStart||-1e9))/1000);
    {const cd=frogGrid.children[i];const hov=cd&&cd.matches(':hover');if(hov){F.smileT=1;F.nextSmile=Math.max(F.nextSmile,now+700);}
     // hovering starts this frog's dance (not while it's talking)
     const canDance=hov&&SPK.i!==i&&!(MOUTH.raf&&MOUTH.i===i)&&!REDUCE_MOTION.matches;if(canDance&&DANCE.i!==i){DANCE.i=i;DANCE.t0=now;}else if(!canDance&&DANCE.i===i)DANCE.i=-1;}
    if(now>F.nextSmile){F.smileT=F.smileT>.6?.4:1;F.nextSmile=now+(F.smileT>.6?1200+Math.random()*1500:2500+Math.random()*5000);}
    F.smile+=(F.smileT-F.smile)*(1-Math.exp(-dt*7));});}
// funny signature blinks: Zippy winks, Lulu flutters her lashes, Bonk nods off, Pip blinks out of sync, Douglas Moleseed's eyes boing, Fern scrunches
const FUNNY_BLINK=['wink','flutter','droopy','sync',null,'pop','squeeze',null];
const BLINK_LEN={normal:.2,wink:.75,flutter:1,droopy:2.2,sync:.95,pop:1.2,squeeze:.85};
function nb1(t){return t<0?0:t<.07?t/.07:t<.16?1-(t-.07)/.09:0}
function blinkShape(F,t){let far=0,near=0,sc=1,sq=0;const st=F.style||'normal';
  if(st==='normal'){far=near=nb1(t)}
  else if(st==='wink'){near=t<.1?t/.1:t<.55?1:t<.68?1-(t-.55)/.13:0;far=near*.3;}
  else if(st==='flutter'){if(t<.9){const ph=(t/.15)%1;far=near=Math.sin(Math.PI*ph);}}
  else if(st==='droopy'){if(t<.6)far=near=.6*t/.6;else if(t<1.5)far=near=.6+.1*Math.sin((t-.6)*7)+.25*(t-.6)/.9;else if(t<1.62)far=near=1;else if(t<1.7)far=near=1-(t-1.62)/.08;
    if(t>=1.62&&t<2.2)sc=1+.35*Math.exp(-(t-1.62)*4)*Math.cos((t-1.62)*18);}
  else if(st==='sync'){far=nb1(t)+nb1(t-.4);near=nb1(t-.2)+nb1(t-.6);}
  else if(st==='pop'){far=near=nb1(t);if(t>.16&&t<1.2)sc=1+.38*Math.exp(-(t-.16)*3.5)*Math.cos((t-.16)*22);}
  else if(st==='squeeze'){far=near=t<.08?t/.08:t<.65?1:t<.75?1-(t-.65)/.1:0;sq=t>.06&&t<.68?1:0;if(t>=.75&&t<.85)sc=1.15;}
  F.lid=[Math.min(1,far),Math.min(1,near)];F.blink=Math.max(F.lid[0],F.lid[1]);F.scale=sc;F.squeeze=sq;}
function drawEyes(c,i,k){const E=THUMB_EYES[i];if(!E||FROGS[i].acc==='shades')return;const F=FACE[i],skin=FROGS[i].skin;const far=E.find(e=>!e.near),near=E.find(e=>e.near);
  const sc=(F.scale||1)*(1+.15*(F.excite||0));   // eyes go big and excited while talking
  for(const e of [far,near]){const cx=e.c[0]*k,cy=e.c[1]*k,R0=e.r*k*.97,R=R0*sc,pr=e.pr*k*1.05*Math.min(1.15,sc);const lx=F.look[0],ly=F.look[1];const reach=Math.max(0,R-pr*1.05);
    const dp=F.dope||0,oth=e===far?near:far,dirx=Math.sign(oth.c[0]-e.c[0])||1;   // dopey: pupils cross towards each other and the lids droop
    const ps=F.posh||0;   // posh: snooty half-closed lids, gazing down her nose
    const px=cx+((lx*(1-dp)+dirx*.85*dp)*(1-ps)+.25*ps)*reach,py=cy+((ly*(1-dp)+.25*dp)*(1-ps)+.3*ps)*reach;const lidAmt=Math.max((F.lid?F.lid[e.near?1:0]:F.blink)||0,.45*dp,.42*ps);
    if(sc>1.01){c.save();if(e===far){c.beginPath();c.rect(0,0,999,999);c.arc(near.c[0]*k,near.c[1]*k,near.r*k*.97*sc,0,Math.PI*2,true);c.clip();}
      c.fillStyle='#ffffff';c.strokeStyle=shade(skin,-.35);c.lineWidth=Math.max(1.5,R*.08);c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.fill();c.stroke();c.restore();}
    c.save();c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.clip();
    if(e===far){const n=near,ncx=n.c[0]*k,ncy=n.c[1]*k,nR=n.r*k*.97;c.beginPath();c.rect(0,0,999,999);c.arc(ncx,ncy,nR,0,Math.PI*2,true);c.clip();}
    c.fillStyle='#1d1433';c.beginPath();c.ellipse(px,py,pr,pr*1.08,0,0,Math.PI*2);c.fill();c.fillStyle='#ffffff';c.beginPath();c.arc(px+pr*.35,py-pr*.4,pr*.36,0,Math.PI*2);c.fill();
    if(F.squeeze&&lidAmt>.9){c.fillStyle=shade(skin,.05);c.fillRect(cx-R-1,cy-R-1,2*R+2,2*R+2);c.strokeStyle=shade(skin,-.55);c.lineWidth=Math.max(2,R*.2);c.lineCap='round';c.lineJoin='round';
      const d=e.near?1:-1;c.beginPath();c.moveTo(cx-R*.45*d,cy-R*.45);c.lineTo(cx+R*.35*d,cy);c.lineTo(cx-R*.45*d,cy+R*.45);c.stroke();}
    else if(lidAmt>0){const lid=(cy-R)+2*R*lidAmt;const g=c.createLinearGradient(0,cy-R,0,lid+1);g.addColorStop(0,shade(skin,.15));g.addColorStop(1,shade(skin,-.1));c.fillStyle=g;c.fillRect(cx-R-1,cy-R-1,2*R+2,lid-(cy-R)+1);
      c.strokeStyle=shade(skin,-.45);c.lineWidth=Math.max(1.5,R*.12);c.beginPath();c.moveTo(cx-R,lid);c.quadraticCurveTo(cx,lid+R*.18,cx+R,lid);c.stroke();}
    c.restore();
    // Lulu's long eyelashes
    if(FUNNY_BLINK[i]==='flutter'){const lid=(cy-R)+2*R*lidAmt;c.strokeStyle='#1d1433';c.lineWidth=Math.max(1.5,R*.11);c.lineCap='round';
      for(let q=0;q<3;q++){const a=-Math.PI*.78+q*.28,bx=cx+Math.cos(a)*R*.95,by=lidAmt>.1?lid+R*.05*(q-1):cy+Math.sin(a)*R*.95;const ex=bx+Math.cos(a)*R*.55,ey=by+(lidAmt>.6?R*.45:Math.sin(a)*R*.55);c.beginPath();c.moveTo(bx,by);c.lineTo(ex,ey);c.stroke();}}}}
function drawSmile(c,i,k){const M=THUMB_MOUTH[i];if(!M)return;const sm=FACE[i].smile;const ax=M.a[0]*k,ay=M.a[1]*k,bx=M.b[0]*k,by=M.b[1]*k;
  const dx=(M.down[0]-M.c[0])*k,dy=(M.down[1]-M.c[1])*k,dl=Math.hypot(dx,dy)||1,ux=dx/dl,uy=dy/dl;const bl=Math.hypot(bx-ax,by-ay),w=bl*(1+.15*sm),mx=(ax+bx)/2,my=(ay+by)/2;
  const sx=(bx-ax)/bl,sy=(by-ay)/bl;const L=[mx-sx*w/2-ux*w*.1*sm,my-sy*w/2-uy*w*.1*sm],Rt=[mx+sx*w/2-ux*w*.1*sm,my+sy*w/2-uy*w*.1*sm];
  const dip=w*(.08+.22*sm),line=Math.max(2.2,w*.07),lipC='#3b1d5a';c.lineCap='round';c.lineJoin='round';
  if(sm>.7){const open=(sm-.7)/.3;const up=[mx+ux*dip*.25,my+uy*dip*.25],dn=[mx+ux*dip*(1.1+.5*open),my+uy*dip*(1.1+.5*open)];
    const shape=()=>{c.beginPath();c.moveTo(L[0],L[1]);c.quadraticCurveTo(up[0],up[1],Rt[0],Rt[1]);c.quadraticCurveTo(dn[0],dn[1],L[0],L[1]);c.closePath();};
    shape();c.fillStyle='#4a0c1c';c.fill();c.save();shape();c.clip();c.fillStyle='#ffffff';c.beginPath();c.moveTo(L[0],L[1]);c.quadraticCurveTo(up[0],up[1],Rt[0],Rt[1]);c.lineTo(Rt[0]+ux*dip*.4,Rt[1]+uy*dip*.4);c.quadraticCurveTo(up[0]+ux*dip*.45,up[1]+uy*dip*.45,L[0]+ux*dip*.4,L[1]+uy*dip*.4);c.closePath();c.fill();
    c.fillStyle='#ff6f91';c.beginPath();c.ellipse(dn[0]-ux*dip*.3,dn[1]-uy*dip*.3,w*.2,dip*.32,Math.atan2(sy,sx),0,Math.PI*2);c.fill();c.restore();
    c.strokeStyle=lipC;c.lineWidth=line;shape();c.stroke();}
  else{c.strokeStyle=lipC;c.lineWidth=line;c.beginPath();c.moveTo(L[0],L[1]);c.quadraticCurveTo(mx+ux*dip*1.6,my+uy*dip*1.6,Rt[0],Rt[1]);c.stroke();}
  if(sm>.3){c.strokeStyle=lipC;c.lineWidth=line*.6;for(const [P,sg] of [[L,-1],[Rt,1]]){c.beginPath();c.moveTo(P[0]+sx*sg*line*.2,P[1]+sy*sg*line*.2);c.lineTo(P[0]+sx*sg*line*1.4-ux*line*1.2,P[1]+sy*sg*line*1.4-uy*line*1.2);c.stroke();}}}
// Mango's dab: a burst of lines round his hand and a big "DAB!" that pops up each time he hits the pose
function drawDabFx(c,fx,k){if(fx.k<.5)return;const x=fx.x*k,y=fx.y*k,q=fx.q,g=Math.min(1,q/.5),W=c.canvas.width;c.save();c.lineCap='round';
  for(let j=0;j<10;j++){const an=j/10*TAU+.25,r0=(9+12*g)*k,r1=(17+(j%2?12:20)*g)*k;c.globalAlpha=Math.max(0,1-g*.75);c.strokeStyle=j%2?'#ffffff':'#ffd23f';c.lineWidth=(j%2?2.5:4)*k;
    c.beginPath();c.moveTo(x+Math.cos(an)*r0,y+Math.sin(an)*r0);c.lineTo(x+Math.cos(an)*r1,y+Math.sin(an)*r1);c.stroke();}
  const sc=q<.12?q/.12*1.4:q<.3?1.4-(q-.12)/.18*.4:1+.04*Math.sin(q*TAU*2),fs=30*k,tx=Math.max(56*k,Math.min(W-56*k,x+fx.s*8*k)),ty=Math.max(26*k,y-34*k);
  c.globalAlpha=q>1.3?Math.max(0,1-(q-1.3)/.15):1;c.translate(tx,ty);c.rotate(-.18*fx.s);c.scale(sc,sc);c.font=`${fs}px 'Titan One',system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';
  c.lineJoin='round';c.lineWidth=7*k;c.strokeStyle='#3b1d5a';c.strokeText('DAB!',0,0);c.fillStyle='#ffd23f';c.fillText('DAB!',0,0);c.restore();}
function drawCard(i,s){const card=frogGrid.children[i];if(!card)return;const cv=card.querySelector('canvas');if(!cv||!THUMBS[i])return;const c=cv.getContext('2d'),W=cv.width,k=W/256;
  if(DANCE.i===i&&!s){const img=danceFrame(i,(performance.now()-DANCE.t0)/1000,card.dataset.dance);if(img){c.clearRect(0,0,W,W);c.drawImage(img,0,0,W,W);if(img.fx)drawDabFx(c,img.fx,k);return;}}
  c.clearRect(0,0,W,W);c.drawImage(THUMBS_FACE[i]||THUMBS[i],0,0,W,W);if(THUMBS_FACE[i])drawEyes(c,i,k);
  const busy=s?s.open+s.press+s.round+Math.abs(s.width-1)+s.teeth+s.tongue:0;if(!s||busy<.05){if(THUMBS_FACE[i])drawSmile(c,i,k);return;}
  const M=THUMB_MOUTH[i];if(!M)return;

  const ax=M.a[0]*k,ay=M.a[1]*k,bx=M.b[0]*k,by=M.b[1]*k,cx=M.c[0]*k,cy=M.c[1]*k;const base=Math.hypot(bx-ax,by-ay)*1.15,ang=Math.atan2(by-ay,bx-ax);
  const dx=(M.down[0]-M.c[0])*k,dy=(M.down[1]-M.c[1])*k,dl=Math.hypot(dx,dy)||1;const skin=FROGS[i].skin;
  const Wd=base*s.width,H=base*(.05+.5*s.open),rk=.5+.45*s.round,up=H*(.22+.3*s.round),dn=H*(.95+.15*s.round);
  c.save();c.translate(cx+dx/dl*H*.3,cy+dy/dl*H*.3);c.rotate(ang);
  const lipW=Math.max(2,base*.075),lipC=shade(skin,-.45);
  if(s.press>.5&&s.open<.08){// lips pressed together
    c.strokeStyle=lipC;c.lineWidth=lipW*1.6;c.lineCap='round';c.beginPath();c.moveTo(-Wd/2,0);c.quadraticCurveTo(0,-base*.04,Wd/2,0);c.stroke();c.strokeStyle=shade(skin,.25);c.lineWidth=lipW*.6;c.beginPath();c.moveTo(-Wd*.35,base*.05);c.quadraticCurveTo(0,base*.09,Wd*.35,base*.05);c.stroke();c.restore();return;}
  const path=()=>{c.beginPath();c.moveTo(-Wd/2,0);c.bezierCurveTo(-Wd/2*rk,-up,Wd/2*rk,-up,Wd/2,0);c.bezierCurveTo(Wd/2*rk,dn,-Wd/2*rk,dn,-Wd/2,0);c.closePath();};
  path();c.fillStyle='#4a0c1c';c.fill();
  c.save();path();c.clip();
  c.fillStyle='#7a1a2e';c.fillRect(-Wd,dn*.35,Wd*2,dn);// back of throat shading
  const ty=dn*.92-s.tongue*H*.7;c.fillStyle='#ff6f91';c.beginPath();c.ellipse(0,ty,Wd*(.28+.08*(1-s.round)),Math.max(H*.3,base*.08),0,0,Math.PI*2);c.fill();
  if(s.teeth>.05){c.fillStyle='#ffffff';const th=Math.max(base*.1,H*.34)*Math.min(1,s.teeth+.2);c.fillRect(-Wd*.36,-up-2,Wd*.72,th+up*.9);c.strokeStyle='rgba(120,120,140,.5)';c.lineWidth=1;c.beginPath();c.moveTo(0,-up);c.lineTo(0,-up+th+up*.6);c.stroke();}
  if(s.lipbite>.3){c.fillStyle='#ffffff';c.fillRect(-Wd*.36,-up-2,Wd*.72,dn*.9+up);c.fillStyle=shade(skin,-.1);c.fillRect(-Wd,dn*.62,Wd*2,dn);}
  c.restore();
  c.strokeStyle=lipC;c.lineWidth=lipW;c.lineJoin='round';path();c.stroke();
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=lipW*.5;c.beginPath();c.moveTo(-Wd*.25,dn*.98);c.quadraticCurveTo(0,dn*1.08,Wd*.25,dn*.98);c.stroke();
  c.restore();}
function mouthRun(){if(MOUTH.raf)return;MOUTH.last=performance.now();const step=()=>{const now=performance.now(),dt=Math.min(.05,(now-MOUTH.last)/1000);MOUTH.last=now;
    const tg=mouthTarget(now),a=1-Math.exp(-dt*22);const cur=MOUTH.cur;let moving=0;for(const key of Object.keys(VIS.rest)){const v=tg[key]!==undefined?tg[key]:VIS.rest[key];cur[key]+= (v-cur[key])*a;moving+=Math.abs(v-cur[key]);}
    if(MOUTH.i>=0)drawMouth(MOUTH.i,cur);const tl=MOUTH.tl;const playing=tl&&(now-MOUTH.start)/1000<=tl.end;
    if(playing||moving>.01){MOUTH.raf=requestAnimationFrame(step)}else{MOUTH.raf=0;MOUTH.tl=null;if(MOUTH.i>=0)drawMouth(MOUTH.i,null);}};MOUTH.raf=requestAnimationFrame(step);}
let faceRaf=0,faceLast=0;
function faceLoop(){if(faceRaf)return;faceLast=performance.now();const step=now=>{if($('#sFrog').hidden){faceRaf=0;DANCE.i=-1;return}const dt=Math.min(.05,(now-faceLast)/1000);faceLast=now;faceUpdate(now,dt);
    for(let i=0;i<FROGS.length;i++)drawCard(i,(MOUTH.raf&&MOUTH.i===i)?MOUTH.cur:null);faceRaf=requestAnimationFrame(step)};faceRaf=requestAnimationFrame(step);}
function mouthReset(i){if(MOUTH.i>=0&&MOUTH.i!==i)drawMouth(MOUTH.i,null);MOUTH.i=i;MOUTH.tl=null;MOUTH.cur=Object.assign({},VIS.rest);}
function mouthPulse(){}
let SAYID=0;
// every frog talks in Bonk's deep, slow bullfrog voice (each keeps its own line)
// excitable frog voice: quicker and higher than the old dopey Bonk drawl, with a croaky throat buzz underneath
const BONK_VOICE={pitch:.62,rate:1.08,f0:88,fm:[[380,2.5,1.6],[900,3,1]]};
// Bonk keeps his original slow, deep, dopey drawl (no excited bouncing either)
// really dopey: as slow and deep as the voice will go, said in lazy little chunks with long gaps, drifting down to a final "duhh"
// Lulu: a terribly posh, terribly rich Australian lady - an Aussie woman's voice if the device has one,
// unhurried and a little higher, each phrase lilting upwards, with only a whisper of frog croak underneath
const POSH_VOICE={pitch:1.02,rate:.82,f0:150,fm:[[900,3,1.2],[2200,4,.6]],tv:.4};
let PV=null;
function pickPoshVoice(){try{const vs=speechSynthesis.getVoices();if(!vs.length)return null;
  const au=vs.filter(v=>/en[-_]AU/i.test(v.lang)),fem=/karen|catherine|natasha|annette|carly|freya|joanne|kim|tina|elsie|female/i,mal=/\bmale\b|lee|james|william|darren|duncan|ken|neil|tim\b|gordon/i;
  return au.find(v=>fem.test(v.name)&&/natural|online|neural|premium|enhanced/i.test(v.name))||au.find(v=>fem.test(v.name))||au.find(v=>!mal.test(v.name))||
    vs.find(v=>/en[-_]GB/i.test(v.lang)&&/female|serena|kate|stephanie|martha|hazel|susan|libby|sonia|maisie|fiona/i.test(v.name))||au[0]||null}catch(e){return null}}
try{if(window.speechSynthesis)setTimeout(()=>{PV=pickPoshVoice()},500)}catch(e){}
const DOPEY_VOICE={pitch:.06,rate:.72,f0:50,fm:[[300,2.5,1.8],[700,3,1]]};
function bonkCroak(t){croak(t,[{at:0,dur:.16,f0:[115,100],rate:[22,20],sharp:3},{at:.22,dur:.3,f0:[105,88],rate:[20,16],sharp:3}],[[330,2.5,1.6],[780,3,1]],2.3);}
// lines get excited: full stops become exclamation marks (but "..." pauses stay)
function exciteText(s){return s.replace(/([^.])\.(\s|$)/g,'$1!$2')}
// each sentence is spoken as its own little burst, with the pitch climbing higher and faster as they get more worked up
function frogVoice(i){audio();const dopey=!!FROGS[i].dopey,posh=!dopey&&!!FROGS[i].posh;const L=Object.assign({},FROG_LINES[i%FROG_LINES.length],dopey?DOPEY_VOICE:posh?POSH_VOICE:BONK_VOICE);if(!dopey&&!posh){L.line=exciteText(L.line);if(L.say)L.say=exciteText(L.say);}
  showSay(i,L.line,dopey?9000:posh?5000:3200);mouthReset(i);clearTimeout(SPK.t);SPK.i=i;SPK.mode=dopey?'dope':posh?'posh':'excite';SPK.t=setTimeout(()=>{if(SPK.i===i)SPK.i=-1},dopey?16000:posh?10000:8000);
  if(!sound||!AC){talkSilently(L,i);return;}const id=++SAYID;
  let done=false;const croakBack=()=>{if(done||id!==SAYID)return;done=true;throatStop();setDuck(1);bonkCroak(AC.currentTime+.02);mouthSay('ribbit... ribbit',1.3);clearTimeout(SPK.t);SPK.t=setTimeout(()=>{if(SPK.i===i)SPK.i=-1},1500)};
  try{const ss=window.speechSynthesis;if(!ss||!window.SpeechSynthesisUtterance){croakBack();return}
    ss.cancel();throatStop();setDuck(.3);
    const text=L.say||L.line,parts=dopey?[text]:(text.match(posh?/[^.!?,]+[.!?,]*\s*/g:/[^.!?]+[.!?]*\s*/g)||[text]).filter(x=>x.trim()),n=parts.length;
    FV=FV||pickVoice();if(posh)PV=PV||pickPoshVoice();const VV=posh&&PV?PV:FV;let started=false,bounds=0,tick=null,left=n;
    const finish=()=>{clearInterval(tick);if(id!==SAYID)return;SPK.i=-1;FACE[i].smileT=1;FACE[i].nextSmile=performance.now()+1600;throatStop();setDuck(1);};
    parts.forEach((ph,k)=>{const u=new SpeechSynthesisUtterance(ph.trim());
      u.pitch=dopey?(n===1?L.pitch:Math.max(0,L.pitch+(k===n-1?-.06:k%2?.02:.09))):posh?Math.min(2,L.pitch+.14*k+(/[,?]\s*$/.test(ph)?.1:0)):Math.min(2,L.pitch+(n>1?.32*k/(n-1):.15)+(/!\s*$/.test(ph)?.1:0));u.rate=dopey?L.rate:posh?L.rate*(k===n-1?1.05:1):Math.min(2,L.rate*(1+.06*k));u.volume=1;
      if(VV){u.voice=VV;u.lang=VV.lang}else u.lang=posh?'en-AU':'en-GB';
      u.onstart=()=>{if(id!==SAYID)return;if(!started){started=true;done=true;throatStart(L);
          // if this voice doesn't report words, pulse the throat on a quick steady beat instead
          tick=setInterval(()=>{if(bounds===0&&THROAT)throatPulse()},Math.round((dopey?300:posh?260:220)/L.rate));}
        bounds=0;throatPulse();mouthSay(u.text,u.rate);};
      u.onboundary=e=>{if(id!==SAYID)return;if(!e.name||e.name==='word'){bounds++;throatPulse();mouthSync(e.charIndex||0);}};
      u.onend=()=>{if(--left<=0)finish();};
      u.onerror=e=>{if(!started&&e.error!=='interrupted'&&e.error!=='canceled')croakBack();else if(id===SAYID){clearInterval(tick);SPK.i=-1;throatStop();setDuck(1)}};
      ss.speak(u);});
    setTimeout(()=>{if(id===SAYID&&!started&&!ss.speaking)croakBack()},1200);}
  catch(e){croakBack()}}
function talkSilently(L,i){mouthSay(L.say||L.line,L.rate);const ms=((MOUTH.tl&&MOUTH.tl.end)||2)*1000+250;clearTimeout(SPK.t);SPK.t=setTimeout(()=>{if(SPK.i===i)SPK.i=-1},ms);}
function showSay(i,text,ms=3200){const card=frogGrid.children[i];if(!card)return;frogGrid.querySelectorAll('.say').forEach(x=>x.remove());const b=document.createElement('div');b.className='say';b.textContent=text;card.append(b);
  clearTimeout(showSay.t);showSay.t=setTimeout(()=>b.remove(),ms);}
// ===== constant jetski engine =====
// A deep, gritty motor drone for YOUR jetski that never stops while you race. It idles and blips with the
// start revs, then pitch, grit, turbine whine and water rush all climb as you build speed. It screams
// when you're airborne (prop out of the water) and sags when you slow down, with a bit of inertia like a real engine.
let ENG={n:null,rpm:.12};const ENGS=[];   // ENG is the engine of the racer being updated or drawn; ENGS lists every running engine
function engineStart(){if(!AC||ENG.n)return;const t=AC.currentTime,n={};
  n.out=AC.createGain();n.out.gain.value=0;
  // split screen: player 1's engine sits a little to the left, player 2's to the right
  if(ENG.pan&&AC.createStereoPanner){const pn=AC.createStereoPanner();pn.pan.value=ENG.pan;n.out.connect(pn).connect(AC.destination);}else n.out.connect(AC.destination);
  n.lp=AC.createBiquadFilter();n.lp.type='lowpass';n.lp.Q.value=2.2;n.lp.frequency.value=280;n.lp.connect(n.out);
  n.sh=AC.createWaveShaper();n.sh.curve=distCurve(14);n.sh.oversample='2x';n.sh.connect(n.lp);
  // lumpy two-stroke firing: the motor voices pass through a gain pulsed at a quarter of the firing rate
  n.am=AC.createGain();n.am.gain.value=.62;n.am.connect(n.sh);
  n.lump=AC.createOscillator();n.lump.type='sawtooth';n.lump.frequency.value=10;n.lg=AC.createGain();n.lg.gain.value=.38;n.lump.connect(n.lg).connect(n.am.gain);
  n.osc=[];for(const [type,mul,det,v] of [['sawtooth',1,0,.5],['sawtooth',1,-19,.42],['square',.5,7,.3],['sawtooth',2,4,.3]]){const o=AC.createOscillator();o.type=type;o.detune.value=det;o.frequency.value=40*mul;const g=AC.createGain();g.gain.value=v;o.connect(g).connect(n.am);n.osc.push([o,mul]);}
  // slow wobble so it never sounds like a flat synth note
  n.wob=AC.createOscillator();n.wob.frequency.value=5.3;const wg=AC.createGain();wg.gain.value=9;n.wob.connect(wg);for(const [o] of n.osc)wg.connect(o.detune);
  // deep sub rumble
  n.sub=AC.createOscillator();n.sub.type='sine';n.sub.frequency.value=20;n.subG=AC.createGain();n.subG.gain.value=.17;n.sub.connect(n.subG).connect(n.out);
  // turbine whine riding on top
  n.wh=AC.createOscillator();n.wh.type='triangle';n.wh.frequency.value=300;n.whG=AC.createGain();n.whG.gain.value=0;n.wh.connect(n.whG).connect(n.out);
  // looping noise: rumbly exhaust grit into the distortion, plus a hissy water rush that grows with speed
  n.ns=AC.createBufferSource();n.ns.buffer=nb(2);n.ns.loop=true;
  n.exF=AC.createBiquadFilter();n.exF.type='lowpass';n.exF.frequency.value=170;n.exG=AC.createGain();n.exG.gain.value=.25;n.ns.connect(n.exF).connect(n.exG).connect(n.sh);
  n.wF=AC.createBiquadFilter();n.wF.type='bandpass';n.wF.Q.value=.7;n.wF.frequency.value=700;n.wG=AC.createGain();n.wG.gain.value=0;n.ns.connect(n.wF).connect(n.wG).connect(n.out);
  // turbo: a whistle that spools up with boost pressure, plus an airy whoosh
  n.tw=AC.createOscillator();n.tw.type='sine';n.tw.frequency.value=1600;n.twG=AC.createGain();n.twG.gain.value=0;n.tw.connect(n.twG).connect(n.out);
  n.tf=AC.createBiquadFilter();n.tf.type='bandpass';n.tf.Q.value=5;n.tf.frequency.value=2500;n.tfG=AC.createGain();n.tfG.gain.value=0;n.ns.connect(n.tf).connect(n.tfG).connect(n.out);
  for(const o of [n.lump,n.wob,n.sub,n.wh,n.tw,...n.osc.map(x=>x[0])])o.start(t);n.ns.start(t);
  if(!CRK_BUF||CRK_BUF.sampleRate!==AC.sampleRate)CRK_BUF=nb(1);
  ENG.n=n;ENG.rpm=.12;ENG.press=0;ENG.popCD=0;ENG.decelT=0;ENG.lastSpd=0;ENG.shiftT=0;ENG.lastGas=false;ENG.wasBoost=false;ENGS.push(ENG);}
function engineStop(e=ENG){const n=e.n;if(!n||!AC)return;e.n=null;const t=AC.currentTime,g=n.out.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+.25);
  for(const o of [n.lump,n.wob,n.sub,n.wh,n.tw,n.ns,...n.osc.map(x=>x[0])]){try{o.stop(t+.3)}catch(e){}}
  setTimeout(()=>{try{n.out.disconnect()}catch(e){}},500);}
function engineMute(e=ENG){const n=e.n;if(n&&AC){const g=n.out.gain;g.cancelScheduledValues(AC.currentTime);g.setTargetAtTime(0,AC.currentTime,.03);}}
function engineStopAll(){for(const e of ENGS)engineStop(e);ENGS.length=0;engineStop();}
function engineMuteAll(){for(const e of ENGS)engineMute(e);}
// ---- 3-speed gearbox: shifts up as you build speed (with a turbo dump-valve PSSHH), and back down when you slow ----
// sf = speed / normal top speed. Each gear sweeps the revs up, then the next gear drops them back down.
const GEARS=[{up:.4,lo:0,hi:.4,r0:.16,r1:1},{up:.74,down:.32,lo:.4,hi:.74,r0:.5,r1:1},{down:.64,lo:.74,hi:1,r0:.55,r1:.97}];
function gearRpm(g,sf){const q=GEARS[g];return q.r0+(q.r1-q.r0)*(sf-q.lo)/(q.hi-q.lo)}
function gearTick(dt){const P=G.player;if(G.gear===undefined){G.gear=-1;G.gearCD=0;G.gearPop=0;}
  G.gearCD-=dt;G.gearPop=Math.max(0,G.gearPop-dt);
  if(G.state==='count'){G.gear=-1;return;}            // neutral on the start line
  if(G.gear<0){G.gear=0;G.gearPop=.35;return;}         // into 1st on GO
  if(G.gearCD>0)return;
  const sf=Math.abs(P.speed)/P.maxS,q=GEARS[G.gear];
  if(q.up!==undefined&&sf>q.up&&P.speed>0){G.gear++;G.gearCD=.35;G.gearPop=.35;onShift(1);}
  else if(q.down!==undefined&&sf<q.down){G.gear--;G.gearCD=.35;G.gearPop=.35;onShift(-1);}}
function onShift(dir){if(dir>0){ENG.shiftT=.13;dumpValve(.6+ENG.press*.4);ENG.press*=.3;exhaustBurst(G.player,3,.8);}}
// turbo dump valve: a bright PSSHH of air, then the fluttery "stu-tu-tu-tu"
function dumpValve(v=1){if(!sound||!AC)return;const t=AC.currentTime;if(t-(ENG.lastDump||-9)<.3)return;ENG.lastDump=t;
  const s=AC.createBufferSource();s.buffer=nb(.6);const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=1300;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=.8;bp.frequency.setValueAtTime(4600,t);bp.frequency.exponentialRampToValueAtTime(2300,t+.45);
  const g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42*v,t+.012);g.gain.exponentialRampToValueAtTime(.1*v,t+.16);g.gain.exponentialRampToValueAtTime(.001,t+.5);
  s.connect(hp).connect(bp).connect(g).connect(AC.destination);s.start(t);s.stop(t+.6);
  const s2=AC.createBufferSource();s2.buffer=nb(.55);const f2=AC.createBiquadFilter();f2.type='bandpass';f2.Q.value=1.3;f2.frequency.setValueAtTime(1100,t);f2.frequency.exponentialRampToValueAtTime(700,t+.5);
  const ch=AC.createGain();ch.gain.value=.5;const lfo=AC.createOscillator();lfo.type='square';lfo.frequency.setValueAtTime(24,t+.08);lfo.frequency.linearRampToValueAtTime(13,t+.5);const lg=AC.createGain();lg.gain.value=.5;lfo.connect(lg).connect(ch.gain);
  const g2=AC.createGain();g2.gain.setValueAtTime(0,t+.07);g2.gain.linearRampToValueAtTime(.34*v,t+.11);g2.gain.exponentialRampToValueAtTime(.001,t+.52);
  s2.connect(f2).connect(ch).connect(g2).connect(AC.destination);s2.start(t+.07);s2.stop(t+.56);lfo.start(t+.07);lfo.stop(t+.56);}
// ---- AMG-style overrun: as the revs fall you get sharp exhaust pops, machine-gun crackles and the odd big BANG ----
let CRK_BUF=null,POP_CURVE=null;
function overrunPop(t,v,kind){if(!sound||!AC||v<=.01)return;if(!CRK_BUF||CRK_BUF.sampleRate!==AC.sampleRate)CRK_BUF=nb(1);if(!POP_CURVE)POP_CURVE=distCurve(22);
  if(kind==='crackle'){ // a quick cluster of tiny dry snaps
    const n=3+Math.random()*6|0;let tt=t;for(let i=0;i<n;i++){const s=AC.createBufferSource();s.buffer=CRK_BUF;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=1500+Math.random()*2600;f.Q.value=1.1;const g=AC.createGain();const a=v*(.35+Math.random()*.65)*.42,d=.01+Math.random()*.012;
      g.gain.setValueAtTime(a,tt);g.gain.exponentialRampToValueAtTime(.001,tt+d);s.connect(f).connect(g).connect(AC.destination);s.start(tt,Math.random()*.9,d+.01);tt+=.01+Math.random()*.032;}
  }else{ // a pop, or a big bang: a dirty crack with a punchy low thump under it
    const big=kind==='bang',d=big?.17:.075;const s=AC.createBufferSource();s.buffer=CRK_BUF;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=(big?420:700)+Math.random()*700;f.Q.value=.9;const sh=AC.createWaveShaper();sh.curve=POP_CURVE;
    const g=AC.createGain();g.gain.setValueAtTime(v*(big?.38:.3),t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f).connect(sh).connect(g).connect(AC.destination);s.start(t,Math.random()*.8,d+.02);
    const o=AC.createOscillator(),og=AC.createGain();o.type='sine';o.frequency.setValueAtTime(big?130:170,t);o.frequency.exponentialRampToValueAtTime(big?36:58,t+d);og.gain.setValueAtTime(v*(big?.4:.24),t);og.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(og).connect(AC.destination);o.start(t);o.stop(t+d+.02);}}
function popKind(){const r=Math.random();return r<.5?'crackle':r<.88?'pop':'bang'}
// a burst of crackles and pops fading out over dur seconds (used after the start-line revs)
function overrunTail(t0,dur,v=1){if(!sound||!AC)return;let tt=t0;while(tt<t0+dur){const k=1-(tt-t0)/dur;overrunPop(tt,v*k*(.55+Math.random()*.45),popKind());tt+=.045+Math.random()*.13;}}
// turbo spooling up hard when you hit a boost pad or Turbo Hop: a rising whistle and a big WHOOSH of air
function turboWhoosh(v=1){if(!sound||!AC)return;const t=AC.currentTime;
  const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(1700,t);o.frequency.exponentialRampToValueAtTime(5400,t+.38);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06*v,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+.7);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.72);
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g2=AC.createGain();s.buffer=nb(.8);f.type='bandpass';f.Q.value=1.3;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(3600,t+.38);g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(.38*v,t+.14);g2.gain.exponentialRampToValueAtTime(.001,t+.72);s.connect(f).connect(g2).connect(AC.destination);s.start(t);}
// rpm target from the gear you're in and what your jetski is doing
function engineRpmTarget(P){
  if(G.state==='count')return .12+(P.rev||0)*.6;
  if(P.ko>0||P.gulped)return .1;
  const sf=Math.min(Math.abs(P.speed)/P.maxS,1.7),g=Math.max(0,G.gear||0);
  const r=Math.max(.14,gearRpm(g,sf))-(P._gas?0:.08)+(P.boost>0||P.star>0?.08:0)+(P.z>10||P.sz>6?.3:0)+(P.spin>0?.15:0);
  return clamp(r,.1,1.5);}
function engineTick(dt){const n=ENG.n;if(!n||!AC||!G)return;const P=G.player,t=AC.currentTime,tc=.04;
  ENG.shiftT=Math.max(0,(ENG.shiftT||0)-dt);
  const tgt=engineRpmTarget(P);
  // revs climb quickly but take their time coming back down (except the snap of a gear change)
  ENG.rpm+=(tgt-ENG.rpm)*Math.min(1,dt*(ENG.shiftT>0?16:tgt>ENG.rpm?5.5:G.state==='count'?.7:.85));const r=ENG.rpm;
  // overrun: revs falling with the throttle shut, a gear change, a crash or a boost wearing off -> crackles and pops
  const spd=Math.abs(P.speed),dec=(ENG.lastSpd-spd)/Math.max(dt,.001);ENG.lastSpd=spd;if(dec>260&&spd>60)ENG.decelT=1.1;ENG.decelT=Math.max(0,ENG.decelT-dt);
  const lift=G.state==='count'||!P._gas||ENG.shiftT>0||ENG.decelT>0;
  const ov=lift&&!P.gulped&&P.z<=10?clamp((r-tgt-.04)/.22,0,1)*clamp((r-.22)/.35,0,1):0;ENG.ov=ov;
  ENG.popCD-=dt;
  if(ov>0&&ENG.popCD<=0&&sound&&!G.paused&&!document.hidden){const kind=popKind(),v=(G.state==="count"?.45:1)*(.45+ov*.55)*(.6+Math.random()*.4);
    overrunPop(t+Math.random()*.015,v,kind);if(kind==='bang'&&G.state!=='count')exhaustBurst(P,2,.7);
    ENG.popCD=(.04+Math.random()*.14)/(.6+ov*.8);}
  n.lg.gain.setTargetAtTime(.38+ov*.32,t,.05);   // lumpier V8-style burble while it's popping
  // turbo pressure: builds with revs while you're on the throttle, maxed out on a boost
  const racing=G.state!=='count'&&!(P.ko>0)&&!P.gulped,boosting=racing&&(P.boost>0||P.star>0);
  const pt=boosting?1:racing&&P._gas?clamp((r-.35)/.55,0,1)*(G.gear>=1?1:.55):0;
  const p0=ENG.press||0;ENG.press=p0+(pt-p0)*Math.min(1,dt*(pt>p0?2.6:5));
  ENG.spool=(ENG.spool||0)+(Math.max(0,(ENG.press-p0)/Math.max(dt,.001))-(ENG.spool||0))*Math.min(1,dt*8); // how fast the turbo is spooling up
  if(ENG.lastGas&&!P._gas&&racing&&ENG.press>.4){dumpValve(ENG.press);ENG.press*=.3;}   // lift off / brake: PSSHH
  if(boosting&&!ENG.wasBoost)turboWhoosh(1);
  if(!boosting&&ENG.wasBoost&&racing)dumpValve(1);
  ENG.lastGas=!!P._gas;ENG.wasBoost=boosting;
  const pr=ENG.press;
  const f=36+r*92;
  for(const [o,mul] of n.osc)o.frequency.setTargetAtTime(f*mul,t,tc);
  n.lump.frequency.setTargetAtTime(f/4,t,tc);n.sub.frequency.setTargetAtTime(f/2,t,tc);
  n.wh.frequency.setTargetAtTime(f*7.5,t,tc);n.whG.gain.setTargetAtTime(.01+r*.022,t,.08);
  // whistle is loudest while the turbo is spooling up, then settles to a faint hiss when cruising (so it never nags)
  const spl=Math.min(1,ENG.spool*.8);
  n.tw.frequency.setTargetAtTime(1500+pr*2600+r*300,t,.06);n.twG.gain.setTargetAtTime(boosting?.24:pr*pr*.04+spl*.26,t,.06);
  n.tf.frequency.setTargetAtTime(1700+pr*2200,t,.06);n.tfG.gain.setTargetAtTime(boosting?1.6:pr*.35+spl*1.2,t,.06);
  n.lp.frequency.setTargetAtTime(380+r*1750+(P._gas?300:0),t,tc);
  n.exG.gain.setTargetAtTime(.2+r*.2,t,.08);
  const sf=G.state==='count'?0:Math.min(Math.abs(P.speed)/P.maxS,1.5),wet=P.z>10?.25:1;
  n.wF.frequency.setTargetAtTime(500+sf*900,t,.08);n.wG.gain.setTargetAtTime(sf*.18*wet,t,.1);
  const on=sound&&!G.paused&&!G.over&&!document.hidden;
  n.out.gain.setTargetAtTime(on?(.058+r*.06)*(G.state==='done'?.7:1)*(ENG.shiftT>0?.55:1)*(ENG.vol||1):0,t,ENG.shiftT>0?.02:.06);}
function jingle(notes){notes.forEach((n,i)=>setTimeout(()=>beep(n,.18,'square',.07),i*130))}

// ================= world state =================
const cv=$('#c'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR|0;cv.height=H*DPR|0;}
addEventListener('resize',resize);resize();

let G=null; // current race
// ---- split screen: each human racer has their own camera, speedo, gears, banner, screen shake and engine sound.
// useView(k) swaps that racer's set into the G.* fields the camera/HUD/engine code reads, so the same code draws either screen.
const VKEYS=['cam','camYaw','camOrbit','_cEH','_cTH','fov3','shake','banner','gear','gearCD','gearPop','spdN','spdV','spdD'];
function useView(k){if(!G||!G.players||G.players.length<2||G.vk===k)return;const cur=G.vk;if(cur){for(const key of VKEYS)cur.vs[key]=G[key];cur.vs.eng=ENG;}
  for(const key of VKEYS)G[key]=k.vs[key];ENG=k.vs.eng;G.player=k;G.vk=k;}
function forViews(fn){if(!G.players||G.players.length<2){fn(G.player);return}for(const p of G.players){useView(p);fn(p);}useView(G.players[0]);}
function shk(k,v){if(G.vk&&k!==G.vk&&k.vs)k.vs.shake=Math.max(k.vs.shake||0,v);else G.shake=Math.max(G.shake||0,v);}   // shake the screen of the racer who got hit
function setBanner(k,b){if(G.vk&&k!==G.vk&&k.vs)k.vs.banner=b;else G.banner=b;}
function pDist(x,y){let d=1e9;for(const p of G.players)d=Math.min(d,Math.hypot(x-p.x,y-p.y));return d}   // how far a sound is from the nearest human racer
const opts={laps:3,diff:1,autoGas:true,frog:0,track:0,music:true,revStyle:'jet'};
try{const s=JSON.parse(store('rr-opts')||'{}');Object.assign(opts,s);if(!s.revPicked)opts.revStyle='jet';}catch(e){}
// the chosen track is remembered by name too, so removing or adding tracks never points the save at the wrong one (or past the end of the list)
{const j=opts.trackN?TRACKS.findIndex(d=>d.n===opts.trackN):-1;if(j>=0)opts.track=j;if(!(opts.track>=0&&opts.track<TRACKS.length))opts.track=0;}
sound=opts.sound!==false;MUS.on=opts.music!==false;
function saveOpts(){opts.sound=sound;opts.trackN=TRACKS[opts.track]&&TRACKS[opts.track].n;store('rr-opts',JSON.stringify(opts))}
const trackCache={};
function getTrack(i){
  if(trackCache[i])return trackCache[i];
  const T=buildTrack(TRACKS[i]);T.th=THEMES[TRACKS[i].t];T.idx=i;
  const p=new Path2D();T.pts.forEach((q,j)=>j?p.lineTo(q.x,q.y):p.moveTo(q.x,q.y));p.closePath();T.path=p;
  T.cum=[0];for(let j=1;j<=TN;j++){const a=T.pts[j-1],b=T.pts[j%TN];T.cum.push(T.cum[j-1]+Math.hypot(b.x-a.x,b.y-a.y));}   // distance along the course at each point
  // difficulty
  const wig=T.wiggle;T.stars=wig<45?1:wig<60?2:3;
  // item box rows
  T.boxes=[];{const nb=T.w<200?3:4,sp=T.w<200?.26:.2;for(const f of [.18,.42,.66,.88]){const ii=Math.floor(f*TN);const p=T.pts[ii];for(let k=-(nb-1)/2;k<=(nb-1)/2;k++){T.boxes.push({x:p.x+p.nx*k*T.w*sp,y:p.y+p.ny*k*T.w*sp,i:ii,lat:k*T.w*sp,t:0});}}}
  // boost pads: only on long gentle stretches, never just before a tight corner
  T.pads=[];const used=[];const lv4=TRACKS[i].lvl===4;
  const padPass=(want,ahead,minRad)=>{const sc=T.curv.map((c,j)=>{let s=0,m=0;for(let k=-6;k<=ahead;k++){const v=T.curv[(j+k+TN)%TN];s+=v;if(k>=-3)m=Math.max(m,v)}return {s,m}});
    while(T.pads.length<want){let best=-1,bv=1e9;for(let j=0;j<TN;j++){if(j<30||j>TN-40)continue;if(used.some(u=>Math.min(Math.abs(u-j),TN-Math.abs(u-j))<(lv4?55:90)))continue;if(T.boxes.some(b=>Math.abs(b.i-j)<20))continue;
        if(sc[j].m>1/minRad)continue;if(T.hgt&&T.hgt[(j+12)%TN]-T.hgt[j]>40)continue;if(sc[j].s<bv){bv=sc[j].s;best=j}}
      if(best<0)return;used.push(best);const r=mulberry(best+i*13);const lat=(r()-.5)*T.w*.4;const p=T.pts[best];T.pads.push({i:best,lat,x:p.x+p.nx*lat,y:p.y+p.ny*lat,a:p.a});}};
  padPass(lv4?5:3,34,lv4?650:560);padPass(lv4?4:2,28,450);padPass(lv4?3:2,24,380);
  // a row of boost pads down the long final straight (kept off the starting grid)
  if(T.fsLen){const segL=T.L/TN,n=Math.floor(T.fsLen/segL);const from=TN-n+Math.max(3,Math.round(200/segL)),to=TN-24,step=Math.max(3,Math.round(330/segL));let m=0;
    for(let j=from;j<=to;j+=step){const lat=[0,-.24,.24,0,.24,-.24][m%6]*T.w;m++;const p=T.pts[j];T.pads.push({i:j,lat,x:p.x+p.nx*lat,y:p.y+p.ny*lat,a:p.a,fs:1});}}
  // obstacles for harder levels: bouncy bumpers and spinning sweeper bars
  T.lvl=TRACKS[i].lvl||1;T.bumpers=[];T.spinners=[];
  if(T.hgt){ // coarse height map for things off the centre line (particles, labels, embankments)
    const cs=100,m=T.maxH*1.5+300,gx0=T.bb.minX-m,gy0=T.bb.minY-m,nx=Math.ceil((T.bb.maxX-T.bb.minX+2*m)/cs)+1,ny=Math.ceil((T.bb.maxY-T.bb.minY+2*m)/cs)+1;const grid=new Float32Array(nx*ny);const edge=T.w/2+32;
    for(let gy=0;gy<ny;gy++)for(let gx=0;gx<nx;gx++){const x=gx0+gx*cs,y=gy0+gy*cs;let bd=1e18,bi=0;for(let j=0;j<TN;j+=2){const q=T.pts[j];const d=(q.x-x)**2+(q.y-y)**2;if(d<bd){bd=d;bi=j}}
      const d=Math.sqrt(bd);const h=T.hgt[bi];grid[gy*nx+gx]=d<=edge?h:0;}
    T.hAt=(x,y)=>{const fx=(x-gx0)/cs,fy=(y-gy0)/cs;const ix=Math.floor(fx),iy=Math.floor(fy);if(ix<0||iy<0||ix>=nx-1||iy>=ny-1)return 0;const tx=fx-ix,ty=fy-iy;const g=(a,b)=>grid[b*nx+a];
      return (g(ix,iy)*(1-tx)+g(ix+1,iy)*tx)*(1-ty)+(g(ix,iy+1)*(1-tx)+g(ix+1,iy+1)*tx)*ty};
  }else T.hAt=()=>0;
  if(T.tower)T.hAt=(x,y)=>{if(!G||!G.karts||G.T!==T)return 0;let best=G.karts[0],bd=1e18;for(const k of G.karts){const d=(k.x-x)**2+(k.y-y)**2;if(d<bd){bd=d;best=k}}
    const i=nearestIdx(T,x,y,best.idx,40),p=T.pts[i];return (p.x-x)**2+(p.y-y)**2>(T.w/2+220)**2?0:hh(T,i)};
  {const ro=mulberry(500+i*19);const cd=(a,b)=>Math.min(Math.abs(a-b),TN-Math.abs(a-b));
    const busy=j=>j<40||j>TN-15||(T.tower&&T.hgt[j]>20)||T.boxes.some(b=>cd(b.i,j)<16)||T.pads.some(p=>cd(p.i,j)<14);
    const nS=[0,1,2,2][T.lvl-1];
    for(let n=0;n<nS;n++){let best=-1,bv=1e9;const c0=Math.floor((n+.55)/nS*TN);for(let o=-40;o<=40;o++){const j=(c0+o+TN)%TN;if(busy(j)||T.spinners.some(s=>cd(s.i,j)<40))continue;let cv=0;for(let q=-6;q<=6;q++)cv+=T.curv[(j+q+TN)%TN];if(cv<bv){bv=cv;best=j}}
      if(best<0)continue;const p=T.pts[best];T.spinners.push({i:best,x:p.x,y:p.y,len:T.w/2-4,spd:(T.lvl===2?.95:T.lvl===3?1.35:1.5)*(n%2?-1:1),ph:ro()*TAU});}
    const nB=[3,4,6,6][T.lvl-1];let tries=0;
    while(T.bumpers.length<nB&&tries<400){tries++;const j=(ro()*TN)|0;if(busy(j)||T.spinners.some(s=>cd(s.i,j)<22)||T.bumpers.some(b=>cd(b.i,j)<12))continue;
      const lat=(ro()-.5)*(T.w-80);const p=T.pts[j];T.bumpers.push({i:j,lat,lat0:lat,x:p.x+p.nx*lat,y:p.y+p.ny*lat,r:20,hit:0,gone:0,kind:T.bumpers.length%4,ph:ro()*TAU,sw:.35+ro()*.5});}}
  // decorations
  const r=mulberry(1000+i*77);T.decos=[];const bb=T.bb,m=700;let tries=0;
  while(T.decos.length<260&&tries<5000){tries++;const x=bb.minX-m+r()*(bb.maxX-bb.minX+2*m),y=bb.minY-m+r()*(bb.maxY-bb.minY+2*m);const POND=['lilypad','lilypad','lilypad','lotus','reed','ripple','duck','log'];let type=r()<.6?POND[(r()*POND.length)|0]:T.th.d[(r()*T.th.d.length)|0];if(type==='pond')type='ripple';const big=BIG[type];const s=big?60+r()*50:18+r()*30;
    let dmin=1e9;for(let j=0;j<TN;j+=3){const q=T.pts[j];const d=(q.x-x)**2+(q.y-y)**2;if(d<dmin)dmin=d}dmin=Math.sqrt(dmin);
    if(dmin<T.w/2+40+(T.maxH?60:0)+s*(big?1.3:.8))continue;T.decos.push({type,x,y,s,r:big?(r()-.5)*.6:r()*TAU,v:(r()*12)|0});}
  T.decos.sort((a,b)=>(BIG[b.type]?1:0)-(BIG[a.type]?1:0));
  return trackCache[i]=T;
}

// ---- swells: a gentle current rolls little humps of water down the course. Ride over them and,
// going fast, the water drops away under you and you get a little hop of air. ----
const SW_HW=80,SW_V=60;   // half the length of a swell, and how fast the current carries them along
function makeSwells(T){const L=T.cum[TN],n=Math.max(4,Math.round(L/1600)),r=mulberry(T.idx*41+7),out=[];
  for(let i=0;i<n;i++)out.push({s0:(i+.5+(r()-.5)*.5)/n*L,A:3+(r()**2)*5.5,ph:r()*TAU,s:0,a:0});return out}
function updateSwells(){const T=G.T,L=T.cum[TN];for(const w of G.swells){w.s=((w.s0+SW_V*G.t)%L+L)%L;const ds=Math.min(w.s,L-w.s);
  let a=w.A*(.8+.2*Math.sin(G.t*.5+w.ph))*clamp((ds-350)/400,0,1);   // calm water round the start line
  if(T.hgt){const i=Math.floor(w.s/L*TN)%TN;if(T.tower)a*=clamp(1-hh(T,i)/5,0,1);}   // none up on the tower slide
  w.a=a;}}
// how far along the course a racer is (smooth across track points, so the swell height never jumps)
function trackS(T,k){const i=k.idx,q=T.pts[i];let t=segT(q,T.pts[(i+1)%TN],k.x,k.y);if(t>=0)return T.cum[i]+Math.min(1,t)*(T.cum[i+1]-T.cum[i]);
  const j=(i-1+TN)%TN;t=segT(T.pts[j],q,k.x,k.y);if(t>=0)return T.cum[j]+Math.min(1,t)*(T.cum[j+1]-T.cum[j]);return T.cum[i]}
let SWD=0;   // slope of the water at the last swellAt() call
function swellAt(T,s){let h=0;SWD=0;if(!G||!G.swells)return 0;const L=T.cum[TN];for(const w of G.swells){if(w.a<=0)continue;let d=s-w.s;d-=Math.round(d/L)*L;
  if(d>-SW_HW&&d<SW_HW){const u=Math.PI*d/SW_HW;h+=w.a*.5*(1+Math.cos(u));SWD-=w.a*.5*Math.PI/SW_HW*Math.sin(u);}}return h}
// height of a racer for drawing: the track, plus any jump, plus the swell they're riding
function kZ(T,k){return kH(T,k)+k.z+(k.sw||0)}
// on tower tracks (which cross over themselves) things only touch racers at the same height
function sameLvl(k,i){const T=G.T;return !T.tower||i==null||Math.abs(kH(T,k)+k.z-hh(T,i))<90}
function nearestIdx(T,x,y,guess,span=24){let best=guess,bd=1e18;for(let k=-span;k<=span;k++){const i=(guess+k+TN)%TN;const p=T.pts[i];const d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best=i}}return best}
function nearestIdxFull(T,x,y){let best=0,bd=1e18;for(let i=0;i<TN;i+=2){const p=T.pts[i];const d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best=i}}return nearestIdx(T,x,y,best,3)}

function newRace(){
  const T=getTrack(opts.track);const two=opts.players===2;
  if(two&&(opts.frog2==null||opts.frog2===opts.frog||!FROGS[opts.frog2]))opts.frog2=(opts.frog+1)%FROGS.length;
  const humans=two?[opts.frog,opts.frog2]:[opts.frog];
  const order=[];for(let i=0;i<8;i++)if(!humans.includes(i))order.push(i);
  order.sort(()=>Math.random()-.5);
  order.splice(4,0,...humans); // player starts in slot 5 (two players start side by side)
  const karts=order.map((fi,slot)=>{
    const row=slot>>1,col=slot&1;const back=5+row*5+col*2;const ii=(TN-back)%TN;const p=T.pts[ii];const lat=(col?.24:-.24)*T.w;
    const f=FROGS[fi];
    return {id:slot,f,fi,isP:humans.includes(fi),pi:humans.indexOf(fi),x:p.x+p.nx*lat,y:p.y+p.ny*lat,a:p.a,speed:0,vx:0,vy:0,idx:ii,prog:-back,lap:1,fin:false,ft:0,
      item:null,roul:0,rItem:null,spin:0,boost:0,star:0,shield:0,dizzy:0,hop:0,slip:0,wrong:0,place:slot+1,hp:100,hurt:0,spinHit:0,slipCD:0,regenT:0,ko:0,inv:0,kos:0,lastIdx:ii,itemHold:0,
      maxS:672*(0.9+f.spd*.04),acc:516*(0.8+f.acl*.08),hnd:3.38*(0.85+f.hnd*.06), // speeds raised 20% (was 560/430/2.7)
      
      z:0,vz:0,slope:0,ai:{off:(Math.random()-.5)*.5,offT:0,useAt:0,skill:.9+Math.random()*.15}};
  });
  G={T,karts,swells:makeSwells(T),player:karts.find(k=>k.pi===0),players:humans.map(fi=>karts.find(k=>k.fi===fi)),proj:[],haz:[],birds:[],poos:[],puddles:[],birdT:8+Math.random()*4,parts:[],texts:[],fire:[],flyers:[],carp:makeCarp(T),revT:.5,popAt:0,flyT:.2,state:'count',t:0,cd:6.4,raceT:0,laps:opts.laps,cam:{x:0,y:0,z:1},finishOrder:[],endT:0,paused:false,shake:0};
  G.cam.x=G.player.x;G.cam.y=G.player.y;G.camYaw=G.player.a;G.camOrbit=Math.PI;
  if(GL3.ok){buildWorld3D(T);const sk=T.th.sky;GL3.cvs.style.background=`linear-gradient(180deg,${sk[0]} 0%,${sk[1]} 62%,${sk[1]} 100%)`;}
  if(two){for(const p of G.players)p.vs={cam:{x:p.x,y:p.y,z:1},camYaw:p.a,camOrbit:Math.PI,shake:0,banner:null,eng:{n:null,rpm:.12,pan:p.pi?.4:-.4,vol:.8}};
    G.vk=G.players[0];G.cam=G.vk.vs.cam;ENG=G.vk.vs.eng;for(const p of G.players){useView(p);engineStart();}useView(G.players[0]);}
  else{ENG={n:null,rpm:.12};engineStart();}
}

// ================= input =================
const keys={};const touch={l:0,r:0,b:0,g:0},touch2={l:0,r:0,b:0,g:0};
// two players on one keyboard: player 1 uses W A S D + Space, player 2 the arrow keys + Enter
const P1_ITEM=['Space','ShiftLeft','KeyQ','KeyE','KeyX','KeyZ','Tab'],P2_ITEM=['Enter','NumpadEnter','ShiftRight','Slash','Period','Comma','Numpad0','ControlRight','KeyM'];
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();keys[k]=true;
  if(G&&!G.over&&G.players&&G.players.length>1){if(['arrowup','arrowdown','arrowleft','arrowright'].includes(k)&&!G.paused)e.preventDefault();const a=P1_ITEM.includes(e.code),b=P2_ITEM.includes(e.code);if(a||b){e.preventDefault();if(G.state==='race'&&!G.paused)useItem(G.players[a?0:1]);}
    if(k==='escape'||k==='p')togglePause();return;}
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)&&G&&!G.over&&!G.paused)e.preventDefault();
  if(G&&(k===' '||k==='x'||k==='z'||k==='shift')&&G.state==='race'&&!G.paused){e.preventDefault();useItem(G.player);}
  if(G&&(k==='escape'||k==='p'))togglePause();
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false});
function bindHold(id,key,tc=touch){const el=$(id);const on=e=>{e.preventDefault();tc[key]=1;el.classList.add('on');audio()};const off=e=>{tc[key]=0;el.classList.remove('on')};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off);}
bindHold('#tL','l');bindHold('#tR','r');bindHold('#tB','b');bindHold('#tG','g');
bindHold('#tL2','l',touch2);bindHold('#tR2','r',touch2);bindHold('#tB2','b',touch2);bindHold('#tG2','g',touch2);   // player 2's own buttons on a tablet
$('#tI').addEventListener('pointerdown',e=>{e.preventDefault();if(G&&G.state==='race')useItem(G.players[0])});
$('#tI2').addEventListener('pointerdown',e=>{e.preventDefault();if(G&&G.state==='race'&&G.players[1])useItem(G.players[1])});
// game controllers: controller 1 drives player 1 and controller 2 drives player 2 (with one player, any controller works).
// Stick or d-pad steers, A or right trigger goes, B or left trigger brakes, X / Y / bumpers use items (A too when Auto-Go is on), Start pauses.
const PADS={prev:[]};
function padsNow(){try{return [...(navigator.getGamepads?navigator.getGamepads():[])].filter(p=>p&&p.connected)}catch(e){return []}}
function padsFor(k){const ps=padsNow();return G.players.length>1?(ps[k.pi]?[ps[k.pi]]:[]):ps}
function pollPads(){const ps=padsNow();ps.forEach((p,i)=>{const pr=PADS.prev[i]||[],B=j=>!!(p.buttons[j]&&p.buttons[j].pressed),hit=j=>B(j)&&!pr[j];
    if(G&&!G.over&&G.players){const k=G.players.length>1?G.players[i]:G.players[0];
      if(hit(9))togglePause();
      if(k&&G.state==='race'&&!G.paused&&([2,3,4,5].some(hit)||(opts.autoGas&&hit(0)))){audio();useItem(k);}}
    PADS.prev[i]=p.buttons.map(x=>x.pressed);});}
function readInput(k){const two=G.players.length>1;let l=0,r=0,b=0,g=0,an=0;
  if(!two||k.pi===0){l|=!!keys.a;r|=!!keys.d;b|=!!keys.s;g|=!!keys.w;}
  if(!two||k.pi===1){l|=!!keys.arrowleft;r|=!!keys.arrowright;b|=!!keys.arrowdown;g|=!!keys.arrowup;}
  const tc=two&&k.pi===1?touch2:touch;l|=tc.l;r|=tc.r;b|=tc.b;g|=tc.g;
  for(const p of padsFor(k)){const B=j=>!!(p.buttons[j]&&p.buttons[j].pressed),ax=p.axes[0]||0;if(Math.abs(ax)>.2)an+=(ax-Math.sign(ax)*.2)/.8;
    l|=B(14);r|=B(15);b|=B(1)||B(6)||B(13);g|=(B(0)&&!opts.autoGas)||B(7)||B(12);}
  const brake=b?1:0;return {s:clamp(r-l+an,-1,1),b:brake,g:(opts.autoGas||g)&&!brake?1:0}}
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;

// ================= items use =================
const DMG={spin:25,fly:30,slip:15,dizzy:12,bump:35,poo:6};
function damage(k,amt,why){ // health is switched off: hits still spin you or slow you down and make you flash, but there's no health bar or knock-outs
  if(k.fin||k.inv>0||k.star>0||amt<=0)return;k.hurt=.35;}
function hitKart(k,kind='spin',dmg){
  if(k.fin||k.ko>0||k.inv>0)return false;
  if(k.star>0)return false;
  if(k.shield>0){k.shield=0;burst(k.x,k.y,'#7ef3ff',14);popText(k.x,k.y-30,'POP!','#7ef3ff');if(k.isP)beep(900,.1,'sine',.08,600);return false}
  if(kind==='spin'){k.spin=1.1;k.speed*=.35;k.boost=0;}
  else if(kind==='dizzy'){k.dizzy=1.8;}
  else if(kind==='slip'){k.spin=.9;k.speed*=.5;}
  else if(kind==='poo'){k.spin=1.25;k.speed*=.55;}
  burst(k.x,k.y,'#ffd23f',10,'star');
  if(k.isP){beep(220,.25,'sawtooth',.07,-150);shk(k,.35)}
  damage(k,dmg??DMG[kind]??20);
  return true;
}
function useItem(k){
  if(k.tongueT>0){fireTongue(k);return;}
  if(!k.item||k.spin>0)return;
  const it=k.item;k.item=null;const ca=Math.cos(k.a),sa=Math.sin(k.a);
  if(k.isP){({bubble:()=>beep(700,.12,'sine',.08,300),fly:()=>beep(500,.2,'sawtooth',.05,200),lily:()=>beep(300,.1,'sine',.08,-100),turbo:()=>beep(200,.4,'sawtooth',.07,500),shield:()=>beep(600,.25,'sine',.07,400),croak:()=>beep(120,.5,'square',.1,-40),star:()=>jingle([523,659,784,1047]),tongue:()=>jingle([392,523,784])})[it]();}
  switch(it){
    case 'tongue':k.tongueT=8;k.tongueCD=.2;if(k.isP)G.texts.push({x:k.x,y:k.y-50,s:'STICKY TONGUE!',c:'#ff5f8f',life:1.2,max:1.2});break;
    case 'bubble':G.proj.push({type:'bubble',x:k.x+ca*34,y:k.y+sa*34,vx:ca*(1180+Math.max(0,k.speed)*.4),vy:sa*(1180+Math.max(0,k.speed)*.4),owner:k,life:3.2,idx:k.idx,grace:.15});break;
    case 'fly':{const tgt=G.karts.find(o=>o.place===k.place-1&&!o.fin);G.proj.push({type:'fly',x:k.x+ca*34,y:k.y+sa*34,vx:ca*1020,vy:sa*1020,owner:k,life:6,idx:k.idx,target:tgt||null,grace:.2});break;}
    case 'lily':G.haz.push({type:'lily',x:k.x-ca*48,y:k.y-sa*48,owner:k,grace:.6,r:Math.random()*TAU,i:k.idx});break;
    case 'turbo':k.boost=Math.max(k.boost,1.6);k.hop=.35;k.speed=Math.max(k.speed,k.maxS*1.3);break;
    case 'shield':k.shield=10;break;
    case 'star':k.star=6.5;break;
    case 'croak':{G.texts.push({x:k.x,y:k.y-40,s:'CROAK!',c:'#ffd23f',life:1.2,max:1.2,big:1});G.parts.push({ring:1,x:k.x,y:k.y,life:.8,max:.8});
      for(const o of G.karts){if(o===k)continue;if(o.place<k.place||(k.place===1&&Math.hypot(o.x-k.x,o.y-k.y)<700))hitKart(o,'dizzy');}break;}
  }
}
function burst(x,y,c,n,type){for(let i=0;i<n;i++){const a=Math.random()*TAU,s=80+Math.random()*220;G.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.6+Math.random()*.4,max:1,c,s:type==='star'?7:4+Math.random()*4,type})}}
function popText(x,y,s,c){G.texts.push({x,y,s,c,life:.8,max:.8})}

// ================= update =================
function update(dt){
  const T=G.T;G.t+=dt;updateSwells();
  forViews(()=>{gearTick(dt);engineTick(dt);speedoTick(dt);});
  if(G.state==='count'){G.cd-=dt;const prev=Math.ceil(G.cd+dt-1.2),now=Math.ceil(G.cd-1.2);if(now!==prev&&now>=0&&now<=3){if(now>0)beep(440,.25,'square',.08);else beep(880,.5,'square',.09);}
    preRaceFX(dt);
    if(G.cd<=1.2){G.state='race';playSong('race');for(const k of G.karts){exhaustBurst(k,7,1.3);k.rev=1.2;k.wheelie=0;k.wheelieDelay=k.isP?0:Math.random()*.3;const c=Math.cos(k.a),sn=Math.sin(k.a);if(pDist(k.x,k.y)<900)splashAt(k.x-c*40,k.y-sn*40,10,1.3);}popSound(1);for(const p of G.players)shk(p,.3);}
    forViews(()=>{camUpdate(dt);viewTick(dt);});updateParts(dt);updateFX(dt);return;}
  if(G.cd>-1)G.cd-=dt;
  updateFX(dt);
  if(G.state==='race'||G.state==='done')G.raceT+=dt;
  for(const k of G.karts)stepKart(k,dt);
  // kart collisions
  const K=G.karts;
  // rubbing is free: jetskis that touch just slide apart sideways (across the track), so nobody loses speed or gets blocked
  for(let i=0;i<K.length;i++)for(let j=i+1;j<K.length;j++){const a=K[i],b=K[j];if(T.tower&&Math.abs(kH(T,a)+a.z-kH(T,b)-b.z)>70)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<38&&d>0){const push=(38-d)/2,nx=dx/d,ny=dy/d;
    const q=T.pts[a.idx],lat=dx*q.nx+dy*q.ny,sg=Math.abs(lat)>.5?Math.sign(lat):(i%2?1:-1);let sx=nx*.15+q.nx*sg*.85,sy=ny*.15+q.ny*sg*.85;const sl=Math.hypot(sx,sy)||1;sx/=sl;sy/=sl;
    a.x-=sx*push;a.y-=sy*push;b.x+=sx*push;b.y+=sy*push;
    if(a.star>0&&b.star<=0)hitKart(b,'spin',DMG.bump);else if(b.star>0&&a.star<=0)hitKart(a,'spin',DMG.bump);
    else if((a.isP||b.isP)&&G.t-(G.rubT||0)>.3){G.rubT=G.t;beep(170,.04,'square',.025)}}}
  updateTongues(dt);
  // obstacles
  for(const bm of T.bumpers){bm.hit=Math.max(0,bm.hit-dt);bm.gone=Math.max(0,bm.gone-dt);const room=T.w/2-50;bm.lat=clamp(bm.lat0+Math.sin(G.t*bm.sw+bm.ph)*T.w*.28,-room,room);const p=T.pts[bm.i];bm.x=p.x+p.nx*bm.lat;bm.y=p.y+p.ny*bm.lat;}
  for(const k of K){if(k.ko>0)continue;
    const bump=(cx,cy,R,o)=>{const dx=k.x-cx,dy=k.y-cy,d=Math.hypot(dx,dy);if(d>=R||d<=0)return;const nx=dx/d,ny=dy/d;k.x=cx+nx*R;k.y=cy+ny*R;const vn=-(k.vx*nx+k.vy*ny);
      if(vn>0){k.vx+=1.8*vn*nx;k.vy+=1.8*vn*ny;k.speed*=clamp(1-vn/1000,.4,1);if(o)o.hit=.3;obstacleHit(k,vn);}};
    for(const bm of T.bumpers){if(bm.gone>0||k.spinHit>0||!sameLvl(k,bm.i))continue;if((k.x-bm.x)**2+(k.y-bm.y)**2<(bm.r+18)**2){bm.gone=4;k.spinHit=1.2;
      if(hitKart(k,'poo',10)){G.texts.push({x:k.x,y:k.y-30,s:['BZZZT!','SPLAT!','WHOOPS!','BUZZ OFF!'][Math.random()*4|0],c:'#ffe14d',life:.9,max:.9});burst(bm.x,bm.y,'#ffe14d',8,'star');
        if(k.isP){buzzSound(1);shk(k,.3)}else{const d2=pDist(k.x,k.y);if(d2<600)buzzSound(.5*(1-d2/600))}}}}
    for(const sp of T.spinners){if(!sameLvl(k,sp.i))continue;bump(sp.x,sp.y,30,null);if(k.spinHit>0)continue;
      const a=sp.ph+sp.spd*G.t,ux=Math.cos(a),uy=Math.sin(a);const rx=k.x-sp.x,ry=k.y-sp.y;const al=clamp(rx*ux+ry*uy,0,sp.len);
      const cx=sp.x+ux*al,cy=sp.y+uy*al,dd=Math.hypot(k.x-cx,k.y-cy);
      if(dd<22){const sg=Math.sign(sp.spd)||1;const px=-uy*sg,py=ux*sg;const sw=Math.abs(sp.spd*al);k.x+=px*(26-dd);k.y+=py*(26-dd);
        k.spinHit=2.2;if(k.star>0)continue;const q=T.pts[k.idx];k.vx=px*(120+sw*.4)+q.tx*180;k.vy=py*(120+sw*.4)+q.ty*180;k.x+=q.tx*12;k.y+=q.ty*12;k.speed*=.5;k.spin=1.1;damage(k,10);
        G.texts.push({x:k.x,y:k.y-30,s:['SPLOOSH!','DRENCHED!','SPLASH!'][Math.random()*3|0],c:'#7ef3ff',life:.9,max:.9});burst(k.x,k.y,'#c9f3ff',14);
        if(k.isP){frogOof(.75);shk(k,.45)}else{const d2=pDist(k.x,k.y);if(d2<500)frogOof(.6,.5*(1-d2/500))}}}}
  // item boxes
  for(const bx of T.boxes){if(bx.t>0){bx.t-=dt;continue}for(const k of K){if(k.ko>0||!sameLvl(k,bx.i))continue;if((k.x-bx.x)**2+(k.y-bx.y)**2<34*34){bx.t=2.5;burst(bx.x,bx.y,'#fff',8);if(!k.item&&k.roul<=0&&!(k.tongueT>0)){k.roul=1.1;k.rItem=pickItem(k.place,K.length);if(k.isP)beep(1000,.08,'square',.05)}break}}}
  // boost pads
  for(const pd of T.pads){for(const k of K){const ca=Math.cos(pd.a),sa=Math.sin(pd.a);const dx=k.x-pd.x,dy=k.y-pd.y;const along=dx*ca+dy*sa,side=-dx*sa+dy*ca;if(Math.abs(along)<50&&Math.abs(side)<36&&sameLvl(k,pd.i)){if(k.boost<.9&&k.isP)beep(300,.3,'sawtooth',.05,400);k.boost=Math.max(k.boost,1.0);}}}
  // birds fly over and drop poo; it lands as a skiddy puddle
  if(G.state!=='count'){G.birdT-=dt;if(G.birdT<=0){const lv=T.lvl||1;G.birdT=[14,11,9,8][lv-1]+Math.random()*[8,6,5,4][lv-1];if(G.puddles.length<4)spawnBird();}}
  for(let i=G.birds.length-1;i>=0;i--){const b=G.birds[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    if(!b.dropped&&((b.tx-b.x)*b.vx+(b.ty-b.y)*b.vy)<=0){b.dropped=true;G.poos.push({x:b.tx,y:b.ty,h:150,vh:0,i:b.ti,lat:b.lat});
      const dp=pDist(b.x,b.y);if(dp<900)birdChirp(1-dp/900);}
    if(b.life<=0)G.birds.splice(i,1);}
  for(let i=G.poos.length-1;i>=0;i--){const p=G.poos[i];p.vh-=420*dt;p.h+=p.vh*dt;
    if(p.h<=0){G.poos.splice(i,1);G.puddles.push({x:p.x,y:p.y,i:p.i,lat:p.lat,r:24+Math.random()*8,life:12,grow:0,rot:Math.random()*TAU,v:Math.random()*4|0});burst(p.x,p.y,'#f4f4ee',6);burst(p.x,p.y,'#8a8f74',3);
      const dp=pDist(p.x,p.y);if(dp<700)splatSound(1-dp/700);}}
  for(let i=G.puddles.length-1;i>=0;i--){const pd=G.puddles[i];pd.life-=dt;pd.grow=Math.min(1,pd.grow+dt*6);if(pd.life<=0){G.puddles.splice(i,1);continue}
    for(const k of K){if(k.ko>0||k.slipCD>0||k.fin||!sameLvl(k,pd.i))continue;const R=pd.r*pd.grow+10;if((k.x-pd.x)**2+(k.y-pd.y)**2<R*R){k.slipCD=1.6;
      if(hitKart(k,'poo')){G.texts.push({x:k.x,y:k.y-30,s:['EWW!','SKID!','SPLAT!','YUCK!'][Math.random()*4|0],c:'#f4f4ee',life:.9,max:.9});burst(k.x,k.y,'#ffffff',8);
        if(k.isP)skidSound(1);else{const dp=pDist(k.x,k.y);if(dp<600)skidSound(.5*(1-dp/600))}}}}}
  // hazards
  for(let i=G.haz.length-1;i>=0;i--){const h=G.haz[i];h.grace-=dt;for(const k of K){if(k===h.owner&&h.grace>0||!sameLvl(k,h.i))continue;if((k.x-h.x)**2+(k.y-h.y)**2<30*30){if(k.star<=0)hitKart(k,'slip');burst(h.x,h.y,'#3fae3f',8);G.haz.splice(i,1);break}}}
  // projectiles
  for(let i=G.proj.length-1;i>=0;i--){const p=G.proj[i];p.life-=dt;p.grace-=dt;
    if(p.type==='fly'){p.idx=nearestIdx(T,p.x,p.y,p.idx,12);let tx,ty;
      if(p.target&&!p.target.fin&&Math.hypot(p.target.x-p.x,p.target.y-p.y)<380){tx=p.target.x;ty=p.target.y}else{const q=T.pts[(p.idx+8)%TN];tx=q.x;ty=q.y}
      const da=angDiff(Math.atan2(p.vy,p.vx),Math.atan2(ty-p.y,tx-p.x));const cur=Math.atan2(p.vy,p.vx)+clamp(da,-6*dt,6*dt);p.vx=Math.cos(cur)*1080;p.vy=Math.sin(cur)*1080;}
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.type==='bubble'){p.idx=nearestIdx(T,p.x,p.y,p.idx,12);const q=T.pts[p.idx];const lat=(p.x-q.x)*q.nx+(p.y-q.y)*q.ny;if(Math.abs(lat)>T.w/2-10){const vn=p.vx*q.nx+p.vy*q.ny;if(vn*lat>0){p.vx-=2*vn*q.nx;p.vy-=2*vn*q.ny;p.x-=q.nx*Math.sign(lat)*6;p.y-=q.ny*Math.sign(lat)*6;}}}
    if(Math.random()<.5)G.parts.push({x:p.x,y:p.y,vx:0,vy:0,life:.3,max:.3,c:p.type==='fly'?'rgba(255,255,255,.6)':'rgba(168,236,255,.7)',s:4});
    let gone=p.life<=0;
    for(const k of K){if(gone)break;if(k===p.owner&&p.grace>0||!sameLvl(k,p.idx))continue;if((k.x-p.x)**2+(k.y-p.y)**2<32*32){hitKart(k,'spin',p.type==='fly'?DMG.fly:DMG.spin);burst(p.x,p.y,'#a8ecff',10);gone=true;}}
    if(!gone)for(let j=G.haz.length-1;j>=0;j--){const h=G.haz[j];if((h.x-p.x)**2+(h.y-p.y)**2<30*30){G.haz.splice(j,1);burst(h.x,h.y,'#3fae3f',8);gone=true;break}}
    if(gone)G.proj.splice(i,1);
  }
  // places
  const sorted=[...K].sort((a,b)=>{if(a.fin&&b.fin)return a.ft-b.ft;if(a.fin)return -1;if(b.fin)return 1;return b.prog-a.prog});
  sorted.forEach((k,i)=>k.place=i+1);
  for(const k of K)k.lbY=k.lbY==null?k.place:k.lbY+(k.place-k.lbY)*Math.min(1,dt*9);
  updateParts(dt);forViews(()=>{camUpdate(dt);viewTick(dt);});
  // two players: once one has finished, the other gets 30 seconds to cross the line
  if(G.waitT&&G.state==='race'){G.waitT-=dt;if(G.waitT<=0){G.state='done';G.endT=.5;}}
  // end
  if(G.state==='done'){G.endT-=dt;if(G.endT<=0||K.every(k=>k.fin))showResults();}
}
// ---- pre-race show: revving engines, exhaust fire pops and flying frogs ----
function wheelieAngle(k){if(k.wheelie===undefined||k.spin>0||k.gulped)return 0;const e=k.wheelie-(k.wheelieDelay||0);if(e<=0||e>=1.6)return 0;
  if(e<.2)return .62*(e/.2);if(e<.7)return .62+Math.sin((e-.2)*12)*.03;if(e<1.35)return .62*Math.pow(1-(e-.7)/.65,2);return Math.sin((e-1.35)*25)*.05*(1.6-e)/.25;}
function exhaustPos(k,side){const T=G.T,c=Math.cos(k.a),s=Math.sin(k.a);const g=(T.hgt?kH(T,k):0)+(k.sw||0);return {x:k.x-c*33-s*side*7,y:k.y-s*33+c*side*7,h:g+k.z+11};}
function exhaustBurst(k,n,power=1){const c=Math.cos(k.a),s=Math.sin(k.a);for(const side of [-1,1]){const e=exhaustPos(k,side);for(let i=0;i<n;i++){const sp=(90+Math.random()*160)*power;
  G.fire.push({x:e.x,y:e.y,h:e.h,vx:-c*sp+(Math.random()-.5)*50,vy:-s*sp+(Math.random()-.5)*50,vh:20+Math.random()*60,life:.28+Math.random()*.22*power,max:.5*power,s:(4+Math.random()*4)*power,smoke:false});}
  G.fire.push({x:e.x,y:e.y,h:e.h,vx:-c*60,vy:-s*60,vh:40,life:.9,max:.9,s:6*power,smoke:true});}}
function preRaceFX(dt){
  G.revT-=dt;if(G.revT<=0&&G.cd>1.5){G.revT=1.25+Math.random()*.4;revSound(.8+Math.random()*.4);for(const k of G.karts)if(k.isP||Math.random()<.55)k.rev=1;G.popAt=G.t+.6;}
  if(G.popAt&&G.t>=G.popAt){G.popAt=0;for(const k of G.karts)if(k.rev>.5)exhaustBurst(k,3+Math.random()*3|0);popSound(.8);}
  for(const k of G.karts)if(!k.isP&&Math.random()<dt*.9){k.rev=.8;exhaustBurst(k,2);}
  G.flyT-=dt;if(G.flyT<=0&&G.cd>1.8){G.flyT=.28+Math.random()*.3;spawnFlyer();}
}
function spawnFlyer(){const T=G.T,P=G.players[Math.random()*G.players.length|0];const off=-6+Math.random()*30|0;const i=(P.idx+off+TN)%TN,q=T.pts[i];
  const dir=q.a+(Math.random()<.5?1:-1)*(Math.PI/2+(Math.random()-.5)*.8);const span=T.w/2+700+Math.random()*300;
  const g=T.hgt?T.hgt[i]:0;const fi=Math.random()*FROGS.length|0;const sp=480+Math.random()*260;
  G.flyers.push({x:q.x-Math.cos(dir)*span,y:q.y-Math.sin(dir)*span,vx:Math.cos(dir)*sp,vy:Math.sin(dir)*sp,h0:g+115+Math.random()*150,arc:40+Math.random()*90,t:0,dur:2*span/sp,fi,cape:Math.random()*5|0,spin:Math.random()<.25,ph:Math.random()*6});
  if(Math.random()<.5)ribbitSound(.5+Math.random()*.4);}
// ---- koi carp: swim about, pop up with mouths open, gulp jetskis and spit them into the air ----
function makeCarp(T){const n=[3,4,5,5][(T.lvl||1)-1],out=[];const r=mulberry(T.idx*53+11);
  for(let i=0;i<n;i++){const home=Math.floor((i+.5+r()*.4-.2)/n*TN+40)%TN;const q=T.pts[home];const lat=(r()-.5)*T.w;
    out.push({home,x:q.x+q.nx*lat,y:q.y+q.ny*lat,a:q.a+(r()-.5)*2,spd:250+r()*90,state:'swim',t:2+r()*4,mouth:0,rise:0,v:i%5,idx:home,lat:0,tx:null,ty:null,held:null,holdT:0,cool:0,wag:r()*6});}
  return out}
function updateCarp(dt){const T=G.T;
  for(const c of G.carp){c.wag+=dt*(c.state==='swim'?9:4);c.cool=Math.max(0,c.cool-dt);
    // hunt: pick a racer heading this way, swim across its path, then burst up in front of it
    c.ign=c.ign||{};if(!c.held&&G.state!=='count'){let best=null,bs=1e9;for(const k of G.karts){if(k.fin||k.ko>0||k.gulped||k.spitCD>0||(c.ign[k.id]||0)>G.t||(G.T.tower&&kH(G.T,k)>30))continue;
        const dx=c.x-k.x,dy=c.y-k.y,d=Math.hypot(dx,dy);if(d>1400)continue;const vv=Math.hypot(k.vx,k.vy)||1;const app=(k.vx*dx+k.vy*dy)/(vv*d);if(app<.35&&d>260)continue;const sc=d*(k.isP?.55:1);if(sc<bs){bs=sc;best=k}}
      c.prey=best;}else if(G.state==='count')c.prey=null;
    if(c.prey&&!c.held){const k=c.prey,vv=Math.hypot(k.vx,k.vy),d=Math.hypot(c.x-k.x,c.y-k.y);const lead=clamp(d/Math.max(250,vv+c.spd*.5),.15,1.4);c.tx=k.x+k.vx*lead;c.ty=k.y+k.vy*lead;
      const hx0=c.x+Math.cos(c.a)*108,hy0=c.y+Math.sin(c.a)*108,dh=Math.hypot(k.x-hx0,k.y-hy0);
      if(c.state==='swim'&&c.cool<=0&&dh<430){c.state='surface';c.t=1.6;splashAt(hx0,hy0,22,1.4);const dp=pDist(c.x,c.y);if(dp<900)plopSound(1-dp/900);}}
    else if(!c.tx||Math.hypot(c.tx-c.x,c.ty-c.y)<120){const j=(c.home+Math.floor((Math.random()-.5)*30)+TN)%TN,q=T.pts[j],lat=(Math.random()-.5)*(T.w+260);c.tx=q.x+q.nx*lat;c.ty=q.y+q.ny*lat;}
    if(!c.held){const want=Math.atan2(c.ty-c.y,c.tx-c.x),hunting=!!c.prey;const turn=c.state==='surface'?(hunting?3.6:1):(hunting?2.4:1.6);c.a+=clamp(angDiff(c.a,want),-turn*dt,turn*dt);
      const sp=c.state==='surface'?(hunting?290:c.spd*.3):c.spd*(hunting?1.3:1);c.x+=Math.cos(c.a)*sp*dt;c.y+=Math.sin(c.a)*sp*dt;}
    c.idx=nearestIdx(T,c.x,c.y,c.idx,20);const q=T.pts[c.idx];c.lat=(c.x-q.x)*q.nx+(c.y-q.y)*q.ny;
    c.t-=dt;
    if(c.state==='swim'){c.mouth=Math.max(0,c.mouth-dt*4);c.rise=Math.max(0,c.rise-dt*3);if(c.t<=0&&c.cool<=0){c.state='surface';c.t=1.9;splashAt(c.x+Math.cos(c.a)*90,c.y+Math.sin(c.a)*90,22,1.4);
        const dp=pDist(c.x,c.y);if(dp<900)plopSound(1-dp/900);}}
    else if(c.state==='surface'){c.rise=Math.min(1,c.rise+dt*3.5);c.mouth=c.held?Math.max(.15,c.mouth-dt*6):Math.min(1,c.mouth+dt*5);if(c.t<=0&&!c.held){c.state='swim';c.t=3.5+Math.random()*4;splashAt(c.x,c.y,14,1);}}
    // gulp!
    const hx=c.x+Math.cos(c.a)*108,hy=c.y+Math.sin(c.a)*108;
    if(c.state==='surface'&&c.mouth>.6&&!c.held&&G.state!=='count'){for(const k of G.karts){if(k.fin||k.ko>0||k.gulped||k.z>15||k.spitCD>0||(G.T.tower&&kH(G.T,k)>30))continue;if((k.x-hx)**2+(k.y-hy)**2>108*108)continue;
        if(k.star>0){continue}
        if(k.shield>0){k.shield=0;burst(k.x,k.y,'#7ef3ff',14);popText(k.x,k.y-30,'POP!','#7ef3ff');c.state='swim';c.t=3;c.cool=2;splashAt(hx,hy,10,1);break}
        c.held=k;c.holdT=.95;k.gulped=c;k.speed=k.vx=k.vy=0;k.boost=0;G.texts.push({x:hx,y:hy-20,s:'GULP!',c:'#ff8a1f',life:1,max:1,big:1});splashAt(hx,hy,16,1.2);
        const dp=pDist(k.x,k.y);if(k.isP){gulpSound(1);shk(k,.35)}else if(dp<900)gulpSound(.6*(1-dp/900));break;}}
    if(c.held){c.holdT-=dt;const k=c.held;k.x=hx;k.y=hy;if(c.holdT<=0){spitOut(c,k);}}
  }}
function spitOut(c,k){const T=G.T;c.held=null;c.ign=c.ign||{};c.ign[k.id]=G.t+7;c.prey=null;k.gulped=null;k.spitCD=2;c.state='swim';c.t=4+Math.random()*3;c.cool=2.5;
  const q=T.pts[k.idx];const hx=c.x+Math.cos(c.a)*135,hy=c.y+Math.sin(c.a)*135;k.x=hx;k.y=hy;k.a=q.a;k.speed=380;k.vx=q.tx*380;k.vy=q.ty*380;k.flip=1.25;
  launchKart(k,720);damage(k,8);G.texts.push({x:k.x,y:k.y-40,s:'PTOOO!',c:'#ffe14d',life:1.2,max:1.2,big:1});splashAt(hx,hy,26,1.6);
  const dp=pDist(k.x,k.y);if(k.isP){spitSound(1);shk(k,.6)}else if(dp<900)spitSound(.6*(1-dp/900));}
function launchKart(k,vz){const T=G.T;if(T.hgt){const gnd=kH(T,k);k.air=true;k.ay=gnd+1;k.avy=vz;k.z=1;k.vz=vz;k.gvp=undefined;}else{k.z=1;k.vz=vz;}}
function splashAt(x,y,n,p=1){const T=G.T,g=T.hgt?T.hAt(x,y):0;for(let i=0;i<n;i++){const a=Math.random()*TAU,sp=(60+Math.random()*160)*p;G.fire.push({spray:true,x,y,h:g+4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vh:(180+Math.random()*220)*p,life:.6+Math.random()*.4,max:1,s:(3+Math.random()*4)*p});}}
function updateFX(dt){
  updateCarp(dt);
  for(const k of G.karts){k.rev=Math.max(0,(k.rev||0)-dt*2.2);if(k.wheelie!==undefined&&k.wheelie<2)k.wheelie+=dt;}
  // jetski spray: a rooster tail from the back and splashes off the sides
  const T=G.T;for(const k of G.karts){if(k.ko>0||G.fire.length>520)continue;const sp=Math.abs(k.speed);if(sp<90)continue;const dp=pDist(k.x,k.y);if(dp>1800)continue;
    if(k.sz>3)continue;const c=Math.cos(k.a),s=Math.sin(k.a),g=(T.hgt?kH(T,k):0)+k.z+(k.sw||0);const wl=wheelieAngle(k)>.2?3:1;const n=dt*sp/(k.isP?45:70)*wl;for(let m=0;m<n+Math.random()-.5;m++){
      G.fire.push({spray:true,x:k.x-c*38+(Math.random()-.5)*8,y:k.y-s*38+(Math.random()-.5)*8,h:g+6,vx:c*sp*.62+(Math.random()-.5)*60,vy:s*sp*.62+(Math.random()-.5)*60,vh:120+sp*.2+Math.random()*60,life:.3+Math.random()*.15,max:.45,s:2.2+Math.random()*1.8});
      if(Math.random()<.25){const sd=Math.random()<.5?-1:1;G.fire.push({spray:true,x:k.x+c*8-s*sd*14,y:k.y+s*8+c*sd*14,h:g+4,vx:-s*sd*90-c*sp*.1,vy:c*sd*90-s*sp*.1,vh:70+Math.random()*50,life:.35,max:.45,s:3+Math.random()*2});}}}
  for(let i=G.fire.length-1;i>=0;i--){const f=G.fire[i];f.life-=dt;if(f.life<=0){G.fire.splice(i,1);continue}f.x+=f.vx*dt;f.y+=f.vy*dt;f.h+=f.vh*dt;
    if(f.spray){f.vh-=560*dt;f.vx*=.985;f.vy*=.985;}else{f.vx*=.9;f.vy*=.9;}if(f.smoke)f.s+=dt*14;}
  for(let i=G.flyers.length-1;i>=0;i--){const f=G.flyers[i];f.t+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.t>f.dur)G.flyers.splice(i,1);}
}
// ---- Sticky Tongue: lock on to the frog in front and yank it back ----
function tongueTarget(k){let best=null,bd=1e9;const ca=Math.cos(k.a),sa=Math.sin(k.a);
  for(const o of G.karts){if(o===k||o.fin||o.ko>0||o.gulped||(G.T.tower&&Math.abs(kH(G.T,o)+o.z-kH(G.T,k)-k.z)>150))continue;const dx=o.x-k.x,dy=o.y-k.y,d=Math.hypot(dx,dy);if(d<40||d>720)continue;
    const fw=(dx*ca+dy*sa)/d;if(fw<.8)continue;if(Math.abs(o.z-k.z)>120)continue;if(d<bd){bd=d;best=o}}return best}
function fireTongue(k){if(k.tongueCD>0||k.tng||k.spin>0||k.gulped||k.ko>0)return;const tgt=tongueTarget(k);
  const d=tgt?Math.hypot(tgt.x-k.x,tgt.y-k.y):520;k.tng={tgt,t:0,out:Math.max(.12,d/2000),phase:'out',hit:false};k.tongueCD=1;
  const dp=pDist(k.x,k.y);if(k.isP)thwipSound(1);else if(dp<800)thwipSound(.5*(1-dp/800));}
function updateTongues(dt){
  for(const k of G.karts){if(k.tongueT>0){k.tongueT-=dt;if(k.tongueT<=0&&k.isP)G.texts.push({x:k.x,y:k.y-50,s:'Tongue tired!',c:'#ffd0e0',life:.9,max:.9});}
    k.tongueCD=Math.max(0,(k.tongueCD||0)-dt);
    if(k.isP)k.lock=k.tongueT>0?tongueTarget(k):null;
    const tg=k.tng;if(!tg)continue;tg.t+=dt;
    if(tg.phase==='out'){const o=tg.tgt;if(o&&(o.fin||o.ko>0||o.gulped||Math.hypot(o.x-k.x,o.y-k.y)>900))tg.tgt=null;
      if(tg.t>=tg.out){tg.phase='in';tg.t=0;
        if(tg.tgt){const o=tg.tgt;tg.hit=true;const dx=k.x-o.x,dy=k.y-o.y,d=Math.hypot(dx,dy)||1;
          if(hitKart(o,'spin',8)){o.speed*=.2;o.vx=dx/d*340;o.vy=dy/d*340;o.spin=1.25;G.texts.push({x:o.x,y:o.y-40,s:['YANK!','SCHLURP!','GOTCHA!'][Math.random()*3|0],c:'#ff5f8f',life:1,max:1,big:1});burst(o.x,o.y,'#ff8ad8',12,'star');
            const dp=pDist(o.x,o.y);if(k.isP||o.isP)slurpSound(1);else if(dp<800)slurpSound(.5*(1-dp/800));}
          else{G.texts.push({x:o.x,y:o.y-40,s:'BOING!',c:'#7ef3ff',life:.8,max:.8});}}}}
    else if(tg.t>=.22)k.tng=null;}
}
function spawnBird(){
  const T=G.T,K=G.karts.filter(k=>!k.fin&&k.ko<=0);if(!K.length)return;const tk=Math.random()<.45?G.players[Math.random()*G.players.length|0]:K[Math.random()*K.length|0];
  const ti=(tk.idx+22+(Math.random()*26|0))%TN,q=T.pts[ti];const lat=(Math.random()-.5)*(T.w-70);const tx=q.x+q.nx*lat,ty=q.y+q.ny*lat;
  const dir=q.a+Math.PI/2*(Math.random()<.5?1:-1)+(Math.random()-.5)*.9,sp=520;const dist=900+Math.random()*300;
  G.birds.push({x:tx-Math.cos(dir)*dist,y:ty-Math.sin(dir)*dist,tx,ty,vx:Math.cos(dir)*sp,vy:Math.sin(dir)*sp,life:(dist*2)/sp,dropped:false,ti,lat,c:Math.random()*3|0,ph:Math.random()*6});
}
function obstacleHit(k,vn){
  if(vn>200&&k.star<=0){damage(k,(vn-200)*.07+5);G.texts.push({x:k.x,y:k.y-30,s:['OOF!','BOING!','HURK!'][Math.random()*3|0],c:'#ffe14d',life:.8,max:.8});
    if(k.isP){frogOof((vn-120)/450);shk(k,.3)}else{const d=pDist(k.x,k.y);if(d<500)frogOof((vn-120)/450,.5*(1-d/500))}}
  else if(k.isP){beep(330,.08,'sine',.07,300)}
}
function stepKart(k,dt){
  const T=G.T;
  // controls
  let steer=0,gas=0,brake=0;
  if(k.fin){ // cruise after finishing
    aiControl(k,dt);steer=k._s;gas=.6;
  }else if(G.state==='count'){gas=0}
  else if(k.isP){const inp=readInput(k);steer=inp.s;brake=inp.b;gas=inp.g;}else{aiControl(k,dt);steer=k._s;gas=k._g;brake=k._b;}
  if(k.isP){k._gas=gas;k._brk=brake;}
  if(k.gulped){k.speed=k.vx=k.vy=0;return;}
  // timers
  k.spitCD=Math.max(0,(k.spitCD||0)-dt);k.flip=Math.max(0,(k.flip||0)-dt);
  k.hurt=Math.max(0,k.hurt-dt);k.spinHit=Math.max(0,k.spinHit-dt);k.slipCD=Math.max(0,k.slipCD-dt);k.inv=Math.max(0,k.inv-dt);k.regenT-=dt;if(k.regenT<=0&&k.hp<100&&k.ko<=0)k.hp=Math.min(100,k.hp+5*dt);
  if(k.ko>0){k.ko-=dt;k.a+=10*dt;k.speed*=Math.pow(.05,dt);k.vx*=Math.pow(.05,dt);k.vy*=Math.pow(.05,dt);k.x+=k.vx*dt;k.y+=k.vy*dt;
    if(k.ko<=0){const ni=nearestIdx(T,k.x,k.y,k.idx);const q=T.pts[ni];k.x=q.x+q.nx*(k.ai.off*T.w*.5);k.y=q.y+q.ny*(k.ai.off*T.w*.5);k.a=q.a;k.speed=k.vx=k.vy=0;k.hp=100;k.inv=2;k.air=false;k.z=k.vz=0;k._g0=undefined;k.gvp=undefined;burst(k.x,k.y,'#fff',16);if(k.isP)jingle([523,784]);}
    return;}
  k.boost=Math.max(0,k.boost-dt);k.star=Math.max(0,k.star-dt);k.shield=Math.max(0,k.shield-dt);k.dizzy=Math.max(0,k.dizzy-dt);k.hop=Math.max(0,k.hop-dt);
  if(k.roul>0){k.roul-=dt;if(k.roul<=0){k.item=k.rItem;k.itemHold=0;if(k.isP)beep(1300,.12,'square',.06)}else if(k.isP&&Math.random()<dt*14)beep(600+Math.random()*400,.03,'square',.03)}
  if(k.item)k.itemHold+=dt;
  // track position
  const q0=T.pts[k.idx];const lat=(k.x-q0.x)*q0.nx+(k.y-q0.y)*q0.ny;
  const off=false;
  let maxS=k.maxS;
  if(!k.isP&&!k.fin){const d=[.8,.9,1][opts.diff]*[1,1.03,1.06,1.08][(T.lvl||1)-1];const gap=(Math.max(...G.players.map(p=>p.prog))-k.prog)/TN;maxS*=d*k.ai.skill*clamp(1+gap*.35,.86,1.14);}
  if(k.isP&&opts.diff===0)maxS*=1.03;
  if(off&&k.star<=0)maxS*=.48;
  if(k.boost>0)maxS*=1.5;if(k.star>0)maxS*=1.3;if(k.dizzy>0)maxS*=.6;
  // hills: downhill lifts your top speed, uphill drags it down
  let sl=0;if(T.hgt){sl=(T.hgt[(k.idx+1)%TN]-T.hgt[(k.idx-1+TN)%TN])/(2*T.L/TN)*Math.cos(angDiff(k.a,q0.a));if(k.z<=0)maxS*=sl>0?Math.max(.7,1-sl*.65):Math.min(1.75,1-sl*1.5);}
  k.slope=sl;
  if(k.spin>0){k.spin-=dt;k.a+=13*dt;k.speed*=Math.pow(.2,dt);}
  else{
    if(k.dizzy>0)steer+=Math.sin(G.t*9)*.5;
    if(brake)k.speed-=(k.speed>0?950:300)*dt;
    else if(gas)k.speed+=k.acc*gas*(k.boost>0||k.star>0?2:1)*dt;
    else k.speed-=Math.sign(k.speed)*Math.min(Math.abs(k.speed),250*dt);
    k.speed=Math.max(k.speed,-180);
    if(k.speed>maxS)k.speed-=(k.speed-maxS)*Math.min(1,2.6*dt);
    if(sl&&k.z<=0)k.speed-=(sl>0?400:820)*sl*dt;
    const sf=clamp(k.speed/180,-1,1);k.a+=clamp(steer,-1,1)*k.hnd*sf*dt*(1-Math.min(.35,Math.abs(k.speed)/3000))*(k.z>0?.5:1);
  }
  const grip=Math.min(1,(k.spin>0?2:9)*dt);
  k.vx+=(Math.cos(k.a)*k.speed-k.vx)*grip;k.vy+=(Math.sin(k.a)*k.speed-k.vy)*grip;
  k.x+=k.vx*dt;k.y+=k.vy*dt;
  // jumping: airborne after a launch pad
  if(!T.hgt&&(k.z>0||k.vz>0)){k.vz-=1100*dt;k.z+=k.vz*dt;if(k.z<=0){if(k.vz<-300){splashAt(k.x,k.y,18,1.1);if(k.isP){splatSound(.9);shk(k,.3)}}k.z=0;k.vz=0;}}
  // progress
  const ni=nearestIdx(T,k.x,k.y,k.idx);let dl=ni-k.idx;if(dl<-TN/2)dl+=TN;if(dl>TN/2)dl-=TN;k.prog+=dl;k.idx=ni;
  // swells: follow the rolling water, but when it drops away faster than you fall (fast over a crest) you get a little air
  {const sw=swellAt(T,trackS(T,k)),sl=SWD,sv=k._sw0===undefined?0:clamp((sw-k._sw0)/dt,-1500,1500);k._sw0=sw;k.swG=sw;k.swSl=sl;
   if(k.air||k.z>0||k.gulped||k.ko>0){k.sAir=false;k.sw=sw;k._svp=undefined;}
   else if(k.sAir){k.svy-=1150*dt;k.sy+=k.svy*dt;
     if(k.sy<=sw){k.sAir=false;const hit=k.svy-sv;k.sw=sw;k._svp=sv;if(hit<-150){splashAt(k.x,k.y,7,.7);if(k.isP&&hit<-230)splatSound(.3);}}else k.sw=k.sy;}
   else{const acc=k._svp===undefined?0:(sv-k._svp)/dt;
     if(acc<-1150*1.15&&k.speed>300&&G.state!=='count'){k.sAir=true;k.svy=k._svp;k.sy=sw;k.sw=sw;k._svp=undefined;splashAt(k.x,k.y,5,.6);if(k.isP&&k.svy>170)G.texts.push({x:k.x,y:k.y-40,s:'AIR!',c:'#7ef3ff',life:.6,max:.6});}
     else{k.sw=sw;k._svp=sv;}}
   k.sz=k.sw-sw;}
  // hills: follow the ground, but fly off steep crests when going fast, and arc through the air after a jump pad
  if(T.hgt){const gnd=kH(T,k);const gv=k._g0===undefined?0:clamp((gnd-k._g0)/dt,-2500,2500);k._g0=gnd;
    if(k.air){k.avy-=1150*dt;k.ay+=k.avy*dt;if(k.ay<=gnd){const hit=k.avy-gv;k.air=false;k.z=0;k.vz=0;if(hit<-260){burst(k.x,k.y,'#ffffff',10);splashAt(k.x,k.y,14,1);if(k.isP){beep(90,.15,'sine',.12,-30);shk(k,clamp(-hit/1600,.15,.45))}}}else{k.z=k.ay-gnd;k.vz=k.avy-gv;}}
    else if(k.gvp!==undefined&&k.ko<=0){const up=k.gvp-1150*dt;const rel=up-gv;if(rel>120&&k.speed>280){k.air=true;k.ay=gnd+rel*dt;k.avy=up;k.z=k.ay-gnd;k.vz=rel;if(k.isP&&rel>200)G.texts.push({x:k.x,y:k.y-40,s:'AIR!',c:'#7ef3ff',life:.7,max:.7});}}
    k.gvp=k.air?undefined:gv;}
  const q=T.pts[k.idx];const lat2=(k.x-q.x)*q.nx+(k.y-q.y)*q.ny;k._lat=lat2;const lim=T.w/2-17;
  if(Math.abs(lat2)>lim){const sg=Math.sign(lat2),e=Math.abs(lat2)-lim;k.x-=q.nx*sg*e;k.y-=q.ny*sg*e;
    const vn=(k.vx*q.nx+k.vy*q.ny)*sg; // outward speed
    if(vn>0){k.vx-=1.5*vn*q.nx*sg;k.vy-=1.5*vn*q.ny*sg;
      const fwd=Math.cos(angDiff(k.a,q.a))>=0?q.a:q.a+Math.PI;k.a+=angDiff(k.a,fwd)*Math.min(1,vn/500);
      if(vn>90){k.speed*=clamp(1-vn/1400,.55,1);if(Math.random()<.7)burst(k.x+q.nx*sg*18,k.y+q.ny*sg*18,'#fff',4);}
      const pw=(vn-120)/450;
      if(vn>250&&k.star<=0){damage(k,(vn-250)*.07+4,'wall');G.texts.push({x:k.x,y:k.y-30,s:['OOF!','HURK!','OOOF!','BLURP!'][Math.random()*4|0],c:'#ffe14d',life:.8,max:.8});
        if(k.isP){frogOof(pw);beep(110,.12,'square',.05,-40);shk(k,.3)}
        else{const dd=pDist(k.x,k.y);if(dd<500)frogOof(pw,.5*(1-dd/500))}}
      else if(vn>160&&k.isP)frogOof(pw*.6,.6);
      else if(vn>90&&k.isP)beep(200,.05,'square',.04);}}
  // dust offroad
  if(off&&Math.abs(k.speed)>120&&Math.random()<.4)G.parts.push({x:k.x-Math.cos(k.a)*20,y:k.y-Math.sin(k.a)*20,vx:(Math.random()-.5)*60,vy:(Math.random()-.5)*60,life:.5,max:.5,c:'rgba(120,90,50,.45)',s:6});
  if((k.boost>0||k.star>0)&&Math.random()<.8)G.parts.push({x:k.x-Math.cos(k.a)*28,y:k.y-Math.sin(k.a)*28,vx:-Math.cos(k.a)*120+(Math.random()-.5)*60,vy:-Math.sin(k.a)*120+(Math.random()-.5)*60,life:.35,max:.35,c:k.star>0?`hsl(${Math.random()*360},95%,60%)`:(Math.random()<.5?'#ffb627':'#ff5a1f'),s:6});
  // wrong way
  if(k.isP){const fd=Math.cos(angDiff(k.a,q.a));k.wrong=(fd<-.3&&Math.abs(k.speed)>60&&k.spin<=0)?k.wrong+dt:0;
    // spun out and left facing the wrong way, or stuck: after 3 seconds you're popped back on the track facing forwards
    if(G.state==='race'&&!k.fin&&!k.gulped&&k.ko<=0&&!k.air&&!k.sAir&&k.z<=0){
      k.lostT=k.spin>0||fd<-.2?(k.lostT||0)+dt:fd>.5?0:(k.lostT||0);   // only clears once you're properly facing forwards again
      k._rpT=(k._rpT||0)+dt;if(k._rpT>=.5){k._stuck=k.prog-(k._rp??k.prog)<1?(k._stuck||0)+k._rpT:0;k._rp=k.prog;k._rpT=0;}
      if(k.lostT>=3||k._stuck>=3)rescueKart(k);}
    else if(G.state!=='race'||k.fin){k.lostT=0;k._stuck=0;k._rp=k.prog;k._rpT=0;}else k._rp=k.prog;}   // (timers just pause while flying through the air or held by a carp)
  // laps
  const newLap=Math.floor(k.prog/TN)+1;
  if(newLap>k.lap&&!k.fin){k.lap=newLap;
    if(k.lap>G.laps){k.fin=true;k.ft=G.raceT;G.finishOrder.push(k);if(k.isP){if(G.players.every(p=>p.fin)){G.state='done';G.endT=4.5;}else G.waitT=G.waitT||30;jingle(k.place<=3?[523,659,784,1047,1319]:[392,523,659]);G.texts.push({x:k.x,y:k.y-60,s:'FINISH!',c:'#fff',life:2.5,max:2.5,big:1});}}
    else if(k.isP){const fl=k.lap===G.laps;if(fl)MUS.tempo=1.12;setBanner(k,{s:fl?'FINAL LAP!':'LAP '+k.lap,t:2});beep(fl?880:660,.2,'square',.07);if(fl)setTimeout(()=>beep(1100,.25,'square',.07),150)}}
}
function rescueKart(k){const T=G.T,ni=nearestIdx(T,k.x,k.y,k.idx,30),i=(ni+1)%TN,q=T.pts[i],lat=clamp(k._lat||0,-T.w*.28,T.w*.28);
  let dl=i-k.idx;if(dl<-TN/2)dl+=TN;if(dl>TN/2)dl-=TN;k.prog+=dl;k.idx=i;
  k.x=q.x+q.nx*lat;k.y=q.y+q.ny*lat;k.a=q.a;k.speed=180;k.vx=q.tx*180;k.vy=q.ty*180;k.spin=0;k.dizzy=0;k.inv=1.2;k.wrong=0;k.lostT=0;k._stuck=0;k._rp=k.prog;
  k.z=k.vz=0;k.air=false;k.sAir=false;k._g0=undefined;k.gvp=undefined;k._sw0=undefined;k._svp=undefined;
  if(G.vk&&k!==G.vk&&k.vs)k.vs.camYaw=k.a;else G.camYaw=k.a;   // camera straight back behind you
  burst(k.x,k.y,'#fff',16);burst(k.x,k.y,'#7ef3ff',10,'star');G.texts.push({x:k.x,y:k.y-50,s:'BACK ON TRACK!',c:'#7ef3ff',life:1.3,max:1.3});if(k.isP)jingle([523,659,784]);}
function aiControl(k,dt){
  const T=G.T,ai=k.ai;
  // rescue: if a rival makes no progress for a while, pop it back on the track facing forwards
  if(!k.isP&&G.state!=='count'&&k.ko<=0){ai.chk=(ai.chk||0)+dt;if(ai.chk>2.5){if(k.prog-(ai.lastP??-1e9)<4){const ni=(k.idx+2)%TN,q=T.pts[ni];k.x=q.x;k.y=q.y;k.idx=ni;k.prog+=2;k.a=q.a;k.speed=k.vx=k.vy=0;k.spin=0;k.inv=1.2;k.z=k.vz=0;k.air=false;k._g0=undefined;k.gvp=undefined;burst(k.x,k.y,'#fff',12);}ai.chk=0;ai.lastP=k.prog;}}
  ai.offT-=dt;if(ai.offT<=0){ai.offT=1.5+Math.random()*2.5;const om=T.lvl>1?.2:.32;ai.off=clamp(ai.off+(Math.random()-.5)*.4,-om,om);}
  let off=ai.off;
  // seek boxes
  if(!k.item&&k.roul<=0){for(const b of T.boxes){if(b.t>0)continue;let d=b.i-k.idx;if(d<0)d+=TN;if(d>3&&d<22){off=b.lat/T.w;break}}}
  // avoid hazards
  for(const h of G.haz){const dx=h.x-k.x,dy=h.y-k.y;if(dx*dx+dy*dy<260*260&&dx*Math.cos(k.a)+dy*Math.sin(k.a)>0){const q=T.pts[k.idx];const hl=(h.x-q.x)*q.nx+(h.y-q.y)*q.ny;off=hl>0?-.3:.3;}}
  const segL=T.L/TN;let look=Math.max(3,Math.round((150+Math.max(0,k.speed)*.42)/segL));let p=T.pts[(k.idx+look)%TN];let wantSlow=0;
  // steer round the nearest bumper ahead
  {let best=null,bd=99;for(const bm of [...T.bumpers.filter(b=>b.gone<=0),...G.puddles,...G.poos,...G.carp.filter(c=>c.state==='surface').map(c=>{const q=G.T.pts[c.idx];const hx=c.x+Math.cos(c.a)*108,hy=c.y+Math.sin(c.a)*108;return {i:nearestIdx(G.T,hx,hy,c.idx,8),lat:(hx-q.x)*q.nx+(hy-q.y)*q.ny}})]){let d=bm.i-k.idx;if(d<0)d+=TN;if(d>1&&d<24&&d<bd&&Math.abs(bm.lat-off*T.w)<54){best=bm;bd=d}}
   if(best){const room=T.w/2-24;const side=Math.abs(best.lat+56)<=room&&(best.lat<=0||Math.abs(best.lat-56)>room)?1:-1;const al=clamp(best.lat+side*56,-room,room);off=al/T.w;
     look=Math.max(3,Math.min(look,bd+2));p=T.pts[(k.idx+look)%TN];if(bd<6&&Math.abs(best.lat-k._lat)<40&&k.speed>380)wantSlow=1;}}
  // sweepers have one arm: drive on the side it isn't on
  for(const sp of T.spinners){let d=sp.i-k.idx;if(d<0)d+=TN;if(d<1||d>16)continue;const q=T.pts[sp.i];const eta=d*T.L/TN/Math.max(150,k.speed);
    const ang=sp.ph+sp.spd*(G.t+eta);const side=Math.cos(ang)*q.nx+Math.sin(ang)*q.ny;
    if(Math.abs(side)>.3)off=-Math.sign(side)*.27;else off=off>=0?.27:-.27;
    const now=Math.cos(sp.ph+sp.spd*G.t)*q.nx+Math.sin(sp.ph+sp.spd*G.t)*q.ny;if(d<5&&Math.sign(now)===Math.sign(off)&&Math.abs(now)>.4&&k.speed>200)wantSlow=2;break;}
  // wiggly sections (quick left-right flips): hold the middle, look further ahead and ease off
  {let flips=0,last=0,mc=0;for(let j=1;j<22;j++){const q1=T.pts[(k.idx+j)%TN],q2=T.pts[(k.idx+j+1)%TN];const da=angDiff(q1.a,q2.a);if(Math.abs(da)>.01){const sg=Math.sign(da);if(last&&sg!==last)flips++;last=sg;}mc=Math.max(mc,T.curv[(k.idx+j)%TN]);}
   if(flips>=2&&mc>1/420){off*=.25;look=Math.min(look+Math.round(150/segL),24);p=T.pts[(k.idx+look)%TN];k._wig=1;}else k._wig=0;}
  const tx=p.x+p.nx*off*T.w,ty=p.y+p.ny*off*T.w;
  const da=angDiff(k.a,Math.atan2(ty-k.y,tx-k.x));
  k._s=clamp(da*3,-1,1);k._g=1;k._b=(Math.abs(da)>1.1&&k.speed>260)?1:0;if(wantSlow===2){k._g=0;k._b=k.speed>140?1:0}else if(wantSlow===1){k._g=0;}
  {let mc=0;const ah=4+Math.floor(Math.max(0,k.speed)*(T.L/TN<30?1/40:1/30)*30/(T.L/TN));for(let j=2;j<ah;j++)mc=Math.max(mc,T.curv[(k.idx+j)%TN]);const safe=k.hnd*(T.lvl>1?.64:.82)/Math.max(mc,1e-4)*(k.ai.skill+.08);
   if(k._wig&&k.speed>safe*.9){k._g=0;if(k.speed>safe*1.05)k._b=1;}else if(k.speed>safe*1.04){k._g=0;if(k.speed>safe*1.2)k._b=1;}}
  // items
  if(k.tongueT>0&&!k.fin&&G.state==='race'&&k.tongueCD<=0&&Math.random()<dt*1.2&&tongueTarget(k))fireTongue(k);
  if(k.item&&!k.fin&&G.state==='race'){
    const it=k.item;let use=false;
    if(it==='turbo'||it==='star')use=k.itemHold>.5;
    else if(it==='shield')use=k.itemHold>.3;
    else if(it==='croak')use=k.itemHold>1.5&&k.place>2;
    else if(it==='lily')use=k.itemHold>2+Math.random()*3||G.karts.some(o=>o!==k&&o.prog<k.prog&&k.prog-o.prog<14);
    else if(it==='fly')use=k.itemHold>1&&k.place>1;
    else if(it==='tongue')use=k.itemHold>.4&&k.place>1;
    else if(it==='bubble'){for(const o of G.karts){if(o===k)continue;const dx=o.x-k.x,dy=o.y-k.y,d=Math.hypot(dx,dy);if(d<600&&d>60){const aa=Math.abs(angDiff(k.a,Math.atan2(dy,dx)));if(aa<.18){use=true;break}}}if(k.itemHold>6)use=true;}
    if(use&&Math.random()<dt*4)useItem(k);
  }
}
function updateParts(dt){
  for(let i=G.parts.length-1;i>=0;i--){const p=G.parts[i];p.life-=dt;if(p.life<=0){G.parts.splice(i,1);continue}if(!p.ring){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.92;p.vy*=.92;}}
  for(let i=G.texts.length-1;i>=0;i--){const p=G.texts[i];p.life-=dt;p.y-=30*dt;if(p.life<=0)G.texts.splice(i,1)}
}
function viewTick(dt){if(G.banner){G.banner.t-=dt;if(G.banner.t<=0)G.banner=null}G.shake=Math.max(0,(G.shake||0)-dt);}
function camUpdate(dt){
  {const P=G.player;let ty=P.a;if((P.spin>0||P.ko>0)&&Math.hypot(P.vx,P.vy)>40)ty=Math.atan2(P.vy,P.vx);if(P.spin>0||P.ko>0)ty=G.camYaw;
   G.camYaw+=angDiff(G.camYaw,ty)*Math.min(1,(P.spin>0?1.5:5)*dt);
   const o=clamp((G.cd-1.2)/5.2,0,1);G.camOrbit=Math.PI*o*o*(3-2*o);}
  const P=G.player;const z0=clamp(Math.min(W,H)/600,.62,1.4);const sp=Math.abs(P.speed)/P.maxS;
  const zt=z0*(1-sp*.12);G.cam.z+=(zt-G.cam.z)*Math.min(1,2*dt);
  const tx=P.x+P.vx*.35,ty=P.y+P.vy*.35;G.cam.x+=(tx-G.cam.x)*Math.min(1,5*dt);G.cam.y+=(ty-G.cam.y)*Math.min(1,5*dt);
}

// ================= render =================
let VOX=0,VOY=0;   // where the screen being drawn sits on the page (split screen)
// two players: side by side on a wide screen, one above the other on a tall one
function splitViews(){if(!G.players||G.players.length<2)return null;const a=G.players[0],b=G.players[1];
  if(W>=H*.9){const w=Math.floor(W/2);return [{p:a,x:0,y:0,w,h:H},{p:b,x:W-w,y:0,w,h:H}]}
  const h=Math.floor(H/2);return [{p:a,x:0,y:0,w:W,h},{p:b,x:0,y:H-h,w:W,h}]}
function skyBands(n){const sk=G.T.th.sky||['#5ec8ff','#e4f7ff'];if(G.skyN===n)return;G.skyN=n;
  GL3.cvs.style.background=n===2?`linear-gradient(180deg,${sk[0]} 0%,${sk[1]} 31%,${sk[1]} 50%,${sk[0]} 50%,${sk[1]} 81%,${sk[1]} 100%)`:`linear-gradient(180deg,${sk[0]} 0%,${sk[1]} 62%,${sk[1]} 100%)`;}
function render(){
  const vs=splitViews();VOX=VOY=0;
  if(!vs){if(GL3.ok){skyBands(1);const c=ctx;c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,W,H);render3D();overlay3D(c);drawHUD(c);return;}render2D();return;}
  const FW=W,FH=H,c=ctx,side=vs[0].h===FH;
  c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,FW,FH);if(GL3.ok)skyBands(side?1:2);
  try{for(const v of vs){useView(v.p);W=v.w;H=v.h;VOX=v.x;VOY=v.y;c.save();c.setTransform(DPR,0,0,DPR,0,0);
    if(GL3.ok){render3D({x:v.x,y:v.y,w:v.w,h:v.h,fw:FW,fh:FH});c.translate(v.x,v.y);c.beginPath();c.rect(0,0,v.w,v.h);c.clip();overlay3D(c);drawHUD(c);}
    else{c.beginPath();c.rect(v.x,v.y,v.w,v.h);c.clip();render2D();}
    c.restore();}}
  finally{W=FW;H=FH;VOX=VOY=0;useView(G.players[0]);}
  // the line between the two screens
  c.setTransform(DPR,0,0,DPR,0,0);c.fillStyle='#3b1d8f';if(side)c.fillRect(FW/2-3,0,6,FH);else c.fillRect(0,FH/2-3,FW,6);
  c.fillStyle='#fff';if(side)c.fillRect(FW/2-1,0,2,FH);else c.fillRect(0,FH/2-1,FW,2);
}
function render2D(){
  const T=G.T,th=T.th,c=ctx,cam=G.cam,z=cam.z;
  const sx=G.shake>0?(Math.random()-.5)*14*G.shake:0,sy=G.shake>0?(Math.random()-.5)*14*G.shake:0;
  c.setTransform(DPR*z,0,0,DPR*z,DPR*(VOX+W/2-cam.x*z+sx),DPR*(VOY+H/2-cam.y*z+sy));
  const vw=W/z/2+120,vh=H/z/2+120,x0=cam.x-vw,x1=cam.x+vw,y0=cam.y-vh,y1=cam.y+vh;
  c.fillStyle=groundPattern(c,th);c.fillRect(x0,y0,x1-x0,y1-y0);
  // big decos first (under road)
  const t=G.t;
  // road
  c.lineJoin='round';c.lineCap='round';
  c.save();c.translate(0,16);c.strokeStyle='rgba(50,20,110,.22)';c.lineWidth=T.w+70;c.stroke(T.path);c.restore();
  // inflatable bumper walls
  c.strokeStyle=shade(th.eB,-.3);c.lineWidth=T.w+62;c.stroke(T.path);
  c.strokeStyle=th.eB;c.lineWidth=T.w+52;c.stroke(T.path);
  c.setLineDash([70,70]);c.strokeStyle=th.eA;c.stroke(T.path);c.setLineDash([]);
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=T.w+30;c.stroke(T.path);
  c.strokeStyle=shade(th.eB,-.35);c.lineWidth=T.w+8;c.stroke(T.path);
  // track surface
  c.strokeStyle=th.road;c.lineWidth=T.w;c.stroke(T.path);
  if(th.planks){c.setLineDash([6,24]);c.strokeStyle='rgba(120,60,20,.35)';c.lineWidth=T.w;c.stroke(T.path);c.setLineDash([]);
    c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=T.w*.7;c.stroke(T.path);}
  else{c.strokeStyle='rgba(255,255,255,.13)';c.lineWidth=T.w*.62;c.stroke(T.path);c.strokeStyle='rgba(255,255,255,.1)';c.lineWidth=T.w*.3;c.stroke(T.path);
    c.setLineDash([30,50]);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=7;c.stroke(T.path);c.setLineDash([]);}
  // swells drifting down the course
  for(const w of G.swells){if(w.a<1)continue;const f=w.s/T.cum[TN]*TN,i=Math.floor(f)%TN,q=T.pts[i];c.strokeStyle=`rgba(255,255,255,${.25+w.a*.04})`;c.lineWidth=8+w.a*1.5;c.beginPath();c.moveTo(q.x-q.nx*T.w/2,q.y-q.ny*T.w/2);c.lineTo(q.x+q.nx*T.w/2,q.y+q.ny*T.w/2);c.stroke();}
  // start line
  const s0=T.pts[0];c.save();c.translate(s0.x,s0.y);c.rotate(s0.a);
  const sq=18,nC=Math.ceil(T.w/sq);for(let i=0;i<nC;i++)for(let j=0;j<3;j++){c.fillStyle=(i+j)%2?'#111':'#fff';c.fillRect(-sq*1.5+j*sq,-T.w/2+i*sq,sq,Math.min(sq,T.w/2-(-T.w/2+i*sq)));}
  // grid marks
  c.restore();
  // pads
  for(const pd of T.pads){c.save();c.translate(pd.x,pd.y);c.rotate(pd.a);c.fillStyle='#ff7a1a';rr(c,-50,-36,100,72,14);c.fill();c.fillStyle='#ffb627';rr(c,-44,-30,88,60,10);c.fill();
    for(let i=0;i<3;i++){const o=((t*120+i*30)%90)-45;c.fillStyle=`rgba(255,255,255,${.9-Math.abs(o)/60})`;c.beginPath();c.moveTo(o-10,-20);c.lineTo(o+8,0);c.lineTo(o-10,20);c.lineTo(o-2,20);c.lineTo(o+16,0);c.lineTo(o-2,-20);c.fill();}c.restore();}
  for(const bm of T.bumpers){c.fillStyle='#ff5fa2';circ(c,bm.x,bm.y,bm.r);c.fillStyle='#fff';circ(c,bm.x,bm.y,bm.r*.55);}
  for(const sp of T.spinners){const a=sp.ph+sp.spd*G.t;c.strokeStyle='#ffe14d';c.lineWidth=14;c.beginPath();c.moveTo(sp.x-Math.cos(a)*sp.len,sp.y-Math.sin(a)*sp.len);c.lineTo(sp.x+Math.cos(a)*sp.len,sp.y+Math.sin(a)*sp.len);c.stroke();c.fillStyle='#8f5cff';circ(c,sp.x,sp.y,16);}
  // decorations
  for(const d of T.decos){if(d.x<x0-d.s*2||d.x>x1+d.s*2||d.y<y0-d.s*2||d.y>y1+d.s*2)continue;drawDeco(c,d,t);}
  // item boxes
  for(const b of T.boxes){if(b.t>0){if(b.t<.4){c.globalAlpha=1-b.t/.4}else continue}
    if(b.x<x0||b.x>x1||b.y<y0||b.y>y1){c.globalAlpha=1;continue}
    c.save();c.translate(b.x,b.y+Math.sin(t*3+b.x)*3);c.rotate(t*1.6+b.lat);
    c.fillStyle='rgba(0,0,0,.2)';rr(c,-18,-14,40,40,8);c.fill();
    const g=c.createLinearGradient(-20,-20,20,20);const h=(t*120+b.lat)%360;g.addColorStop(0,`hsl(${h},95%,65%)`);g.addColorStop(1,`hsl(${h+120},95%,60%)`);c.fillStyle=g;rr(c,-20,-20,40,40,8);c.fill();
    c.fillStyle='rgba(255,255,255,.35)';rr(c,-16,-17,32,10,5);c.fill();c.strokeStyle='#fff';c.lineWidth=3.5;rr(c,-20,-20,40,40,10);c.stroke();
    c.rotate(-(t*1.6+b.lat));c.fillStyle='#fff';c.font='28px '+FONT;c.textAlign='center';c.textBaseline='middle';c.fillText('?',0,2);
    c.restore();c.globalAlpha=1;}
  for(const pd of G.puddles){c.globalAlpha=Math.min(1,pd.life);c.fillStyle='#f4f4ee';circ(c,pd.x,pd.y,pd.r*pd.grow);c.fillStyle='#6f735c';circ(c,pd.x+3,pd.y-2,pd.r*pd.grow*.35);c.globalAlpha=1;}
  for(const p of G.poos){c.fillStyle='rgba(0,0,0,.25)';circ(c,p.x,p.y,8+22*(1-p.h/150));}
  for(const b of G.birds){c.fillStyle='#ffffff';circ(c,b.x,b.y,14);}
  // hazards
  for(const h of G.haz){c.save();c.translate(h.x,h.y);c.rotate(h.r);drawItemIcon(c,'lily',0,0,44,t);c.restore()}
  // karts (sorted)
  const ks=[...G.karts].sort((a,b)=>a.y-b.y);
  for(const k of ks){
    c.save();c.translate(k.x,k.y);
    c.fillStyle='rgba(50,20,110,.22)';c.beginPath();c.ellipse(4,9,27,19,k.a,0,TAU);c.fill();
    if(k.inv>0&&Math.floor(t*12)%2){c.globalAlpha=.4}
    const hp=k.hop>0?Math.sin(k.hop/.35*Math.PI)*10:(k.ko>0?Math.abs(Math.sin(k.ko*6))*8:0);
    c.translate(0,-hp);c.rotate(k.a);if(hp)c.scale(1+hp/60,1+hp/60);
    drawFrogKart(c,k.f,{t,star:k.star>0});
    if(k.hurt>0){c.fillStyle=`rgba(255,60,90,${k.hurt*1.4})`;rr(c,-24,-15,48,30,12);c.fill();}
    c.restore();c.globalAlpha=1;
    if(k.ko>0){c.fillStyle='#ffe14d';for(let i=0;i<5;i++){const a=t*7+i*TAU/5;star(c,k.x+Math.cos(a)*26,k.y-34+Math.sin(a)*8,7,3,5);c.fill();}}
    if(k.shield>0){c.strokeStyle=`rgba(126,243,255,${.6+Math.sin(t*8)*.2})`;c.lineWidth=4;c.beginPath();c.arc(k.x,k.y,34,0,TAU);c.stroke();c.fillStyle='rgba(126,243,255,.12)';circ(c,k.x,k.y,34);}
    if(k.dizzy>0||k.spin>0){for(let i=0;i<3;i++){const a=t*6+i*TAU/3;c.fillStyle='#ffd23f';star(c,k.x+Math.cos(a)*20,k.y-30+Math.sin(a)*6,6,2.5,5);c.fill();}}
    if(k!==G.player){c.font='600 15px '+BFONT;c.textAlign='center';c.fillStyle='rgba(60,25,120,.6)';const w=c.measureText(k.f.name).width+12;rr(c,k.x-w/2,k.y-60,w,20,10);c.fill();c.fillStyle='#fff';c.fillText(k.f.name,k.x,k.y-45);}
    else{const by=k.y-44+Math.sin(t*5)*3;c.fillStyle='#ffe14d';c.strokeStyle='#3b1d8f';c.lineWidth=3;c.beginPath();c.moveTo(k.x,by+12);c.lineTo(k.x-10,by-4);c.lineTo(k.x+10,by-4);c.closePath();c.fill();c.stroke();}
  }
  // projectiles
  for(const p of G.proj){c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.vy,p.vx));drawItemIcon(c,p.type,0,0,p.type==='bubble'?32:30,t);c.restore()}
  // particles
  for(const p of G.parts){const a=p.life/p.max;if(p.ring){c.strokeStyle=`rgba(255,210,63,${a})`;c.lineWidth=10*a;c.beginPath();c.arc(p.x,p.y,(1-a)*700,0,TAU);c.stroke();continue}
    c.globalAlpha=a;c.fillStyle=p.c;if(p.type==='star'){star(c,p.x,p.y,p.s,p.s*.45,5);c.fill()}else circ(c,p.x,p.y,p.s*(.5+a*.5));c.globalAlpha=1;}
  // start banner (overhead)
  c.save();c.translate(s0.x,s0.y);c.rotate(s0.a);
  const bw=T.w/2+34;c.fillStyle='#555';circ(c,0,-bw,10);circ(c,0,bw,10);
  c.globalAlpha=.92;c.fillStyle=th.eB;rr(c,-16,-bw,32,bw*2,10);c.fill();c.fillStyle='#fff';rr(c,-11,-bw+8,22,bw*2-16,7);c.fill();
  c.rotate(Math.PI/2);c.fillStyle=th.eB==='#ffffff'?'#222':th.eB;c.font='22px '+FONT;c.textAlign='center';c.textBaseline='middle';c.fillText('START  ★  FINISH',0,1);
  c.restore();c.globalAlpha=1;
  // floating texts
  for(const p of G.texts){const a=Math.min(1,p.life/p.max*2);c.globalAlpha=a;c.font=(p.big?54:28)+'px '+FONT;c.textAlign='center';c.lineWidth=7;c.strokeStyle='#3b1d8f';c.strokeText(p.s,p.x,p.y);c.fillStyle=p.c;c.fillText(p.s,p.x,p.y);c.globalAlpha=1}
  // screen-space
  c.setTransform(DPR,0,0,DPR,DPR*VOX,DPR*VOY);
  if(th.night){const g=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,20,0)');g.addColorStop(1,'rgba(0,0,20,.55)');c.fillStyle=g;c.fillRect(0,0,W,H)}
  drawHUD(c);
}
const FONT="'Titan One','Arial Rounded MT Bold',sans-serif",BFONT="'Fredoka',sans-serif";
function outlined(c,s,x,y,size,fill,align='left'){c.font=size+'px '+FONT;c.textAlign=align;c.textBaseline='alphabetic';c.lineJoin='round';const lw=Math.max(5,size/6);c.lineWidth=lw;c.strokeStyle='#3b1d8f';c.strokeText(s,x,y+size*.08);c.strokeText(s,x,y);c.fillStyle=fill;c.fillText(s,x,y);c.fillStyle='rgba(255,255,255,.35)';c.save();c.beginPath();c.rect(x-2000,y-size*.75,4000,size*.25);c.clip();c.fillText(s,x,y);c.restore()}
// ================= leaderboard =================
// one row per racer: place, a little picture of the frog and their name. You (and in 2-player, both players) are highlighted.
function drawLeaderboard(c,x,y,w,rh,P,two){const K=G.karts,n=K.length,pad=4,h=n*rh+pad*2-3;
  c.save();c.fillStyle='rgba(59,29,143,.55)';rr(c,x-6,y-6,w+12,h+12,18);c.fill();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;c.stroke();
  const fs=Math.max(10,Math.round(rh*.6)),ic=rh-3;c.textBaseline='middle';
  for(const k of [...K].sort((a,b)=>(a===P)-(b===P))){const ry=y+pad+((k.lbY==null?k.place:k.lbY)-1)*rh,me=k===P,hum=k.isP&&two,cy=ry+(rh-3)/2;
    const hi=me||hum;c.fillStyle=hi?(two&&k.pi===1?'rgba(255,95,162,.95)':'rgba(255,225,77,.95)'):'rgba(255,255,255,.13)';rr(c,x,ry,w,rh-3,(rh-3)/2);c.fill();
    if(me){c.strokeStyle='#fff';c.lineWidth=2;c.stroke();}
    // place
    const pc=k.place===1?'#ffd23f':k.place===2?'#e6ecf5':k.place===3?'#ff9d5c':'#ffffff';
    c.font=fs+'px '+FONT;c.textAlign='center';c.lineWidth=3;c.strokeStyle='#3b1d8f';if(!hi)c.strokeText(String(k.place),x+fs*.75,cy+1);c.fillStyle=hi?'#3b1d8f':pc;c.fillText(String(k.place),x+fs*.75,cy+1);
    // the frog's face (cropped from its menu picture), or a dot of its colour
    const ix=x+fs*1.55,E=THUMB_EYES[k.fi],im=THUMBS[k.fi];
    if(im&&E){const ex=(E[0].c[0]+E[1].c[0])/2,ey=(E[0].c[1]+E[1].c[1])/2+14,cs=118;c.save();c.beginPath();c.arc(ix+ic/2,cy,ic/2,0,TAU);c.fillStyle=hi?'rgba(255,255,255,.7)':'rgba(255,255,255,.85)';c.fill();c.clip();c.drawImage(im,ex-cs/2,ey-cs/2,cs,cs,ix,cy-ic/2,ic,ic);c.restore();}
    else{c.fillStyle=k.f.kart;circ(c,ix+ic/2,cy,ic/2.4);}
    // name (shortened if it doesn't fit) and a chequered flag once they've finished
    const nx=ix+ic+5,room=x+w-nx-(k.fin?16:8);c.font=`600 ${fs}px ${BFONT}`;c.textAlign='left';let nm=(hum?'P'+(k.pi+1)+' ':'')+k.f.name;
    if(c.measureText(nm).width>room){while(nm.length>2&&c.measureText(nm+'…').width>room)nm=nm.slice(0,-1);nm+='…';}
    c.fillStyle=hi?'#3b1d8f':'#ffffff';c.fillText(nm,nx,cy+1);
    if(k.fin){const fx=x+w-15,fy=cy-5,q=3.4;for(let i=0;i<3;i++)for(let j=0;j<3;j++){c.fillStyle=(i+j)%2?'#111':'#fff';c.fillRect(fx+i*q,fy+j*q,q,q);}}}
  c.restore();}
// ================= speedo =================
const MPH=.11,SPD_MAX=140; // game speed units -> mph on the dial; dial runs 0-140 mph
function speedoTick(dt){const P=G.player;const v=G.state==='count'?0:Math.abs(P.speed)*MPH;
  if(G.spdN===undefined){G.spdN=0;G.spdV=0;G.spdD=0;}
  // springy needle: chases your real speed with a touch of overshoot, so you can watch it sweep up
  G.spdV+=((v-G.spdN)*60-G.spdV*11)*dt;G.spdN+=G.spdV*dt;if(G.spdN<0){G.spdN=0;G.spdV=0;}
  G.spdD+=(v-G.spdD)*Math.min(1,dt*8);}
function speedoCol(u){const h=u<.45?130-80*(u/.45):u<.72?50-25*((u-.45)/.27):25-45*((u-.72)/.28);return `hsl(${(h+360)%360},95%,${u<.45?52:58}%)`}
function speedoBox(){const mn=Math.min(W,H),sm=mn<600,R=Math.round(clamp(mn*.13,46,76)),m=sm?14:22;
  let cx=W-R-6-m,cy=H-R-6-m;
  if(isTouch){const rightW=14+94+12+64+12,leftW=14+80*2+12+12;
    if(W-rightW-leftW>=2*R+30+R*.74+12)cx=W-rightW-R-6;   // room beside the buttons (landscape)
    else cy=H-(14+94+20)-R-6;}                     // otherwise sit on top of them (portrait)
  return {R,cx,cy,sm,m}}
function drawSpeedo(c){const P=G.player,{R,cx,cy,sm,m}=speedoBox();
  const a0=Math.PI*5/6,sw=Math.PI*4/3,mph=G.spdN||0,fr=clamp(mph/SPD_MAX,0,1),boost=P.boost>0||P.star>0,t=G.t;
  c.save();
  // chunky body with a white rim (glows hot when boosting)
  c.fillStyle='rgba(20,6,60,.28)';circ(c,cx,cy+6,R+7);
  const bg=c.createRadialGradient(cx,cy-R*.45,R*.1,cx,cy,R+7);bg.addColorStop(0,'#6f42f2');bg.addColorStop(1,'#2a1170');c.fillStyle=bg;circ(c,cx,cy,R+6);
  if(boost){c.strokeStyle=`hsla(${32+Math.sin(t*30)*14},100%,58%,.55)`;c.lineWidth=12;c.beginPath();c.arc(cx,cy,R+8,0,TAU);c.stroke();}
  c.lineWidth=4;c.strokeStyle=boost?'#ffd23f':'#fff';c.beginPath();c.arc(cx,cy,R+6,0,TAU);c.stroke();
  c.fillStyle='rgba(255,255,255,.13)';c.beginPath();c.ellipse(cx,cy-R*.52,R*.62,R*.26,0,0,TAU);c.fill();
  // speed arc: empty track, then green -> yellow -> orange -> hot pink as you speed up
  const ar=R*.8,aw=R*.2;c.lineCap='round';c.lineWidth=aw;c.strokeStyle='rgba(255,255,255,.16)';c.beginPath();c.arc(cx,cy,ar,a0,a0+sw);c.stroke();
  if(fr>.002){c.lineCap='butt';const N=40;for(let i=0;i<N;i++){const u0=i/N;if(u0>=fr)break;const u1=Math.min(fr,(i+1)/N);c.strokeStyle=speedoCol(u0);c.beginPath();c.arc(cx,cy,ar,a0+sw*u0,a0+sw*u1+(u1<fr?.012:0));c.stroke();}
    c.fillStyle=speedoCol(0);circ(c,cx+Math.cos(a0)*ar,cy+Math.sin(a0)*ar,aw/2);
    const ae=a0+sw*fr;c.fillStyle=speedoCol(fr);circ(c,cx+Math.cos(ae)*ar,cy+Math.sin(ae)*ar,aw/2);}
  // ticks every 10 mph, longer every 20, pink in the 100+ zone
  c.lineCap='round';for(let v=0;v<=SPD_MAX;v+=10){const a=a0+sw*v/SPD_MAX,maj=v%20===0,r1=R*.64,r0=maj?R*.5:R*.56;
    c.strokeStyle=v>=120?'#ff7aa8':'rgba(255,255,255,.85)';c.lineWidth=maj?3:2;c.beginPath();c.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);c.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);c.stroke();}
  // needle (pegs and shakes if you go off the scale)
  const na=a0+sw*Math.min(mph/SPD_MAX,1.03)+(mph>SPD_MAX?Math.sin(t*45)*.03:0)+(ENG.rpm>.95?Math.sin(t*70)*.008:0);
  c.save();c.translate(cx,cy);c.rotate(na);c.fillStyle='rgba(20,6,60,.35)';c.beginPath();c.moveTo(-R*.14,-R*.06+3);c.lineTo(R*.74,3);c.lineTo(-R*.14,R*.06+3);c.closePath();c.fill();
  c.fillStyle='#ff3d78';c.strokeStyle='#fff';c.lineWidth=2;c.lineJoin='round';c.beginPath();c.moveTo(-R*.14,-R*.065);c.lineTo(R*.72,-R*.02);c.lineTo(R*.76,0);c.lineTo(R*.72,R*.02);c.lineTo(-R*.14,R*.065);c.closePath();c.fill();c.stroke();c.restore();
  c.fillStyle='#fff';circ(c,cx,cy,R*.13);c.fillStyle='#ff3d78';circ(c,cx,cy,R*.075);c.fillStyle='rgba(255,255,255,.7)';circ(c,cx-R*.03,cy-R*.03,R*.025);
  // big digital read-out in the gap at the bottom of the dial
  const sp=Math.round(G.spdD||0);outlined(c,String(sp),cx,cy+R*.66,Math.round(R*.42),boost?'#ffd23f':sp>=120?'#ff8ab4':'#fff','center');
  c.font='700 '+Math.round(R*.15)+'px '+BFONT;c.textAlign='center';c.fillStyle='rgba(255,255,255,.8)';c.fillText('MPH',cx,cy+R*.88);
  if(boost){const s2=1+Math.sin(t*16)*.06;c.save();c.translate(cx,cy-R-16);c.scale(s2,s2);outlined(c,'BOOST!',0,0,sm?18:22,'#ffb627','center');c.restore();}
  // gear badge beside the dial: GEAR label, big gear number (N on the start line) and 3 pips; it pops gold on every shift
  {const bw=Math.round(R*.74),bh=Math.round(R*.98),bx=cx-R-6-12-bw,by=cy+R+6-bh,gc=G.gear===undefined||G.gear<0?-1:G.gear,pop=G.gearPop>0?G.gearPop/.35:0,s3=1+Math.sin(pop*Math.PI)*.3;
   c.save();c.translate(bx+bw/2,by+bh/2);c.scale(s3,s3);c.translate(-bw/2,-bh/2);
   c.fillStyle='rgba(20,6,60,.28)';rr(c,0,5,bw,bh,bw*.36);c.fill();
   const gg=c.createLinearGradient(0,0,0,bh);gg.addColorStop(0,pop>0?'#ffe98a':'#6f42f2');gg.addColorStop(1,pop>0?'#ff9d1f':'#2a1170');c.fillStyle=gg;rr(c,0,0,bw,bh,bw*.36);c.fill();
   c.lineWidth=4;c.strokeStyle=pop>0?'#fff6c8':'#fff';rr(c,0,0,bw,bh,bw*.36);c.stroke();
   c.font='700 '+Math.max(8,Math.round(Math.min(R*.15,bw*.23)))+'px '+BFONT;c.textAlign='center';c.fillStyle='rgba(255,255,255,.85)';c.fillText('GEAR',bw/2,bh*.21);
   outlined(c,gc<0?'N':String(gc+1),bw/2,bh*.66,Math.round(R*.46),gc<0?'#c9b8ff':'#fff','center');
   for(let i=0;i<3;i++){const px=bw/2+(i-1)*bw*.24,py=bh*.84;c.fillStyle=i<=gc?['#5cf07a','#ffd23f','#ff3d78'][i]:'rgba(255,255,255,.22)';circ(c,px,py,Math.max(2.5,R*.05));}
   c.restore();}
  c.restore();}
function drawHUD(c){
  const P=G.player,t=G.t,top=10,sm=W<600;
  // place
  const pc=P.place===1?'#ffd23f':P.place===2?'#e6ecf5':P.place===3?'#ff9d5c':'#ffffff';
  const ps=sm?54:80;outlined(c,ORD(P.place).replace(/\D+$/,''),16,top+ps*.9,ps,pc);
  const nw=(c.measureText(String(P.place)).width);outlined(c,ORD(P.place).replace(/^\d+/,''),16+nw+4,top+ps*.45,ps*.4,pc);
  outlined(c,'LAP '+Math.min(P.lap,G.laps)+'/'+G.laps,16,top+ps+(sm?22:30),sm?20:28,'#fff');
  const two=G.players.length>1,KN=two&&P.pi?'ENTER':'SPACE';
  if(two)outlined(c,'P'+(P.pi+1)+' · '+P.f.name,16,top+ps+(sm?48:64),sm?18:24,P.pi?'#ff8ad8':'#ffe14d');
  // time (on narrow screens it goes on the left, under the lap counter, so the item box doesn't cover it)
  const bs=sm?64:84,bx=W/2-bs/2,by=top;let leftY=top+ps+(two?(sm?60:76):(sm?36:44));
  {const ts=sm?20:28;c.font=ts+'px '+FONT;const tw=c.measureText(fmtT(G.raceT)).width;
   if(W-122-tw<W/2+bs/2+6){outlined(c,fmtT(G.raceT),16,leftY+ts*.4,ts,'#fff');leftY+=ts+8;}else outlined(c,fmtT(G.raceT),W-122,top+(sm?28:34),ts,'#fff','right');}
  // item slot
  {const g=c.createLinearGradient(0,by,0,by+bs);g.addColorStop(0,'#ff8ad8');g.addColorStop(1,'#8f5cff');c.fillStyle='#3b1d8f';rr(c,bx-3,by+2,bs+6,bs+6,24);c.fill();c.fillStyle=g;rr(c,bx,by,bs,bs,22);c.fill();c.fillStyle='rgba(255,255,255,.3)';rr(c,bx+6,by+5,bs-12,bs*.3,12);c.fill();c.strokeStyle='#fff';c.lineWidth=4;rr(c,bx,by,bs,bs,22);c.stroke();}
  const ik=P.tongueT>0?'tongue':P.roul>0?Object.keys(ITEMS)[Math.floor(t*14)%Object.keys(ITEMS).length]:P.item;
  if(ik){drawItemIcon(c,ik,W/2,by+bs/2,bs*.72,t);}
  if(P.tongueT>0){c.strokeStyle='#ff3d78';c.lineWidth=6;c.lineCap='round';c.beginPath();c.arc(W/2,by+bs/2,bs*.58,-Math.PI/2,-Math.PI/2+TAU*P.tongueT/8);c.stroke();
    const lbl=P.lock?(P.tongueCD>0?'Reloading...':(isTouch?'TAP ITEM: YANK!':KN+': YANK!')):'No frog ahead';c.font='600 14px '+BFONT;c.textAlign='center';c.lineWidth=4;c.strokeStyle='#3b1d8f';c.strokeText(lbl,W/2,by+bs+20);c.fillStyle=P.lock?'#ff8ad8':'#ffffff';c.fillText(lbl,W/2,by+bs+20);}
  else if(P.item&&!isTouch){c.font='13px '+BFONT;c.fillStyle='rgba(255,255,255,.85)';c.textAlign='center';c.fillText(KN,W/2,by+bs+16)}
  // leaderboard in the top right: every racer from first to last, sliding up and down as places change
  const sb=speedoBox(),floor=Math.min(sb.cy-sb.R-36,isTouch?H-120:1e9),n=G.karts.length,lbW=sm?150:196,lbX=W-lbW-14,lbY=lbX-8<W/2+bs/2+6?by+bs+26:top+(sm?40:50);   // narrow screens: below the item box
  const rowH=Math.max(14,Math.min(sm?19:25,(floor-lbY-14)/n)),lbH=n*rowH+6;drawLeaderboard(c,lbX,lbY,lbW,rowH,P,two);
  // minimap under the leaderboard, or on the left under the lap counter if there's no room
  let ms=sm?110:150,mx=W-ms-14,my=lbY+lbH+22;
  if(my+ms+8>floor){mx=22;my=leftY+14;ms=Math.min(ms,(isTouch?H-14-80-24:H-16)-my-8);}
  if(ms>=64){
  const T=G.T,bb=T.bb,sc=ms/Math.max(bb.maxX-bb.minX,bb.maxY-bb.minY);
  const ox=mx+(ms-(bb.maxX-bb.minX)*sc)/2-bb.minX*sc,oy=my+(ms-(bb.maxY-bb.minY)*sc)/2-bb.minY*sc;
  c.fillStyle='rgba(59,29,143,.55)';rr(c,mx-8,my-8,ms+16,ms+16,22);c.fill();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;c.stroke();
  c.save();c.translate(ox,oy);c.scale(sc,sc);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=T.w*.6;c.lineJoin='round';c.stroke(T.path);c.restore();
  const rk=k=>k===P?2:k.isP?1:0;for(const k of [...G.karts].sort((a,b)=>rk(a)-rk(b))){c.fillStyle=k.f.kart;c.strokeStyle=k.isP&&two?(k.pi?'#ff5fa2':'#ffd23f'):'#3b1d8f';c.lineWidth=k.isP&&two?3:2;c.beginPath();c.arc(ox+k.x*sc,oy+k.y*sc,k===P?7:k.isP?6:4.5,0,TAU);c.fill();c.stroke();}}
  drawSpeedo(c);
  // countdown lights
  if(G.cd>-0.8){const n=Math.ceil(G.cd-1.2),go=G.cd<=1.2;const cx=W/2,cy=H*.3,r=sm?22:30,pw=r*7.4;
    c.fillStyle='#3b1d8f';rr(c,cx-pw/2,cy-r-12,pw,r*2+24,r+12);c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.stroke();
    for(let i=0;i<3;i++){const on=go||(n>0&&n<=3-i);const lit=go?'#5cf07a':on?'#ff4f6d':'#5a3fb0';c.fillStyle=lit;circ(c,cx-r*2.4+i*r*2.4,cy,r);if(on){c.fillStyle='rgba(255,255,255,.4)';circ(c,cx-r*2.4+i*r*2.4-r*.3,cy-r*.3,r*.3)}}
    if(go)outlined(c,'GO!',cx,cy+r*4.2,sm?72:110,'#5cf07a','center');
    else if(n>=1&&n<=3)outlined(c,String(n),cx,cy+r*4.2,sm?64:96,'#fff','center');
    else outlined(c,'Get ready!',cx,cy+r*3.6,sm?34:48,'#ffd23f','center');
    // two players: remind each player of their keys while the lights count down
    if(two&&!isTouch&&!go){const pad=padsFor(P).length;outlined(c,pad?'Your controller: stick to steer':P.pi?'◀ ▶ steer · ▼ brake · ENTER item':'A D steer · S brake · SPACE item',cx,cy+r*7.2,sm?16:22,P.pi?'#ff8ad8':'#ffe14d','center');}}
  if(G.banner){const a=Math.min(1,G.banner.t);c.globalAlpha=a;outlined(c,G.banner.s,W/2,H*.32,sm?48:72,G.banner.s==='FINAL LAP!'?'#ff5a4e':'#ffd23f','center');c.globalAlpha=1}
  if(P.wrong>1&&Math.floor(t*3)%2)outlined(c,'WRONG WAY!',W/2,H*.45,sm?40:60,'#ff5a4e','center');
  {const lt=Math.max(P.lostT||0,P._stuck||0);if(lt>1.2&&lt<3&&G.state==='race'&&!P.fin)outlined(c,'Back on track in '+Math.ceil(3-lt)+'...',W/2,H*.45+(sm?40:56),sm?22:30,'#7ef3ff','center');}
  if(two&&!P.fin&&G.waitT>0&&G.state==='race')outlined(c,'Hurry! '+Math.ceil(G.waitT),W/2,H*.42,sm?40:56,'#ff8ad8','center');
  if(P.fin){const s=P.place;outlined(c,ORD(s)+' place!',W/2,H*.42,sm?56:88,s<=3?'#ffd23f':'#fff','center');
    if(two&&G.state!=='done')outlined(c,'Waiting for Player '+(2-P.pi)+'...',W/2,H*.42+(sm?44:64),sm?20:28,'#fff','center');
    // checkered flags
    for(let f=0;f<2;f++){const fx=f?W/2+(sm?150:260):W/2-(sm?150:260)-60,fy=H*.42-80;c.fillStyle='#ddd';c.fillRect(fx+(f?0:60),fy,5,100);for(let i=0;i<6;i++)for(let j=0;j<4;j++){c.fillStyle=(i+j)%2?'#111':'#fff';const wv=Math.sin(t*6+i*.7)*4;c.fillRect(fx+(f?5:0)+i*10,fy+j*10+wv,10,10)}}
  }
}

// ================= loop =================
let last=performance.now();
function loop(now){
  const dt=Math.min(1/30,(now-last)/1000);last=now;pollPads();
  if(G&&!G.paused&&!G.over){update(dt);}
  if(G&&!G.over)render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&!G.over&&!G.paused&&G.state!=='done')togglePause()});

// ================= screens =================
const screens=['sTitle','sFrog','sTrack','sPause','sResult'];
function show(id){if(id==='sFrog')setTimeout(faceLoop,0);screens.forEach(s=>$('#'+s).hidden=s!==id);const racing=!id,two=opts.players===2;$('#hudBtns').hidden=!racing;$('#touch').hidden=!(racing&&isTouch);$('#touch2').hidden=!(racing&&isTouch&&two);$('#tG').hidden=$('#tG2').hidden=opts.autoGas;touchLayout();}
// tablet split screen: each player gets their own set of buttons on their half of the screen
function touchLayout(){const t1=$('#touch').style,t2=$('#touch2').style;if(opts.players!==2){t1.left=t1.right=t1.bottom='';return}
  if(innerWidth>=innerHeight*.9){t1.left='0';t1.right='50%';t1.bottom='0';t2.left='50%';t2.right='0';t2.bottom='0';}else{t1.left=t1.right='0';t1.bottom='50%';t2.left=t2.right='0';t2.bottom='0';}}
addEventListener('resize',touchLayout);
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{beep(500,.06);show(b.dataset.go)}));
let PICK=1;   // which player is choosing a frog
$('#bPlay').onclick=()=>{opts.players=1;saveOpts();PICK=1;frogPickUI();audio();playSong('menu');beep(660,.1);show('sFrog')};
$('#bPlay2').onclick=()=>{opts.players=2;saveOpts();PICK=1;frogPickUI();audio();playSong('menu');beep(660,.1);beep(880,.1);show('sFrog')};
$('#bToTracks').onclick=()=>{beep(660,.1);if(opts.players===2&&PICK===1){PICK=2;if(opts.frog2==null||opts.frog2===opts.frog)opts.frog2=(opts.frog+1)%FROGS.length;saveOpts();frogPickUI();scrollTo&&scrollTo(0,0);return}show('sTrack')};
$('#bFrogBack').onclick=()=>{beep(500,.06);if(opts.players===2&&PICK===2){PICK=1;frogPickUI();return}show('sTitle')};
function frogPickUI(){const two=opts.players===2;$('#frogTitle').textContent=two?`Player ${PICK}: pick your frog`:'Pick your frog';
  $('#bToTracks').textContent=two&&PICK===1?'Next: Player 2 picks':'Next: pick a track';document.body.classList.toggle('two',two);
  frogGrid.querySelectorAll('.card').forEach((x,j)=>{x.classList.toggle('sel',j===opts.frog);x.classList.toggle('sel2',two&&j===opts.frog2&&j!==opts.frog);x.classList.toggle('taken',two&&PICK===2&&j===opts.frog);
    let pb=x.querySelector('.pb');const lab=two?(j===opts.frog?'P1':j===opts.frog2?'P2':''):'';
    if(lab){if(!pb){pb=document.createElement('span');pb.className='pb';x.append(pb)}pb.textContent=lab;pb.dataset.p=lab}else if(pb)pb.remove();});}
function startRace(){audio();stopSong();if(document.activeElement)document.activeElement.blur();if(G)G.over=true;engineStopAll();show(null);newRace();}
function togglePause(){if(!G||G.over||G.state==='done')return;G.paused=!G.paused;setDuck(G.paused?.35:1);if(G.paused){engineMuteAll();show('sPause');$('#hudBtns').hidden=true}else show(null)}
$('#bPause').onclick=togglePause;$('#bResume').onclick=togglePause;
$('#bRestart').onclick=()=>{startRace()};
$('#bQuit').onclick=()=>{G.over=true;engineStopAll();setDuck(1);playSong('menu');show('sTrack')};
$('#bAgain').onclick=startRace;
$('#bNext').onclick=()=>{opts.track=(opts.track+1)%TRACKS.length;opts.level=TRACKS[opts.track].lvl;saveOpts();renderTrackSel();startRace()};
$('#bMenu').onclick=()=>{playSong('menu');show('sTrack')};
function seg(id,key,conv=Number){const el=$(id);el.querySelectorAll('button').forEach(b=>{const v=conv(b.dataset.v);b.classList.toggle('on',v===(key==='sound'?sound:opts[key]));b.onclick=()=>{if(key==='sound'){sound=v;if(v)audio()}else if(key==='music'){setMusic(v);return}else opts[key]=v;saveOpts();el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));beep(520,.05)}})}
seg('#oLaps','laps');seg('#oDiff','diff');seg('#oGas','autoGas',v=>v==='1');seg('#oSnd','sound',v=>v==='1');seg('#oRev','revStyle',v=>v);document.querySelectorAll('#oRev button').forEach(b=>b.addEventListener('click',()=>{opts.revPicked=true;saveOpts();setTimeout(previewRev,60)}));seg('#oMus','music',v=>v==='1');
function setMusic(v){opts.music=v;MUS.on=v;saveOpts();audio();if(v){if(G&&!G.over){if(G.state!=='count')playSong('race')}else playSong('menu')}musLevel();
  document.querySelectorAll('#oMus button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===v));const m=$('#bMus'),t=$('#bMusT');if(m)m.textContent=v?'♪':'♪̸';if(m)m.classList.toggle('off',!v);if(t)t.textContent='Music: '+(v?'On':'Off');beep(520,.05)}
$('#bMus').onclick=()=>setMusic(!opts.music);$('#bMusT').onclick=()=>setMusic(!opts.music);
$('#bMus').classList.toggle('off',!opts.music);$('#bMusT').textContent='Music: '+(opts.music?'On':'Off');
// start the menu tune on the first tap or key press anywhere
const firstGesture=()=>{audio();if(!G||G.over)playSong('menu');removeEventListener('pointerdown',firstGesture);removeEventListener('keydown',firstGesture)};
addEventListener('pointerdown',firstGesture);addEventListener('keydown',firstGesture);

try{if(init3D())makeThumbs();}catch(e){GL3.ok=false;console.warn('3D unavailable',e)}
// frog cards
function frogCanvas(fi,size,rot=-Math.PI/2,bg){
  if(THUMBS[fi]){const cv=document.createElement('canvas');cv.width=cv.height=size*2;cv.getContext('2d').drawImage(THUMBS[fi],0,0,size*2,size*2);return cv}const cvs=document.createElement('canvas');cvs.width=cvs.height=size*2;const c=cvs.getContext('2d');c.scale(2,2);
  if(bg){c.fillStyle=bg;c.fillRect(0,0,size,size)}c.translate(size/2,size/2);c.scale(size/62,size/62);c.rotate(rot);drawFrogKart(c,FROGS[fi],{t:.3});return cvs}
const frogGrid=$('#frogGrid');
const DANCES=['shake','twerk','tummy','hop','dab','robot','silly','moonwalk'];  // Zippy shimmies, Lulu twerks, Bonk rubs his tummy, Pip hops with her hat spinning, Mango dabs, Douglas does the robot, Fern pulls a silly face, Rocket moonwalks
FROGS.forEach((f,i)=>{const b=document.createElement('button');b.className='card';b.type='button';b.dataset.dance=DANCES[i%DANCES.length];
  const cv=frogCanvas(i,120,-Math.PI/2,null);cv.style.background=`radial-gradient(circle at 50% 55%, ${f.skin}66, ${f.kart}22 70%, #f3eeff)`;
  b.append(cv);b.insertAdjacentHTML('beforeend',`<span class="notes" aria-hidden="true"><i>♪</i><i>♫</i><i>♪</i></span><div class="nm">${f.name}</div><div class="quote">${f.line}</div>
  <div class="stat">Speed<span class="bar"><i style="width:${f.spd*20}%"></i></span></div>
  <div class="stat">Get-go<span class="bar"><i style="width:${f.acl*20}%"></i></span></div>
  <div class="stat">Turning<span class="bar"><i style="width:${f.hnd*20}%"></i></span></div>`);
  b.onclick=()=>{if(opts.players===2&&PICK===2){if(i===opts.frog){beep(180,.12,'square',.05);return}opts.frog2=i;}else{opts.frog=i;if(opts.frog2===i)opts.frog2=null;}saveOpts();frogPickUI();frogVoice(i);b.classList.remove('boing');void b.offsetWidth;b.classList.add('boing');clearTimeout(b._bt);b._bt=setTimeout(()=>b.classList.remove('boing'),600);};
  b.ondblclick=()=>$('#bToTracks').click();
  if(i===opts.frog)b.classList.add('sel');frogGrid.append(b)});
frogPickUI();

// track cards
const trackGrid=$('#trackGrid');
function trackPreview(i,w,h){const T=getTrack(i),th=T.th;const cvs=document.createElement('canvas');cvs.width=w*2;cvs.height=h*2;const c=cvs.getContext('2d');c.scale(2,2);
  c.fillStyle='#2ab0dc';c.fillRect(0,0,w,h);const bb=T.bb,pad=22,sc=Math.min((w-pad*2)/(bb.maxX-bb.minX),(h-pad*2)/(bb.maxY-bb.minY));
  c.save();c.translate(w/2-(bb.minX+bb.maxX)/2*sc,h/2-(bb.minY+bb.maxY)/2*sc);c.scale(sc,sc);
  T.decos.forEach((d,j)=>{if(BIG[d.type]?j%3===0:j%4===0)drawDeco(c,{...d,s:d.s*1.3},0)});
  c.lineJoin='round';c.strokeStyle='#4cc75c';c.lineWidth=T.w+180;c.stroke(T.path);c.strokeStyle='#7fe0f7';c.lineWidth=T.w;c.stroke(T.path);c.setLineDash([30,300]);c.strokeStyle='#ff9d2e';c.lineWidth=T.w+90;c.stroke(T.path);c.setLineDash([]);
  for(const bm of T.bumpers){c.fillStyle='#ff4f6d';circ(c,bm.x,bm.y,60);}for(const sp of T.spinners){c.fillStyle='#ffffff';circ(c,sp.x,sp.y,95);c.fillStyle='#2f9bd6';circ(c,sp.x,sp.y,45);}
  const p=T.pts[0];c.translate(p.x,p.y);c.rotate(p.a);c.fillStyle='#fff';c.fillRect(-25,-T.w/2-40,50,T.w+80);c.fillStyle='#111';for(let k=0;k<8;k++)c.fillRect(k%2?-25:0,-T.w/2-40+k*(T.w+80)/8,25,(T.w+80)/8);
  c.restore();return cvs}
const done=JSON.parse(store('rr-best')||'{}');
const LEVELS=[{n:'Level 1',t:'Hop',d:'Gentle bends on open water, with a few buzzing insects.',c:'#5cf07a'},
  {n:'Level 2',t:'Leap',d:'Sharp turns, more insects and a garden sprinkler to dodge.',c:'#ffb627'},
  {n:'Level 3',t:'Mega Leap',d:'Hairpins, swarms of insects, two sprinklers, and super-fast rivals!',c:'#ff4f6d'},
  {n:'Level 4',t:'Sky High',d:'Rolling waves, boost pads and endless S-bends. Surf down, push up and hang on!',c:'#b46bff'}];
if(!opts.level)opts.level=TRACKS[opts.track]?TRACKS[opts.track].lvl:1;
function levelStars(i){const lv=TRACKS[i].lvl;const ids=TRACKS.map((d,j)=>j).filter(j=>TRACKS[j].lvl===lv).sort((a,b)=>getTrack(a).wiggle-getTrack(b).wiggle);const r=ids.indexOf(i)/ids.length;return r<1/3?1:r<2/3?2:3}
function renderTrackSel(){
  const tabs=$('#levelTabs');tabs.innerHTML='';LEVELS.forEach((L,li)=>{const b=document.createElement('button');b.type='button';b.className='lvl'+(opts.level===li+1?' on':'');b.style.setProperty('--lc',L.c);
    const cnt=TRACKS.filter((d,j)=>d.lvl===li+1&&done[j]===1).length,tot=TRACKS.filter(d=>d.lvl===li+1).length;
    b.innerHTML=`<span class="ln">${L.n}</span><span class="lt">${L.t}</span><span class="lw">🏆 ${cnt}/${tot}</span>`;b.onclick=()=>{opts.level=li+1;saveOpts();beep(600+li*120,.08);renderTrackSel()};tabs.append(b)});
  $('#levelDesc').textContent=LEVELS[opts.level-1].d;
  // tracks not built yet? build them one at a time between frames (never in one big freeze), then show the cards
  const need=TRACKS.map((d,i)=>i).filter(i=>TRACKS[i].lvl===opts.level&&!trackCache[i]);
  if(need.length){const lv=opts.level;trackGrid.innerHTML='<p class="tag" style="grid-column:1/-1;text-align:center;padding:40px 0">Filling up the ponds...</p>';
    const step=()=>{if(opts.level!==lv||$('#levelTabs').dataset.lv!==String(lv))return;const i=need.shift();if(i!==undefined&&!trackCache[i])getTrack(i);if(need.length)setTimeout(step,0);else renderTrackSel();};
    $('#levelTabs').dataset.lv=String(lv);setTimeout(step,0);return;}
  $('#levelTabs').dataset.lv=String(opts.level);
  trackGrid.innerHTML='';let num=0;
  TRACKS.forEach((d,i)=>{if(d.lvl!==opts.level)return;num++;const T=getTrack(i);const st=levelStars(i);const b=document.createElement('button');b.className='card'+(i===opts.track?' sel':'');b.type='button';
  b.append(trackPreview(i,220,140));const best=done[i];
  b.insertAdjacentHTML('beforeend',`<div class="sub"><span class="num">${opts.level}-${String(num).padStart(2,'0')} · ${T.th.lab}</span><span class="stars" style="color:${LEVELS[opts.level-1].c}">${'★'.repeat(st)}<span style="opacity:.25">${'★'.repeat(3-st)}</span></span></div><div class="nm">${d.n}${d.isNew?' <span class="new">NEW</span>':''}</div><div class="sub"><span>${best?'Best: '+ORD(best)+' place':'Not raced yet'}</span>${best===1?'<span>🏆</span>':''}</div>`);
  b.onclick=()=>{opts.track=i;saveOpts();startRace()};trackGrid.append(b)});}

// item list
for(const k in ITEMS){const d=document.createElement('div');const cvs=document.createElement('canvas');cvs.width=cvs.height=88;const c=cvs.getContext('2d');c.scale(2,2);drawItemIcon(c,k,22,22,38,.4);d.append(cvs);d.insertAdjacentHTML('beforeend',`<span><b>${ITEMS[k].name}</b>${ITEMS[k].desc}</span>`);$('#itemList').append(d)}

// hero animation
const hero=$('#hero'),hc=hero.getContext('2d');
function heroLoop(t){if(!$('#sTitle').hidden){t/=1000;hc.setTransform(1,0,0,1,0,0);hc.clearRect(0,0,1120,300);
  hc.fillStyle='#2ab0dc';rr(hc,0,90,1120,150,20);hc.fill();hc.strokeStyle='rgba(255,255,255,.35)';hc.lineWidth=3;for(let i=0;i<6;i++){const x=((i*210-t*300)%1260+1260)%1260-70;hc.beginPath();hc.moveTo(x,140+i%2*40);hc.quadraticCurveTo(x+20,132+i%2*40,x+40,140+i%2*40);hc.stroke();}
  for(let i=0;i<20;i++){const x=((i*60-t*300)%1200+1200)%1200-60;for(const y of [88,242]){hc.fillStyle=i%3?'#5fd36a':'#47bf57';hc.beginPath();hc.moveTo(x,y);hc.arc(x,y,24,.5+i,TAU-.1+i);hc.closePath();hc.fill();if(i%5===0){hc.fillStyle='#ffb3dd';hc.beginPath();hc.arc(x+4,y-3,7,0,TAU);hc.fill();}}}
  FROGS.forEach((f,i)=>{const lane=i%2;const x=((i*150+t*(120+i*12))%1400)-140;const y=130+lane*70+Math.sin(t*3+i)*4;if(THUMBS[i]){const sz=130;hc.drawImage(THUMBS[i],x-sz/2,y-sz*.62,sz,sz);}else{hc.save();hc.translate(x,y);hc.scale(1.6,1.6);drawFrogKart(hc,f,{t});hc.restore();}});}
  requestAnimationFrame(heroLoop)}
requestAnimationFrame(heroLoop);

// results
function showResults(){
  if(G.over)return;G.over=true;engineStopAll();stopSong();setDuck(1);setTimeout(()=>{if(G.over&&!$('#sResult').hidden)playSong('menu')},2800);
  const K=[...G.karts];
  // estimate unfinished
  const fin=K.filter(k=>k.fin).sort((a,b)=>a.ft-b.ft);const rest=K.filter(k=>!k.fin).sort((a,b)=>b.prog-a.prog);
  const avg=G.raceT/Math.max(1,...K.map(k=>k.prog));
  rest.forEach(k=>{k.ft=G.raceT+Math.max(1,(G.laps*TN-k.prog))*avg*1.05});
  const order=[...fin,...rest];const two=G.players.length>1,pl=G.players.map(p=>order.indexOf(p)+1),me=Math.min(...pl);
  const prev=done[opts.track];if(!prev||me<prev){done[opts.track]=me;store('rr-best',JSON.stringify(done));renderTrackSel();}
  if(two){const w=pl[0]<pl[1]?0:1;$('#rTitle').textContent=me===1?`Player ${w+1} wins!`:`Player ${w+1} beat Player ${2-w}!`;
    $('#rSub').textContent=`${TRACKS[opts.track].n} · P1 ${G.players[0].f.name}: ${ORD(pl[0])} (${fmtT(G.players[0].ft)}) · P2 ${G.players[1].f.name}: ${ORD(pl[1])} (${fmtT(G.players[1].ft)})`;}
  else{$('#rTitle').textContent=me===1?'You won!':me<=3?ORD(me)+' place. Great racing!':ORD(me)+' place. Hop to it next time!';
    $('#rSub').textContent=`Level ${TRACKS[opts.track].lvl} · ${TRACKS[opts.track].n} · ${G.laps} laps · your time ${fmtT(G.player.ft)}`;}
  const pod=$('#podium');pod.innerHTML='';
  [1,0,2].forEach(i=>{const k=order[i];const d=document.createElement('div');d.className='pod';d.append(frogCanvas(k.fi,110,-Math.PI/2));
    d.insertAdjacentHTML('beforeend',`<div class="display" style="font-size:1.2rem">${k.f.name}</div><div class="blk" style="height:${[110,80,60][i]}px;background:${['#ffe14d','#e6ecff','#ffab73'][i]}">${i+1}</div>`);pod.append(d)});
  const ol=$('#standings');ol.innerHTML='';order.forEach((k,i)=>{const li=document.createElement('li');if(k.isP)li.className='me';li.innerHTML=`<span class="p">${ORD(i+1)}</span><span>${k.f.name}${k.isP?(two?` (P${k.pi+1})`:' (you)'):''}<small>${k.kos?` · knocked out ${k.kos}×`:''}</small></span><span>${fmtT(k.ft)}</span>`;ol.append(li)});
  $('#bNext').textContent=`Next: ${TRACKS[(opts.track+1)%TRACKS.length].n}`;
  show('sResult');confetti(me<=3);
}
function confetti(on){const cc=$('#confetti'),c=cc.getContext('2d');cc.width=innerWidth;cc.height=innerHeight;if(!on){c.clearRect(0,0,cc.width,cc.height);return}
  const ps=Array.from({length:160},()=>({x:Math.random()*cc.width,y:-Math.random()*cc.height,vy:120+Math.random()*180,vx:(Math.random()-.5)*60,r:Math.random()*TAU,c:['#ffd23f','#62d65a','#ff5a4e','#4fd0ef','#ff8cc6'][Math.random()*5|0]}));
  let lt=performance.now();const end=lt+5000;
  (function f(now){const dt=(now-lt)/1000;lt=now;c.clearRect(0,0,cc.width,cc.height);for(const p of ps){p.y+=p.vy*dt;p.x+=p.vx*dt;p.r+=dt*5;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-5,-3,10,6);c.restore()}if(now<end&&!$('#sResult').hidden)requestAnimationFrame(f);else c.clearRect(0,0,cc.width,cc.height)})(lt);}

renderTrackSel();
// quietly build every other track in the background while you're on the menus (one per idle moment, never during a race),
// so switching level tabs is instant and the music never stutters
const prebuildQ=TRACKS.map((d,i)=>i).sort((a,b)=>(TRACKS[a].lvl-TRACKS[b].lvl));
function prebuildTracks(){
  if(G&&!G.over){setTimeout(prebuildTracks,1500);return;}
  let i;while((i=prebuildQ.shift())!==undefined&&trackCache[i]);
  if(i!==undefined)getTrack(i);
  if(prebuildQ.length){if(window.requestIdleCallback)requestIdleCallback(prebuildTracks,{timeout:250});else setTimeout(prebuildTracks,40);}}
setTimeout(prebuildTracks,600);
show('sTitle');
