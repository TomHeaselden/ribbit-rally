import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for vw,vh,nm,tr in [(1280,760,'h',16),(400,820,'hm',8)]:
            pg=await b.new_page(viewport={'width':vw,'height':vh})
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(PAGE); await pg.wait_for_timeout(500)
            await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click(f'#trackGrid .card:nth-child({tr})')
            await pg.evaluate("""()=>{for(let n=0;n<60*14;n++){const P=G.player;aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);}G.karts.forEach(k=>{if(!k.isP)k.item='bubble'});G.player.item='fly';}""")
            await pg.wait_for_timeout(1200); await pg.screenshot(path=f'{nm}1.png')
            await pg.evaluate("()=>{const P=G.player;damage(P,40);hitKart(G.karts.find(k=>!k.isP&&k.place===P.place-1)||G.karts[0],'spin',30);P.shield=5}")
            await pg.wait_for_timeout(400); await pg.screenshot(path=f'{nm}2.png')
            r=await pg.evaluate("""()=>{let n=0;while(!G.over&&n<60*60*5){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;}keys.arrowleft=keys.arrowright=false;return [n/60,G.over]}""")
            print(nm,r,errs)
            await pg.wait_for_timeout(600); await pg.screenshot(path=f'{nm}3.png')
        await b.close()
asyncio.run(main())
