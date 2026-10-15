import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300)
        await pg.locator('#frogGrid > :nth-child(3)').screenshot(path='bonk_card.png')
        await pg.evaluate("opts.frog=2;saveOpts()"); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(1)')
        await pg.evaluate("()=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}for(let i=0;i<40;i++)update(1/60);G.paused=true;render()}")
        await pg.wait_for_timeout(200); await pg.screenshot(path='bonk_behind.png',clip={'x':300,'y':330,'width':500,'height':420})
        for nm,orb in [('bonk_side',Math.pi/2 if False else 1.75),('bonk_front',0.35)]:
            await pg.evaluate(f"()=>{{G.paused=false;G.cd=-2;for(const k of G.karts)if(!k.isP){{k.x=1e6;k.y=1e6}}G.camOrbit={orb};for(let i=0;i<30;i++){{G.player.speed=0;update(1/60);G.camOrbit={orb}}}G.paused=true;render()}}")
            await pg.wait_for_timeout(200); await pg.screenshot(path=nm+'.png',clip={'x':250,'y':250,'width':600,'height':500})
        print(errs); await b.close()
import math
Math=math
asyncio.run(main())
