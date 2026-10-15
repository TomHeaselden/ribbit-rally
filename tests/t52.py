import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(1)'); await pg.click('#trackGrid .card:nth-child(3)')
        await pg.evaluate("()=>{G.paused=true;}")
        for name,frames in [('wh1',14),('wh2',22)]:
            await pg.evaluate("""(f)=>{G.paused=false;let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}for(let i=0;i<f;i++)update(1/60);
              G.camOrbit=0;render();G.paused=true;window._w=G.karts.map(k=>wheelieAngle(k).toFixed(2)).join(',');}""",frames)
            await pg.wait_for_timeout(150); await pg.screenshot(path=name+'.png',timeout=120000)
            print(name,await pg.evaluate("window._w"))
        # side view: swing camera round
        await pg.evaluate("""()=>{G.paused=false;opts.autoGas=true;const P=G.player;P.wheelie=0;G.karts.forEach(k=>{k.wheelie=0;k.wheelieDelay=k.isP?0:Math.random()*.3;});for(let i=0;i<12;i++)update(1/60);G.camOrbit=1.9;render();G.paused=true;}""")
        await pg.wait_for_timeout(150); await pg.screenshot(path='wh3.png',timeout=120000)
        print(errs)
        await b.close()
asyncio.run(main())
