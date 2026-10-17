// ================= online races =================
// Players meet through a free public MQTT relay (over a secure WebSocket), so there's no game server to run.
// One player in each race is the "host": it picks the track, runs the computer frogs (bots) that fill the empty
// spots, and sends their positions to everyone. Every player drives their own jetski and sends its position about
// 12 times a second; other players' jetskis glide smoothly between those updates.
// When something hits a jetski, only the computer that owns that jetski decides what happens (so everyone agrees).
// Kid-safe by design: no chat and no typed names. Other players just appear as their frog.

const NET_TOPIC='ribbitrally/v1';
const NET_BROKERS=['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081/mqtt'];
const NET_MAX=8,NET_QUICK_WAIT=20,NET_SEND=1/12,NET_BOT_SEND=1/10;
const CODE_ABC='BCDFGHJKLMNPQRSTVWXZ';   // no vowels, so room codes never spell words

// ---------- a small MQTT 3.1.1 client (QoS 0 only) ----------
class MQ{
  constructor(){this.ws=null;this.buf=new Uint8Array(0);this.pid=1;this.onmsg=null;this.onclose=null;this.ok=false;this.ping=null;}
  static str(s){const b=new TextEncoder().encode(s);return [b.length>>8,b.length&255,...b]}
  static pkt(type,body){const len=[];let n=body.length;do{let d=n%128;n=Math.floor(n/128);if(n>0)d|=128;len.push(d)}while(n>0);return new Uint8Array([type,...len,...body])}
  connect(url,id,will){return new Promise((res,rej)=>{let ws;try{ws=new WebSocket(url,['mqtt'])}catch(e){rej(e);return}
    ws.binaryType='arraybuffer';this.ws=ws;let done=false;const fail=why=>{if(done)return;done=true;clearTimeout(to);try{ws.close()}catch(e){}rej(why)};
    const to=setTimeout(()=>fail('timeout'),6000);
    ws.onopen=()=>{const flags=0x02|(will?0x04:0);let body=[...MQ.str('MQTT'),4,flags,0,30,...MQ.str(id)];if(will)body=body.concat(MQ.str(will.topic),MQ.str(will.msg));ws.send(MQ.pkt(0x10,body))};
    this.onconnack=rc=>{if(done)return;done=true;clearTimeout(to);if(rc===0){this.ok=true;this.ping=setInterval(()=>this.raw(new Uint8Array([0xC0,0])),20000);res()}else{try{ws.close()}catch(e){}rej('refused '+rc)}};
    ws.onmessage=e=>{if(typeof e.data==='string')return;this.feed(new Uint8Array(e.data))};
    ws.onerror=()=>fail('error');
    ws.onclose=()=>{clearInterval(this.ping);const was=this.ok;this.ok=false;fail('closed');if(was&&this.onclose)this.onclose()};})}
  raw(b){try{if(this.ws&&this.ws.readyState===1)this.ws.send(b)}catch(e){}}
  feed(chunk){const b=new Uint8Array(this.buf.length+chunk.length);b.set(this.buf);b.set(chunk,this.buf.length);this.buf=b;
    for(;;){const B=this.buf;if(B.length<2)return;let mult=1,len=0,i=1,d;do{if(i>=B.length)return;d=B[i++];len+=(d&127)*mult;mult*=128}while(d&128&&i<5);
      if(B.length<i+len)return;const type=B[0],body=B.subarray(i,i+len);this.buf=B.slice(i+len);this.handle(type,body);}}
  handle(type,b){const t=type>>4;
    if(t===2){this.onconnack&&this.onconnack(b[1]);return}
    if(t===3){const qos=(type>>1)&3,tl=(b[0]<<8)|b[1];const topic=new TextDecoder().decode(b.subarray(2,2+tl));let p=2+tl;
      if(qos>0){const id=(b[p]<<8)|b[p+1];p+=2;if(qos===1)this.raw(new Uint8Array([0x40,2,id>>8,id&255]));}
      const msg=new TextDecoder().decode(b.subarray(p));if(this.onmsg)this.onmsg(topic,msg);return}}
  sub(topic){const id=this.pid++&65535||1;this.raw(MQ.pkt(0x82,[id>>8,id&255,...MQ.str(topic),0]))}
  unsub(topic){const id=this.pid++&65535||1;this.raw(MQ.pkt(0xA2,[id>>8,id&255,...MQ.str(topic)]))}
  pub(topic,msg){this.raw(MQ.pkt(0x30,[...MQ.str(topic),...new TextEncoder().encode(msg)]))}
  close(){clearInterval(this.ping);if(this.ok)this.raw(new Uint8Array([0xE0,0]));this.ok=false;try{this.ws&&this.ws.close()}catch(e){}}
}

// ---------- connection, rooms and lobby ----------
const NET={mq:null,id:'',url:'',state:'off',room:null,code:'',quick:false,host:false,hostId:'',ps:[],track:0,laps:3,left:0,seen:{},ads:{},frog:0,timer:null,last:{}};
function netBrokers(){let o=null;try{o=new URLSearchParams(location.search).get('mqtt')||localStorage.getItem('rr-mqtt')}catch(e){}return o?[o]:NET_BROKERS}
function netNewId(){let s='rr';for(let i=0;i<10;i++)s+='abcdefghijklmnopqrstuvwxyz0123456789'[Math.random()*36|0];return s}
async function netConnect(){if(NET.mq&&NET.mq.ok)return true;NET.id=netNewId();
  for(const url of netBrokers()){const mq=new MQ();try{await mq.connect(url,NET.id,{topic:NET_TOPIC+'/gone',msg:JSON.stringify({k:'bye',f:NET.id})});
      NET.mq=mq;NET.url=url;mq.onmsg=netOnMsg;mq.onclose=()=>netLost();mq.sub(NET_TOPIC+'/gone');return true}catch(e){}}
  return false}
function netSend(o){if(!NET.mq||!NET.room)return;o.f=NET.id;NET.mq.pub(NET_TOPIC+'/r/'+NET.room,JSON.stringify(o))}
function netJoinTopic(room){if(NET.room===room)return;if(NET.room)NET.mq.unsub(NET_TOPIC+'/r/'+NET.room);NET.room=room;NET.mq.sub(NET_TOPIC+'/r/'+room)}
function netLeave(silent){clearInterval(NET.timer);NET.timer=null;if(NET.mq){if(NET.room&&!silent)netSend({k:'bye'});NET.mq.close()}NET.mq=null;NET.room=null;NET.state='off';NET.host=false;NET.ps=[];NET.ads={};}
function netLost(){if(NET.state==='off')return;const racing=G&&G.net&&!G.over;netLeave(true);
  if(racing){G.net=2;for(const k of G.karts)if(k.remote)netTakeOver(k);netNote('Lost the internet connection: finishing the race with computer frogs');}
  else{onlineMsg("Lost the connection to the online races. Check your internet and try again.");show('sOnline');}}
function netNote(s){if(G)G.texts.push({x:G.player.x,y:G.player.y-70,s,c:'#ffffff',life:3,max:3});}

// --- the menus ---
function onlineMsg(s){$('#onMsg').textContent=s}
function onlineMenu(){NET.frog=opts.frog;const cv=$('#onFrog');if(cv&&THUMBS[opts.frog]){const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);c.drawImage(THUMBS[opts.frog],0,0,cv.width,cv.height)}
  $('#onFrogName').textContent=FROGS[opts.frog].name;show('sOnline')}
function lobbyUI(){const L=$('#lobGrid');if(!L)return;const q=NET.quick,ps=NET.ps;
  $('#lobTitle').textContent=NET.state==='search'?'Looking for a race...':q?'Quick Race':'Your room';
  $('#lobCode').hidden=q||!NET.code;$('#lobCode').innerHTML=`Room code <b>${NET.code}</b><span>Tell your friends to press Online, then type this code in</span>`;
  const bots=NET_MAX-ps.length;
  $('#lobMsg').textContent=NET.state==='search'?'Checking for other players online...':NET.state==='connecting'?'Connecting...':
    (q?`Starting in ${Math.max(0,Math.ceil(NET.left))} seconds. `:NET.host?'Press Start when everyone is in. ':'Waiting for the room maker to start. ')+(bots?`${bots} computer frog${bots>1?'s':''} will fill the empty spot${bots>1?'s':''}.`:'The race is full!');
  $('#lobTrack').textContent=NET.state==='lobby'?'Track: '+TRACKS[NET.track].n+' · '+NET.laps+' laps':'';
  $('#bLobStart').hidden=!(NET.host&&NET.state==='lobby');$('#bLobTrack').hidden=!(NET.host&&NET.state==='lobby');
  L.innerHTML='';for(let i=0;i<NET_MAX;i++){const p=ps[i],d=document.createElement('div');d.className='slot'+(p?'':' empty')+(p&&p[0]===NET.id?' me':'');
    if(p){d.append(frogCanvas(p[1],64,-Math.PI/2));d.insertAdjacentHTML('beforeend',`<span>${FROGS[p[1]].name}${p[0]===NET.id?' (you)':''}</span>`)}else d.innerHTML='<span>Computer frog</span>';L.append(d);}}
async function onlineStart(mode,code){audio();NET.quick=mode==='quick';NET.code='';NET.state='connecting';NET.ps=[];show('sLobby');lobbyUI();
  if(!await netConnect()){NET.state='off';onlineMsg("Couldn't reach the online races. Check your internet connection and try again. (Online races need the web version or the app.)");show('sOnline');return}
  if(mode==='quick')netQuickSearch();else if(mode==='make')netHostRoom('p-'+code,code);else netJoinRoom('p-'+code,code);}

// --- quick race: join an open race that isn't full, or start one ---
function netQuickSearch(){NET.state='search';NET.ads={};lobbyUI();NET.mq.sub(NET_TOPIC+'/open');
  clearTimeout(NET.searchT);NET.searchT=setTimeout(()=>{if(NET.state!=='search')return;const best=netBestAd();if(best)netJoinRoom(best.r,'');else netHostRoom('q-'+NET.id,'');},2600);}
function netBestAd(){const now=performance.now();let best=null;for(const r in NET.ads){const a=NET.ads[r];if(now-a.at>2500||a.n>=NET_MAX||a.left<4||r===NET.room)continue;if(!best||r<best.r)best=a;}return best}
function netHostRoom(room,code){netJoinTopic(room);NET.host=true;NET.wasHost=true;NET.hostId=NET.id;NET.code=code;NET.state='lobby';NET.ps=[[NET.id,NET.frog]];NET.seen={};
  NET.track=netPickTrack();NET.laps=NET.quick?3:opts.laps;NET.left=NET_QUICK_WAIT;lobbyUI();
  clearInterval(NET.timer);NET.timer=setInterval(netLobbyTick,500);}
function netPickTrack(){const pool=TRACKS.map((d,i)=>i).filter(i=>TRACKS[i].lvl<=(NET.quick?3:4));return pool[Math.random()*pool.length|0]}
function netJoinRoom(room,code){netJoinTopic(room);NET.host=false;NET.wasHost=false;NET.code=code;NET.state='join';NET.joinAt=performance.now();lobbyUI();
  netSend({k:'hi',fr:NET.frog});clearInterval(NET.timer);NET.timer=setInterval(netLobbyTick,500);}
function netLobbyTick(){const now=performance.now();
  if(NET.host&&NET.state==='lobby'){
    for(const p of NET.ps.slice(1))if(now-(NET.seen[p[0]]||now)>6000)NET.ps=NET.ps.filter(x=>x!==p);   // players who vanished
    if(NET.quick){NET.left-=.5;NET.mq.pub(NET_TOPIC+'/open',JSON.stringify({k:'ad',f:NET.id,r:NET.room,n:NET.ps.length,left:NET.left,v:1}));
      // two people started a quick race at the same moment: the race with the smaller name wins and the other joins it
      if(NET.ps.length===1){const b=netBestAd();if(b&&b.r<NET.room){netLeaveRoomQuiet();netJoinRoom(b.r,'');return}}
      if(NET.left<=0||NET.ps.length>=NET_MAX){netGo();return}}
    netRoster();}
  else if(NET.state==='join'&&now-NET.joinAt>2000){
    if(now-NET.joinAt>8000){if(NET.quick){netQuickSearch()}else{netLeaveRoomQuiet();NET.state='off';onlineMsg(`Couldn't find a room called ${NET.code}. Check the code with your friend and try again.`);show('sOnline')}return}
    netSend({k:'hi',fr:NET.frog});}
  else if(NET.state==='lobby'&&!NET.host&&now-(NET.seen[NET.hostId]||now)>7000){
    if(NET.quick){netLeaveRoomQuiet();netQuickSearch()}else{netLeaveRoomQuiet();NET.state='off';onlineMsg('The room maker left, so the room closed.');show('sOnline')}}
  if(!NET.host&&NET.state==='lobby'){NET.hbT=(NET.hbT||0)+.5;if(NET.hbT>=2){NET.hbT=0;netSend({k:'hb'})}if(NET.quick)NET.left-=.5;}
  lobbyUI();}
function netLeaveRoomQuiet(){if(NET.room){netSend({k:'bye'});NET.mq.unsub(NET_TOPIC+'/r/'+NET.room)}NET.room=null;NET.host=false;NET.ps=[];}
function netRoster(){netSend({k:'ro',ps:NET.ps,tr:NET.track,lp:NET.laps,q:NET.quick?1:0,left:NET.left,code:NET.code})}
function netGo(){clearInterval(NET.timer);NET.timer=null;NET.state='race';
  // the grid: players first in the order they joined, computer frogs in the spare spots, all shuffled into starting places
  const free=FROGS.map((f,i)=>i).filter(i=>!NET.ps.some(p=>p[1]===i)).sort(()=>Math.random()-.5);
  const g=NET.ps.map(p=>[p[0],p[1]]);while(g.length<NET_MAX)g.push(['',free.pop()]);g.sort(()=>Math.random()-.5);
  const msg={k:'go',tr:NET.track,lp:NET.laps,g};netSend(msg);netBeginRace(msg);}
function netBeginRace(m){NET.state='race';NET.hostId=m.f||NET.id;NET.last={};NET.lastBot=performance.now();
  if(!m.g.some(x=>x[0]===NET.id)){NET.state='off';netLeaveRoomQuiet();onlineMsg('That race started without you. Try again!');show('sOnline');return}
  audio();stopSong();if(document.activeElement)document.activeElement.blur();if(G)G.over=true;engineStopAll();
  newRace({track:m.tr,laps:clamp(m.lp|0,1,5),grid:m.g});show(null);}

// --- messages from other players ---
function netOnMsg(topic,raw){let m;try{m=JSON.parse(raw)}catch(e){return}if(!m||typeof m!=='object'||typeof m.f!=='string'||m.f===NET.id)return;
  if(topic===NET_TOPIC+'/open'){if(m.k==='ad'&&typeof m.r==='string'&&m.r.length<40)NET.ads[m.r]={r:m.r,n:+m.n||0,left:+m.left||0,at:performance.now()};return}
  if(topic===NET_TOPIC+'/gone'){if(m.k==='bye')netBye(m.f);return}
  if(topic!==NET_TOPIC+'/r/'+NET.room)return;
  NET.seen[m.f]=performance.now();NET.rx=NET.rx||{};NET.rx[m.k]=(NET.rx[m.k]||0)+1;
  switch(m.k){
    case 'hi':if(NET.host&&NET.state==='lobby'){if(!NET.ps.some(p=>p[0]===m.f)){if(NET.ps.length>=NET_MAX){netSend({k:'no',to:m.f,why:'full'});return}
        let fr=+m.fr|0;if(!(fr>=0&&fr<FROGS.length)||NET.ps.some(p=>p[1]===fr))fr=FROGS.map((f,i)=>i).find(i=>!NET.ps.some(p=>p[1]===i));NET.ps.push([m.f,fr]);beep(880,.08,'sine',.06);}
        netRoster();lobbyUI();if(NET.ps.length>=NET_MAX&&NET.quick)netGo();}
      else if(NET.host&&NET.state==='race')netSend({k:'no',to:m.f,why:'started'});break;
    case 'no':if(m.to===NET.id&&NET.state==='join'){if(NET.quick){NET.ads={};netLeaveRoomQuiet();netQuickSearch()}else{netLeaveRoomQuiet();NET.state='off';onlineMsg(m.why==='full'?'That room is full (8 players).':'That race has already started. Ask your friend to make a new room.');show('sOnline')}}break;
    case 'ro':if(NET.host)break;if((NET.state==='join'||NET.state==='lobby')&&Array.isArray(m.ps)&&m.ps.some(p=>p[0]===NET.id)){
        NET.state='lobby';NET.hostId=m.f;NET.ps=m.ps.filter(p=>Array.isArray(p)&&typeof p[0]==='string'&&FROGS[p[1]]).slice(0,NET_MAX);NET.track=TRACKS[m.tr]?m.tr:0;NET.laps=[2,3,5].includes(m.lp)?m.lp:3;NET.left=+m.left||0;
        const me=NET.ps.find(p=>p[0]===NET.id);if(me&&me[1]!==NET.frog&&!NET.toldFrog){NET.toldFrog=1;$('#lobMsg2').textContent=`Someone already picked ${FROGS[NET.frog].name}, so you're ${FROGS[me[1]].name} this time!`;}
        lobbyUI();}break;
    case 'go':if(!NET.host&&(NET.state==='lobby'||NET.state==='join')&&Array.isArray(m.g)&&m.g.length===NET_MAX&&TRACKS[m.tr]&&m.g.every(g=>Array.isArray(g)&&typeof g[0]==='string'&&FROGS[g[1]])&&new Set(m.g.map(g=>g[1])).size===NET_MAX){clearInterval(NET.timer);NET.timer=null;netBeginRace(m);}break;
    case 'bye':netBye(m.f);break;
    case 's':netRecvKart(m.f,m.d);break;
    case 'b':if(Array.isArray(m.d)){NET.lastBot=performance.now();if(G&&G.net&&m.f!==NET.hostId&&!NET.host)NET.hostId=m.f;for(const d of m.d)netRecvKart(m.f,d,true);}break;
    case 'i':netRecvItem(m);break;
    case 'tg':netRecvTongue(m);break;
  }}
function netBye(f){NET.seen[f]=0;
  if(NET.state==='lobby'||NET.state==='join'){if(NET.host){NET.ps=NET.ps.filter(p=>p[0]!==f);netRoster();lobbyUI()}else if(f===NET.hostId){NET.seen[f]=-1e9}}
  if(G&&G.net&&!G.over){const k=G.karts.find(k=>k.owner===f);if(k)k.lastNet=-1e9;if(f===NET.hostId)NET.lastBot=-1e9;}}

// ---------- during the race ----------
const NF={spin:1,star:2,boost:4,shield:8,dizzy:16,hop:32,gulped:64,inv:128,fin:256,hurt:512,tongue:1024};
function netFlags(k){return (k.spin>0?NF.spin:0)|(k.star>0?NF.star:0)|(k.boost>0?NF.boost:0)|(k.shield>0?NF.shield:0)|(k.dizzy>0?NF.dizzy:0)|(k.hop>0?NF.hop:0)|(k.gulped?NF.gulped:0)|(k.inv>0?NF.inv:0)|(k.fin?NF.fin:0)|(k.hurt>0?NF.hurt:0)|(k.tongueT>0?NF.tongue:0)}
const r1=v=>Math.round(v*10)/10;
function netPack(k){return [k.slot,r1(k.x),r1(k.y),Math.round(k.a*1000)/1000,Math.round(k.speed),Math.round(k.vx),Math.round(k.vy),k.prog,k.lap,netFlags(k),r1(k.z+(k.sz||0)),k.fin?Math.round(k.ft*100)/100:0]}
function netTick(dt){if(G.net!==1||!NET.mq)return;const now=performance.now();
  NET.sendT=(NET.sendT||0)-dt;if(NET.sendT<=0){NET.sendT=NET_SEND;netSend({k:'s',d:netPack(G.player)});}
  // the host also sends the computer frogs (and anyone whose player has left, who the host now drives)
  if(NET.host){NET.botT=(NET.botT||0)-dt;if(NET.botT<=0){NET.botT=NET_BOT_SEND;const d=G.karts.filter(k=>!k.remote&&!k.isP).map(netPack);if(d.length)netSend({k:'b',d});}}
  // a player who's gone quiet for 4 seconds has left: the host turns their jetski into a computer frog
  for(const k of G.karts){if(!k.human||!k.remote)continue;if(now-(k.lastNet||now)>4000&&!k.fin){if(NET.host)netTakeOver(k);else k.left=true;}}
  // the host has left: the player with the smallest name takes over the computer frogs
  if(!NET.host&&now-NET.lastBot>3500){const alive=G.karts.filter(k=>k.human&&(!k.remote||now-(k.lastNet||0)<3000)).map(k=>k.owner).sort();
    if(alive[0]===NET.id){NET.host=true;NET.hostId=NET.id;for(const k of G.karts)if(k.remote&&(!k.human||now-(k.lastNet||0)>3000))netTakeOver(k);netNote('You are now running the computer frogs');}}
  // race over when every player still here has finished
  if(G.state==='race'&&G.player.fin){const hs=G.karts.filter(k=>k.human&&!k.left&&!(k.remote&&now-(k.lastNet||0)>4000));if(hs.every(k=>k.fin)){G.state='done';G.endT=3;}}}
function netTakeOver(k){if(k.owner!=='bots'&&k.human){k.human=false;k.owner='bots';}k.remote=false;k.isP=false;k.ai.chk=0;k.ai.lastP=k.prog;k._g0=undefined;k.gvp=undefined;k._sw0=undefined;k._svp=undefined;k.air=false;k.sAir=false;k.spin=0;}
function netRecvKart(from,d,bot){if(!G||!G.net||G.over||!Array.isArray(d))return;const k=G.karts[d[0]];if(!k||!k.remote)return;
  if(!bot&&k.owner!==from)return;
  if(bot&&k.human){if(k.left||performance.now()-(k.lastNet||0)>3000){k.human=false;k.owner='bots';k.left=false;}else return;}   // the host is now driving a player who left
  const n=d.map(Number);if(n.some(v=>!isFinite(v)))return;
  k.net={x:n[1],y:n[2],a:n[3],sp:n[4],vx:n[5],vy:n[6],at:performance.now()};k.lastNet=performance.now();
  if(k.netFirst===undefined){k.netFirst=1;k.x=n[1];k.y=n[2];k.a=n[3];}
  k.prog=n[7];k.lap=n[8];const f=n[9];k.speed=n[4];
  k.spin=f&NF.spin?.5:0;k.star=f&NF.star?1:0;k.boost=f&NF.boost?1:0;k.shield=f&NF.shield?1:0;k.dizzy=f&NF.dizzy?1:0;k.hop=f&NF.hop?(k.hop||.35):0;k.inv=f&NF.inv?1:0;k.hurt=f&NF.hurt?.3:0;k.tongueT=f&NF.tongue?1:0;
  k.gulped=f&NF.gulped?(k.gulped||{}):null;k.zNet=n[10];
  if(f&NF.fin&&!k.fin){k.fin=true;k.ft=n[11];G.finishOrder.push(k);}}
// other jetskis glide towards where their owner says they are
function netStepRemote(k,dt){const T=G.T,s=k.net;if(!s)return;
  const age=Math.min(.35,(performance.now()-s.at)/1000),px=s.x+s.vx*age,py=s.y+s.vy*age;
  if(Math.hypot(px-k.x,py-k.y)>350){k.x=px;k.y=py;}else{const f=Math.min(1,dt*10);k.x+=(px-k.x)*f;k.y+=(py-k.y)*f;}
  k.a+=angDiff(k.a,s.a)*Math.min(1,dt*14);k.vx=s.vx;k.vy=s.vy;
  k.idx=nearestIdx(T,k.x,k.y,k.idx,30);const q=T.pts[k.idx];k._lat=(k.x-q.x)*q.nx+(k.y-q.y)*q.ny;
  k.z+=((k.zNet||0)-k.z)*Math.min(1,dt*12);k.swG=swellAt(T,trackS(T,k));k.sw=k.swG;k.sz=0;
  k.hop=Math.max(0,(k.hop||0)-dt);if(k.left){k.speed=0}}
function netItem(k,it){const d={k:'i',s:k.slot,it,x:r1(k.x),y:r1(k.y),a:Math.round(k.a*1000)/1000,sp:Math.round(k.speed)};netSend(d);}
function netTongue(k,tgt){netSend({k:'tg',s:k.slot,t:tgt?tgt.slot:-1});}
function netRecvItem(m){if(!G||!G.net||G.over)return;const k=G.karts[m.s|0];if(!k||!k.remote)return;const ca=Math.cos(+m.a||0),sa=Math.sin(+m.a||0),x=+m.x,y=+m.y,sp=Math.max(0,+m.sp||0);if(!isFinite(x+y))return;
  switch(m.it){
    case 'bubble':G.proj.push({type:'bubble',x:x+ca*34,y:y+sa*34,vx:ca*(1180+sp*.4),vy:sa*(1180+sp*.4),owner:k,life:3.2,idx:k.idx,grace:.15});break;
    case 'fly':{const tgt=G.karts.find(o=>o.place===k.place-1&&!o.fin);G.proj.push({type:'fly',x:x+ca*34,y:y+sa*34,vx:ca*1020,vy:sa*1020,owner:k,life:6,idx:k.idx,target:tgt||null,grace:.2});break;}
    case 'lily':G.haz.push({type:'lily',x:x-ca*48,y:y-sa*48,owner:k,grace:.6,r:Math.random()*TAU,i:k.idx});break;
    case 'croak':G.texts.push({x,y:y-40,s:'CROAK!',c:'#ffd23f',life:1.2,max:1.2,big:1});G.parts.push({ring:1,x,y,life:.8,max:.8});
      for(const o of G.karts){if(o===k||o.remote)continue;if(o.place<k.place||(k.place===1&&Math.hypot(o.x-x,o.y-y)<700))hitKart(o,'dizzy');}break;
    case 'turbo':k.boost=1.6;k.hop=.35;break;
    case 'star':k.star=1;break;
    case 'shield':k.shield=1;break;
    case 'tongue':k.tongueT=8;break;}}
function netRecvTongue(m){if(!G||!G.net||G.over)return;const k=G.karts[m.s|0];if(!k||!k.remote||k.tng)return;const tgt=m.t>=0?G.karts[m.t|0]:null;
  const d=tgt?Math.hypot(tgt.x-k.x,tgt.y-k.y):520;k.tng={tgt,t:0,out:Math.max(.12,d/2000),phase:'out',hit:false};const dp=pDist(k.x,k.y);if(dp<800)thwipSound(.5*(1-dp/800));}
function netRaceOver(){if(NET.mq){netLeaveRoomQuiet();NET.state='done'}}

// ---------- buttons ----------
$('#bOnline').onclick=()=>{opts.players=1;saveOpts();PICK=1;ONLINE_FROM_FROG=true;frogPickUI();audio();playSong('menu');beep(660,.1);beep(990,.1);show('sFrog')};
$('#bOnBack').onclick=()=>{beep(500,.06);netLeave();ONLINE_FROM_FROG=false;show('sTitle')};
$('#bOnFrog').onclick=()=>{beep(600,.06);ONLINE_FROM_FROG=true;frogPickUI();show('sFrog')};
$('#bQuick').onclick=()=>{beep(700,.08);NET.toldFrog=0;$('#lobMsg2').textContent='';onlineStart('quick')};
$('#bMakeRoom').onclick=()=>{beep(700,.08);NET.toldFrog=0;$('#lobMsg2').textContent='';let c='';for(let i=0;i<4;i++)c+=CODE_ABC[Math.random()*CODE_ABC.length|0];onlineStart('make',c)};
$('#bJoinRoom').onclick=()=>{const c=($('#roomCode').value||'').toUpperCase().replace(/[^A-Z]/g,'');if(c.length!==4){beep(200,.1,'square',.05);onlineMsg('Room codes are 4 letters, like BKTZ.');return}
  beep(700,.08);NET.toldFrog=0;$('#lobMsg2').textContent='';onlineStart('join',c)};
$('#roomCode').addEventListener('input',e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,4)});
$('#roomCode').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')$('#bJoinRoom').click()});
$('#bLobLeave').onclick=()=>{beep(500,.06);netLeave();onlineMsg('Race other players on the internet. Empty spots are filled with computer frogs.');show('sOnline')};
$('#bLobStart').onclick=()=>{if(NET.host&&NET.state==='lobby'){beep(880,.1);netGo()}};
$('#bLobTrack').onclick=()=>{if(NET.host&&NET.state==='lobby'){NET.track=netPickTrack();beep(660,.06);netRoster();lobbyUI()}};
addEventListener('beforeunload',()=>{if(NET.mq)netLeave()});
