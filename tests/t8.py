import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1280,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.mouse.click(5,5); await pg.wait_for_timeout(1500)
        print('menu',await pg.evaluate("[MUS.name,MUS.step,AC&&AC.state,MUS.gain&&MUS.gain.gain.value.toFixed(2)]"))
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(3)')
        await pg.wait_for_timeout(500); print('count',await pg.evaluate("[MUS.name,G.state]"))
        await pg.evaluate("()=>{for(let n=0;n<60*4;n++)update(1/60)}"); await pg.wait_for_timeout(1500)
        print('race',await pg.evaluate("[MUS.name,MUS.step,G.state]"))
        await pg.click('#bMus'); await pg.wait_for_timeout(300); print('off',await pg.evaluate("[MUS.on,MUS.gain.gain.value.toFixed(3)]"))
        await pg.click('#bMus'); await pg.wait_for_timeout(500); print('on',await pg.evaluate("[MUS.on,MUS.gain.gain.value.toFixed(3)]"))
        await pg.screenshot(path='m1.png')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(500); print('pause',await pg.evaluate("[MUS.duck,MUS.gain.gain.value.toFixed(3)]"))
        await pg.click('#bResume')
        r=await pg.evaluate("""()=>{let n=0;while(!G.over&&n<60*60*5){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;}return [MUS.tempo,G.over]}""")
        print('end',r, await pg.evaluate("MUS.name"))
        await pg.wait_for_timeout(3200); print('after',await pg.evaluate("MUS.name"))
        print(errs)
        await b.close()
asyncio.run(main())
