import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for vw,vh,nm in [(1280,800,'r'),(400,820,'rm')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh})
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(PAGE); await pg.wait_for_timeout(400)
            await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(20)')
            r=await pg.evaluate("""()=>{let n=0;while(!G.over&&n<60*60*6){const P=G.player;aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;}keys.arrowleft=keys.arrowright=false;return [n/60,G.player.ft,G.karts.map(k=>k.place)]}""")
            print(nm,r,errs)
            await pg.wait_for_timeout(900); await pg.screenshot(path=f'{nm}.png')
        await b.close()
asyncio.run(main())
