import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+open('ribbit-rally.html').read()+'</body></html>'
    open('p.html','w').write(html)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1280,'height':800})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.wait_for_timeout(300); await pg.screenshot(path='e1.png')
        await pg.click('#trackGrid .card:nth-child(5)'); await pg.wait_for_timeout(5200)
        # give player items and fire
        await pg.evaluate("()=>{for(const k of G.karts){k.item='bubble'};G.player.item='croak'}")
        await pg.wait_for_timeout(1500)
        await pg.keyboard.press('Space'); await pg.wait_for_timeout(300); await pg.screenshot(path='e2.png')
        await pg.evaluate("()=>{G.player.item='star';}"); await pg.keyboard.press('Space'); await pg.wait_for_timeout(600); await pg.screenshot(path='e3.png')
        r=await pg.evaluate("""()=>{let n=0;while(!G.over&&n<60*60*6){update(1/60);n++;}return [n/60,G.player.ft,G.raceT]}""")
        print(r)
        await pg.wait_for_timeout(700); await pg.screenshot(path='e4.png')
        print(errs)
        await b.close()
asyncio.run(main())
