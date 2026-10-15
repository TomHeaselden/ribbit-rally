import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(400)
        for n,nm in [(0,'zippy'),(1,'lulu')]:
            box=await pg.evaluate(f"(()=>{{const r=frogGrid.children[{n}].getBoundingClientRect();return [r.left,r.top,r.width,r.height]}})()")
            await pg.screenshot(path=f'{nm}_card.png',clip={'x':box[0],'y':box[1],'width':box[2],'height':box[3]*.66})
        await pg.evaluate("opts.frog=1;saveOpts()"); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(1)')
        await pg.evaluate("()=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}G.cd=-2;G.camOrbit=2.2;const Z=G.karts.find(k=>k.fi===0);const P=G.player;if(Z){Z.x=P.x+Math.cos(P.a+1.2)*90;Z.y=P.y+Math.sin(P.a+1.2)*90;Z.a=P.a;}G.paused=true;render()}")
        await pg.wait_for_timeout(200); await pg.screenshot(path='lulu_zippy_race.png',clip={'x':200,'y':200,'width':700,'height':520})
        print(errs)
        await b.close()
asyncio.run(main())
