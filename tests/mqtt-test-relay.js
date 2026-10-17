// A tiny MQTT 3.1.1 relay over WebSockets, for testing online races on one computer.
// It's strict about the packet formats a real public broker checks, and adds a little delay like the internet.
// Run: node mqtt-test-relay.js [port=9001] [delayMs=40]   then open the game with ?mqtt=ws://127.0.0.1:9001/mqtt
const http=require('http'),crypto=require('crypto');
const PORT=+process.argv[2]||9001,DELAY=+(process.argv[3]??40);
const clients=new Set();let stats={pub:0,conn:0,bad:0};
const log=(...a)=>console.log(new Date().toISOString().slice(11,23),...a);
function frame(buf){const n=buf.length;let h;if(n<126)h=Buffer.from([0x82,n]);else if(n<65536){h=Buffer.alloc(4);h[0]=0x82;h[1]=126;h.writeUInt16BE(n,2)}else{h=Buffer.alloc(10);h[0]=0x82;h[1]=127;h.writeBigUInt64BE(BigInt(n),2)}return Buffer.concat([h,buf])}
function send(c,bytes){if(c.dead)return;try{c.sock.write(frame(Buffer.from(bytes)))}catch(e){}}
function str(b,p){const n=b.readUInt16BE(p);return [b.slice(p+2,p+2+n).toString('utf8'),p+2+n]}
function match(filter,topic){const f=filter.split('/'),t=topic.split('/');for(let i=0;i<f.length;i++){if(f[i]==='#')return true;if(i>=t.length)return false;if(f[i]!=='+'&&f[i]!==t[i])return false}return f.length===t.length}
function route(topic,payload){stats.pub++;const tb=Buffer.from(topic);const body=Buffer.concat([Buffer.from([tb.length>>8,tb.length&255]),tb,payload]);
  const len=[];let n=body.length;do{let d=n%128;n=Math.floor(n/128);if(n>0)d|=128;len.push(d)}while(n>0);const pkt=Buffer.concat([Buffer.from([0x30,...len]),body]);
  for(const c of clients)if(c.ok&&c.subs.some(s=>match(s,topic)))setTimeout(()=>send(c,pkt),DELAY+Math.random()*DELAY*.5);}
function bad(c,why){stats.bad++;log('BAD PACKET from',c.id,why);c.sock.destroy()}
function mqtt(c,type,b){const t=type>>4;
  if(!c.ok&&t!==1)return bad(c,'first packet must be CONNECT');
  switch(t){
    case 1:{let [proto,p]=str(b,0);if(proto!=='MQTT'||b[p]!==4)return bad(c,'protocol '+proto+' level '+b[p]);const fl=b[p+1];p+=4;if(fl&1)return bad(c,'reserved flag');
      let id;[id,p]=str(b,p);if(!id||id.length>23)return bad(c,'client id length '+(id||'').length);c.id=id;
      if(fl&4){let wt,wm;[wt,p]=str(b,p);[wm,p]=str(b,p);c.will={t:wt,m:Buffer.from(wm)}}
      c.ok=true;stats.conn++;send(c,[0x20,2,0,0]);break;}
    case 3:{const qos=(type>>1)&3;let [topic,p]=str(b,0);if(qos)p+=2;if(/[#+]/.test(topic))return bad(c,'wildcard in publish topic');route(topic,b.slice(p));break;}
    case 8:{if(type!==0x82)return bad(c,'SUBSCRIBE flags must be 0010');const id=b.readUInt16BE(0);let p=2;const g=[];while(p<b.length){let f;[f,p]=str(b,p);const q=b[p++];if(q>2)return bad(c,'qos');c.subs.push(f);g.push(0)}
      send(c,[0x90,2+g.length,id>>8,id&255,...g]);break;}
    case 10:{if(type!==0xA2)return bad(c,'UNSUBSCRIBE flags must be 0010');const id=b.readUInt16BE(0);let p=2;while(p<b.length){let f;[f,p]=str(b,p);c.subs=c.subs.filter(s=>s!==f)}send(c,[0xB0,2,id>>8,id&255]);break;}
    case 12:send(c,[0xD0,0]);break;
    case 14:c.will=null;c.sock.end();break;
    default:return bad(c,'unexpected packet type '+t);}}
function onMqttBytes(c,d){c.mb=Buffer.concat([c.mb,d]);for(;;){const B=c.mb;if(B.length<2)return;let mult=1,len=0,i=1,x;do{if(i>=B.length)return;x=B[i++];len+=(x&127)*mult;mult*=128}while(x&128);if(B.length<i+len)return;
  const type=B[0],body=B.slice(i,i+len);c.mb=B.slice(i+len);mqtt(c,type,body);if(c.sock.destroyed)return;}}
function onWs(c,d){c.wb=Buffer.concat([c.wb,d]);for(;;){const B=c.wb;if(B.length<2)return;const op=B[0]&15,masked=B[1]&128;let n=B[1]&127,p=2;
  if(n===126){if(B.length<4)return;n=B.readUInt16BE(2);p=4}else if(n===127){if(B.length<10)return;n=Number(B.readBigUInt64BE(2));p=10}
  if(!masked)return bad(c,'client frames must be masked');if(B.length<p+4+n)return;const mk=B.slice(p,p+4);p+=4;const pl=Buffer.alloc(n);for(let i=0;i<n;i++)pl[i]=B[p+i]^mk[i&3];c.wb=B.slice(p+n);
  if(op===2||op===0)onMqttBytes(c,pl);else if(op===1)return bad(c,'text frames are not MQTT');else if(op===8){c.sock.end();return}else if(op===9){try{c.sock.write(Buffer.concat([Buffer.from([0x8A,pl.length]),pl]))}catch(e){}}}}
function gone(c){if(c.dead)return;c.dead=true;clients.delete(c);if(c.will){route(c.will.t,c.will.m);c.will=null}}
const server=http.createServer((q,r)=>{r.writeHead(200);r.end(JSON.stringify(stats))});
server.on('upgrade',(req,sock)=>{const protos=(req.headers['sec-websocket-protocol']||'').split(',').map(s=>s.trim());
  if(!protos.includes('mqtt')){sock.end('HTTP/1.1 400 Bad Request\r\n\r\n');stats.bad++;log('refused: no mqtt subprotocol');return}
  const acc=crypto.createHash('sha1').update(req.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+acc+'\r\nSec-WebSocket-Protocol: mqtt\r\n\r\n');
  const c={sock,wb:Buffer.alloc(0),mb:Buffer.alloc(0),subs:[],ok:false,will:null};clients.add(c);sock.setNoDelay(true);
  sock.on('data',d=>onWs(c,d));sock.on('close',()=>gone(c));sock.on('error',()=>gone(c));});
server.listen(PORT,'127.0.0.1',()=>log('test relay on ws://127.0.0.1:'+PORT+'/mqtt, delay',DELAY,'ms'));
