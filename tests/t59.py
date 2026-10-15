import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        await pg.evaluate("window._c=0;window._f=0;const o=FROG_VOICES[0];FROG_VOICES[0]=t=>{window._c++;o(t)};const of=frogVoice;window.frogVoice=function(i){window._f++;return of(i)}")
        await pg.click('#frogGrid .card:nth-child(1)'); await pg.wait_for_timeout(1700)
        print("croak calls:",await pg.evaluate("[window._c,window._f]"),'music back to normal:',await pg.evaluate("MUS.duck")==1,errs)
        await b.close()
asyncio.run(main())
