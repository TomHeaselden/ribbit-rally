import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,base64,struct
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""async()=>{const out=[];const rms=(d,a)=>{let e=0,pk=0;for(let i=a;i<d.length;i++){e+=d[i]*d[i];pk=Math.max(pk,Math.abs(d[i]))}return [Math.sqrt(e/(d.length-a)),pk]};
          for(const [lab,sp,gas,boost,z] of [['idle',0,0,0,0],['half',280,1,0,0],['top',600,1,0,0],['boost',900,1,1,0],['air',700,1,0,20]]){
            AC=new OfflineAudioContext(1,44100*1.5,44100);sound=true;ENG.n=null;
            G={state:'race',paused:false,over:false,t:0,player:{speed:sp,maxS:600,_gas:gas,boost,star:0,z,spin:0,ko:0}};
            engineStart();ENG.rpm=engineRpmTarget(G.player);engineTick(.016);
            const d=(await AC.startRendering()).getChannelData(0);const [e,pk]=rms(d,44100*.5);out.push(lab+': rpm '+ENG.rpm.toFixed(2)+' rms '+e.toFixed(3)+' peak '+pk.toFixed(2));}
          AC=new OfflineAudioContext(1,44100*1.5,44100);REV_STYLES.jet.rev(1);{const d=(await AC.startRendering()).getChannelData(0);const [e,pk]=rms(d,0);out.push('jet start rev: rms '+e.toFixed(3)+' peak '+pk.toFixed(2));}
          // demo sweep: idle with start revs, GO, build speed, cruise, boost pad, crash slow-down, build up again
          const L=16;AC=new OfflineAudioContext(1,44100*L,44100);ENG.n=null;const P={a:0,x:0,y:0,speed:0,maxS:600,_gas:0,boost:0,star:0,z:0,spin:0,ko:0,rev:0};G={state:'count',paused:false,over:false,t:0,T:{},fire:[],player:P};engineStart();
          const dt=1/60;const steps=[];for(let i=0;i<L/dt;i++)steps.push(i*dt);const log=[];let pops=0;const op=overrunPop;overrunPop=function(...a){pops++;return op(...a)};
          const near=x=>Math.abs(G._tt-x)<dt/2;
          for(const st of steps){AC.suspend(st).then(()=>{const t=st;G._tt=t;
            if(t<3.4){G.state='count';P.rev=Math.max(0,(P.rev||0)-dt*2.2);for(const r of [.4,1.9])if(near(r)){P.rev=1;REV_STYLES.jet.rev(.9)}for(const r of [1.0,2.5])if(near(r))REV_STYLES.jet.pop(.8);}
            else{if(G.state==='count'){P.rev=1.2;REV_STYLES.jet.pop(1)}G.state='race';P.rev=Math.max(0,P.rev-dt*2.2);P._gas=1;P.boost=Math.max(0,P.boost-dt);
              if(near(11))P.boost=1.6;
              if(t>=6.5&&t<8.3){P._gas=0;P.speed=Math.max(0,P.speed-250*dt)}
              else if(t>=13.5&&t<14.6){P._gas=0;P.speed=Math.max(120,P.speed-950*dt)}
              else{const mx=P.boost>0?900:600;if(P.speed<mx)P.speed=Math.min(mx,P.speed+430*(P.boost>0?2:1)*dt);else P.speed-=(P.speed-mx)*Math.min(1,2.6*dt);}}
            const g0=G.gear;gearTick(dt);engineTick(dt);if(G.gear!==g0)log.push(t.toFixed(2)+':'+g0+'->'+G.gear);AC.resume()});}
          const w=(await AC.startRendering()).getChannelData(0);let wp=0;for(const x of w)wp=Math.max(wp,Math.abs(x));const g=.9/Math.max(wp,.9);
          const buf=new DataView(new ArrayBuffer(44+w.length*2));const ws=(o,s)=>{for(let i=0;i<s.length;i++)buf.setUint8(o+i,s.charCodeAt(i))};
          ws(0,'RIFF');buf.setUint32(4,36+w.length*2,true);ws(8,'WAVE');ws(12,'fmt ');buf.setUint32(16,16,true);buf.setUint16(20,1,true);buf.setUint16(22,1,true);buf.setUint32(24,44100,true);buf.setUint32(28,88200,true);buf.setUint16(32,2,true);buf.setUint16(34,16,true);ws(36,'data');buf.setUint32(40,w.length*2,true);
          for(let i=0;i<w.length;i++){let v=w[i]*g;if(!isFinite(v))v=0;buf.setInt16(44+i*2,Math.max(-1,Math.min(1,v))*32767,true)}
          let bin='';const u=new Uint8Array(buf.buffer);for(let i=0;i<u.length;i+=8192)bin+=String.fromCharCode.apply(null,u.subarray(i,i+8192));
          out.push("demo peak "+wp.toFixed(2));out.push("shifts "+log.join(" "));out.push("overrun events "+pops);overrunPop=op;return [out,btoa(bin)]}""")
        print('\n'.join(r[0]))
        open('engine-demo.wav','wb').write(base64.b64decode(r[1]))
        await b.close()
asyncio.run(main())
