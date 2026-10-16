import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
# swells: how often racers hop, how high, and that the water height never jumps between frames
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(tracks)=>{GL3.ok=false;const out=[];for(const ti of tracks){
          opts.track=ti;opts.laps=1;opts.players=1;newRace();G.cd=1.21;let n=0;const P=G.player;let hops=0,pHops=0,maxSz=0,pMaxSz=0,maxJump=0,air=0;const was={};const peaks=[];let cur=0;
          while(n<60*200){if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;
            const prev=G.karts.map(k=>k.swG||0);update(1/60);n++;
            G.karts.forEach((k,j)=>{if(k.sAir&&!was[j]){hops++;if(k===P)pHops++;}was[j]=!!k.sAir;maxSz=Math.max(maxSz,k.sz||0);if(k===P){pMaxSz=Math.max(pMaxSz,k.sz||0);if(k.sAir){air++;cur=Math.max(cur,k.sz||0)}else if(cur>0){peaks.push([cur,Math.round(k.speed)]);cur=0}}
              if(!k.air&&k.z<=0&&n>5)maxJump=Math.max(maxJump,Math.abs((k.swG||0)-prev[j]));});
            if(G.karts.every(k=>k.fin))break;}
          for(const k of ['arrowleft','arrowright','arrowdown'])keys[k]=false;
          out.push([ti,TRACKS[ti].n,'swells '+G.swells.length,'lap t '+(n/60|0),'hops all '+hops,'player hops '+pHops,'player air s '+(air/60).toFixed(1),'max air '+maxSz.toFixed(1)+' / player '+pMaxSz.toFixed(1),'max swell step/frame '+maxJump.toFixed(2),'fin '+G.karts.filter(k=>k.fin).length,'peaks '+peaks.map(p=>p[0].toFixed(0)+'@'+p[1]).join(' ')]);G.over=true;}return out}""",[int(x) for x in sys.argv[1:]])
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
