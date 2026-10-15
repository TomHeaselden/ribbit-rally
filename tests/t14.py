import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(ti)=>{GL3.ok=false;opts.track=ti;opts.laps=3;newRace();G.cd=1.21;const snaps=[];
          for(let n=1;n<=60*150;n++){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);
            if(n%(60*15)===0)snaps.push((n/60)+'s: '+G.karts.map(k=>k.f.name.slice(0,3)+':'+(k.prog/TN).toFixed(2)+(k.fin?'F':'')+(k.ko>0?'K':'')+' sp'+(k.speed|0)).join(' '));}
          return snaps}""",int(sys.argv[1]))
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
