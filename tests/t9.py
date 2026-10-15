import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1100,'height':700})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(2)')
        await pg.evaluate("()=>{for(let n=0;n<60*5;n++)update(1/60)}")
        r=await pg.evaluate("""()=>{const P=G.player;const q=G.T.pts[P.idx];P.a=Math.atan2(q.ny,q.nx);P.speed=620;P.vx=Math.cos(P.a)*620;P.vy=Math.sin(P.a)*620;const t0=lastOof;for(let i=0;i<30;i++)update(1/60);return [lastOof>t0,G.texts.map(t=>t.s)]}""")
        print(r,errs)
        await pg.wait_for_timeout(200); await pg.screenshot(path='o1.png')
        await b.close()
asyncio.run(main())
