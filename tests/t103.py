import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(2000)
        await pg.evaluate("speechSynthesis.speak=()=>{}")
        card=pg.locator('#frogGrid > :nth-child(2)'); await card.hover(); await pg.wait_for_timeout(400)
        print('hover: DANCE.i=',await pg.evaluate("DANCE.i"))
        await card.click(); await pg.wait_for_timeout(1500)
        print('talking: SPK.i=',await pg.evaluate("SPK.i"),'DANCE.i=',await pg.evaluate("DANCE.i"))
        await pg.mouse.move(5,5); await pg.wait_for_timeout(300)
        print('left: DANCE.i=',await pg.evaluate("DANCE.i"))
        # fps cost while dancing
        await pg.locator('#frogGrid > :nth-child(3)').hover()
        n=await pg.evaluate("new Promise(r=>{let n=0,t0=performance.now();(function f(){n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else r(n/2)})()})")
        print('fps while dancing (swiftshader):',n)
        await pg.click('#bToTracks'); await pg.wait_for_timeout(800)
        print('on tracks: DANCE.i=',await pg.evaluate("DANCE.i"),'errors',errs); await b.close()
asyncio.run(main())
