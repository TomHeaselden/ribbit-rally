import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
import PIL.Image as I
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1100,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(600)
        await pg.screenshot(path='live0.png')
        # pointer at top-left: all frogs should look that way
        await pg.mouse.move(20,20); await pg.wait_for_timeout(400); await pg.screenshot(path='live_ptr.png')
        # force a big grin + blink on some
        await pg.evaluate("()=>{FACE.forEach((F,i)=>{F.smile=F.smileT=i%2?1:.4;F.nextSmile=performance.now()+9e9});FACE[2].blinkStart=performance.now()-80;FACE[2].nextBlink=performance.now()+9e9}")
        await pg.mouse.move(1000,880); await pg.wait_for_timeout(120); await pg.screenshot(path='live_grin.png')
        print('loop running',await pg.evaluate("faceRaf>0"),errs)
        await b.close()
asyncio.run(main())
