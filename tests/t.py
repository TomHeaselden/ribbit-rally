import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+open('ribbit-rally.html').read()+'</body></html>'
    open('p.html','w').write(html)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for vw,vh,name in [(1280,800,'d'),(400,800,'m')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh})
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
            await pg.goto(PAGE); await pg.wait_for_timeout(800)
            await pg.screenshot(path=f'{name}1.png')
            await pg.click('#bPlay'); await pg.wait_for_timeout(200); await pg.screenshot(path=f'{name}2.png')
            await pg.click('#bToTracks'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{name}3.png')
            await pg.click('#trackGrid .card:nth-child(16)'); await pg.wait_for_timeout(1500); await pg.screenshot(path=f'{name}4.png')
            await pg.wait_for_timeout(3500)
            await pg.keyboard.down('ArrowLeft'); await pg.wait_for_timeout(300); await pg.keyboard.up('ArrowLeft')
            await pg.wait_for_timeout(2500); await pg.screenshot(path=f'{name}5.png')
            # simulate full race fast, with player as AI driver
            r=await pg.evaluate("""()=>{let n=0;const P=G.player;P.isP=false;const res=[];while(!G.over&&n<60*60*8){update(1/60);n++;}
              return {n,over:G.over,places:G.karts.map(k=>[k.f.name,k.fin,k.lap,Math.round(k.prog)]),proj:G.proj.length}}""")
            print(name,r); print('errors',errs)
            await pg.wait_for_timeout(500); await pg.screenshot(path=f'{name}6.png')
        await b.close()
asyncio.run(main())
