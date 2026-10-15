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
        await pg.goto(PAGE); await pg.wait_for_timeout(800)
        await pg.screenshot(path='w0.png',timeout=120000)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300); await pg.screenshot(path='w1.png',timeout=120000)
        await pg.click('#bToTracks'); await pg.wait_for_timeout(300); await pg.screenshot(path='w2.png',timeout=120000)
        await pg.click('#trackGrid .card:nth-child(5)')
        await pg.evaluate("""()=>{G.paused=true;}""")
        await pg.evaluate("""()=>{G.paused=false;let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}for(let i=0;i<60*6;i++){const P=G.player;aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);}keys.arrowleft=keys.arrowright=false;render();G.paused=true;}""")
        await pg.wait_for_timeout(300); await pg.screenshot(path='w3.png',timeout=120000)
        print(errs)
        await b.close()
asyncio.run(main())
