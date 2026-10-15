import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':700})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://share/ribbit-rally.html'); await pg.wait_for_timeout(600)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(1)')
        await pg.wait_for_timeout(3000)
        print('3D',await pg.evaluate("GL3.ok"),'racing',await pg.evaluate("G&&G.state"),errs)
        await b.close()
asyncio.run(main())
