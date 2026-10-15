import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        print('fresh',await pg.evaluate("[opts.revStyle,document.querySelector('#oRev .on').dataset.v]"))
        await pg.evaluate("localStorage.setItem('rr-opts',JSON.stringify({laps:3,revStyle:'classic'}))"); await pg.reload(); await pg.wait_for_timeout(300)
        print('old save',await pg.evaluate("[opts.revStyle,document.querySelector('#oRev .on').dataset.v]"))
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#oRev button[data-v="muscle"]'); await pg.reload(); await pg.wait_for_timeout(300)
        print('user picked muscle',await pg.evaluate("[opts.revStyle,document.querySelector('#oRev .on').dataset.v]"),errs)
        await b.close()
asyncio.run(main())
