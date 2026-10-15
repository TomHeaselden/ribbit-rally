import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay')
        await pg.evaluate("window._st={};const ob=blinkShape;window.blinkShape=function(F,t){if(t<.02&&F.style)window._st[F.style]=(window._st[F.style]||0)+1;return ob(F,t)};FACE.forEach(F=>F.nextBlink=0)")
        await pg.wait_for_timeout(20000)
        print('blink styles seen in 20s:',await pg.evaluate("window._st"),errs)
        await b.close()
asyncio.run(main())
