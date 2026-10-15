import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=65;newRace();G.cd=1.21;let n=0;const ev=[];const run={};
          while(n<60*110){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;
            for(const k of G.karts){const slow=!k.fin&&k.z<=0&&k.ko<=0&&k.spin<=0&&k.slope>.35&&k.speed<40;run[k.id]=slow?(run[k.id]||0)+1:0;if(run[k.id]===1)ev.push([k.f.name,(n/60).toFixed(1),'sp',k.speed|0,'brake',!!k._b,'gas',k._g,'hit',k.spinHit.toFixed(1),'hurt',k.hurt.toFixed(2)]);if(run[k.id]>0)ev[ev.length-1][11]=run[k.id];}}
          return ev.slice(0,12)}""")
        for x in r: print(x)
        await b.close()
asyncio.run(main())
