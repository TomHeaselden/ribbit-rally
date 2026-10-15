import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1100,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        print('speech api',await pg.evaluate("!!window.speechSynthesis"),'voices',await pg.evaluate("speechSynthesis.getVoices().length"))
        await pg.click('#frogGrid .card:nth-child(3)'); await pg.wait_for_timeout(300); await pg.screenshot(path='say.png')
        print('bubble',await pg.evaluate("document.querySelector('.say')&&document.querySelector('.say').textContent"))
        await pg.wait_for_timeout(1500)
        await pg.click('#frogGrid .card:nth-child(4)'); await pg.wait_for_timeout(300)
        print('bubble2',await pg.evaluate("[...document.querySelectorAll('.say')].map(x=>x.textContent)"),'duck',await pg.evaluate("MUS.duck"),errs)
        await pg.set_viewport_size({'width':400,'height':820}); await pg.wait_for_timeout(200); await pg.screenshot(path='say_m.png')
        await b.close()
asyncio.run(main())
