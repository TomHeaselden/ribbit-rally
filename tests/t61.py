import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        await pg.evaluate("window._f=0;window._st=[];const of=frogVoice;window.frogVoice=function(i){window._f++;window._st.push(new Error().stack.split('\\n').slice(1,4).join(' | '));return of(i)}")
        await pg.evaluate("document.querySelector('#frogGrid .card').click()"); await pg.wait_for_timeout(300)
        print('js click ->',await pg.evaluate("window._f"))
        await pg.click('#frogGrid .card:nth-child(2)'); await pg.wait_for_timeout(300)
        print('mouse click total ->',await pg.evaluate("window._f")); print(await pg.evaluate("window._st"))
        await b.close()
asyncio.run(main())
