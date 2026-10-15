import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(tracks)=>{GL3.ok=false;const out=[];for(const ti of tracks){opts.track=ti;newRace();G.cd=1.21;let n=0;const up=[],flat=[];
          while(n<60*300){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;
            for(const k of G.karts){if(k.fin||k.z>0||k.ko>0||k.spin>0||k.boost>0)continue;if(k.slope>.3)up.push(k.speed);else if(Math.abs(k.slope)<.05)flat.push(k.speed);}
            if(G.karts.every(k=>k.fin))break;}
          const avg=a=>a.reduce((x,y)=>x+y,0)/a.length|0;out.push([TRACKS[ti].n,'race '+(n/60|0)+'s','avg speed on flat '+avg(flat),'avg speed on steep climbs '+avg(up),'climb vs flat '+(avg(up)/avg(flat)*100|0)+'%']);G.over=true;}return out}""",[int(x) for x in sys.argv[1:]])
        for x in r: print(x)
        await b.close()
asyncio.run(main())
