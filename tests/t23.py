import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(tracks)=>{GL3.ok=false;const out=[];for(const ti of tracks){opts.track=ti;opts.laps=3;newRace();G.cd=1.21;let n=0,air=0,launches=0,minUp=1e9,maxDown=0,stuck=0;const was={};
          while(n<60*300){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;
            for(const k of G.karts){if(k.air){air++;if(!was[k.id])launches++;}was[k.id]=k.air;if(!k.fin&&k.z<=0&&k.ko<=0&&k.spin<=0){if(k.slope>.35)minUp=Math.min(minUp,k.speed);if(k.slope<-.35)maxDown=Math.max(maxDown,k.speed);}}
            if(G.karts.every(k=>k.fin))break;}
          out.push([TRACKS[ti].n,'fin '+G.karts.filter(k=>k.fin).length,'t '+(n/60|0),'airtime/kart '+(air/60/8).toFixed(1)+'s','takeoffs '+launches,'slowest steep climb '+(minUp|0),'fastest steep descent '+(maxDown|0),'ft '+G.karts.filter(k=>k.fin).map(k=>k.ft|0).sort((a,b)=>a-b).join(',')]);G.over=true;}return out}""",[int(x) for x in sys.argv[1:]])
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
