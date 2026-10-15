import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=1);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(2500)
        for i in range(8):
            card=pg.locator(f'#frogGrid > :nth-child({i+1})'); await card.hover(); await pg.wait_for_timeout(250)
            a=await pg.evaluate(f"(()=>{{const c=frogGrid.children[{i}];return [c.querySelector('.nm').textContent,getComputedStyle(c.querySelector('canvas')).animationName,getComputedStyle(c.querySelector('.notes i')).animationName,FACE[{i}].smileT]}})()")
            print(a)
        # filmstrip of three dancers
        frames=[]
        for i,nm in [(2,'bonk'),(5,'douglas'),(7,'rocket')]:
            card=pg.locator(f'#frogGrid > :nth-child({i+1})'); await card.hover()
            for f in range(4):
                await pg.wait_for_timeout(180); await card.screenshot(path=f'dance_{nm}_{f}.png',animations='allow')
        # talking takes over from dancing
        await pg.evaluate("speechSynthesis.speak=()=>{}")
        card=pg.locator('#frogGrid > :nth-child(2)'); await card.hover(); await card.click(); await pg.wait_for_timeout(900)
        print('lulu while talking:',await pg.evaluate("getComputedStyle(frogGrid.children[1].querySelector('canvas')).animationName"))
        await pg.click('#bToTracks'); await pg.wait_for_timeout(800); await pg.locator('#trackGrid > :nth-child(1)').hover(); await pg.wait_for_timeout(200)
        print('track card on hover:',await pg.evaluate("getComputedStyle(trackGrid.children[0].querySelector('canvas')).animationName"))
        print('errors',errs); await b.close()
asyncio.run(main())
