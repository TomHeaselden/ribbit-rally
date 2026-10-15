import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':800})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.wait_for_timeout(200)
        await pg.click('#levelTabs .lvl:nth-child(2)'); await pg.wait_for_timeout(300); await pg.screenshot(path='l2.png')
        await pg.click('#levelTabs .lvl:nth-child(3)'); await pg.wait_for_timeout(300); await pg.screenshot(path='l3.png')
        # simulate every L2/L3 track quickly with AI driving player
        r=await pg.evaluate("""()=>{const out=[];for(const ti of [21,25,30,35,40,41,45,50,55,60]){opts.track=ti;opts.laps=3;newRace();G.cd=1.21;let n=0;
          while(n<60*240){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;opts.autoGas=!!P._g||true;update(1/60);n++;if(G.karts.every(k=>k.fin))break;}
          keys.arrowleft=keys.arrowright=keys.arrowdown=false;
          const fin=G.karts.filter(k=>k.fin).length;out.push([ti,TRACKS[ti].n,'fin '+fin,'time '+(n/60).toFixed(0),'KOs '+G.karts.reduce((a,k)=>a+k.kos,0),'player '+(G.player.fin?G.player.ft.toFixed(0):'dnf')]);G.over=true;}return out}""")
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
