import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1000,'height':700});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(2)')
        await pg.wait_for_timeout(1500); print('countdown',await pg.evaluate("[!!ENG.n,ENG.rpm.toFixed(2),ENG.n&&ENG.n.out.gain.value.toFixed(3),G.state]"))
        await pg.wait_for_timeout(6000); print('racing',await pg.evaluate("[!!ENG.n,ENG.rpm.toFixed(2),ENG.n&&ENG.n.out.gain.value.toFixed(3),G.state,Math.round(G.spdD)]"))
        await pg.evaluate("togglePause()"); await pg.wait_for_timeout(400); print('paused',await pg.evaluate("[!!ENG.n,ENG.n&&ENG.n.out.gain.value.toFixed(3)]"))
        await pg.evaluate("togglePause()"); await pg.wait_for_timeout(400); print('resumed',await pg.evaluate("[!!ENG.n,ENG.n&&ENG.n.out.gain.value.toFixed(3)]"))
        await pg.evaluate("togglePause()"); await pg.click('#bQuit'); await pg.wait_for_timeout(300); print('quit',await pg.evaluate("[!!ENG.n]"))
        await pg.click('#trackGrid .card:nth-child(3)'); await pg.wait_for_timeout(800); print('new race',await pg.evaluate("[!!ENG.n,G.state]"))
        await pg.evaluate("showResults()"); await pg.wait_for_timeout(300); print('results',await pg.evaluate("[!!ENG.n]"))
        print('errors',errs); await b.close()
asyncio.run(main())
