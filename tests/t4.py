import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1280,'height':800})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(600); await pg.screenshot(path='f1.png')
        await pg.click('#bPlay'); await pg.wait_for_timeout(200); await pg.screenshot(path='f2.png')
        await pg.click('#bToTracks'); await pg.evaluate("document.querySelector('#trackGrid').lastChild.scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path='f3.png')
        await pg.click('#trackGrid .card:nth-child(21)'); await pg.wait_for_timeout(4800)
        await pg.evaluate("()=>{G.karts.forEach(k=>k.item='bubble');}")
        await pg.wait_for_timeout(2500); await pg.screenshot(path='f4.png')
        # crash into wall test
        r=await pg.evaluate("""()=>{const P=G.player;const q=G.T.pts[P.idx];P.a=Math.atan2(q.ny,q.nx);P.speed=600;let hp0=P.hp;for(let i=0;i<60;i++)update(1/60);return [hp0,P.hp,P.ko]}""")
        print('wall',r)
        await pg.wait_for_timeout(300); await pg.screenshot(path='f5.png')
        r=await pg.evaluate("""()=>{const P=G.player;P.inv=0;P.ko=0;damage(P,200);return [P.hp,P.ko]}""")
        await pg.wait_for_timeout(500); await pg.screenshot(path='f6.png')
        r=await pg.evaluate("""()=>{let n=0;while(!G.over&&n<60*60*6){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;}keys.arrowleft=keys.arrowright=false;return [n/60,G.player.ft,G.karts.map(k=>[k.f.name,k.kos,Math.round(k.hp)])]}""")
        print(r,errs)
        await pg.wait_for_timeout(900); await pg.screenshot(path='f7.png')
        await b.close()
asyncio.run(main())
