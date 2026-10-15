import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1000,'height':700});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(2)')
        r=await pg.evaluate("""()=>{const log=[];let g=G.gear;for(let i=0;i<60*25;i++){const P=G.player;if(G.state==='race'){aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;}update(1/60);if(G.gear!==g){log.push((G.raceT).toFixed(1)+'s:'+g+'>'+G.gear);g=G.gear}}keys.arrowleft=keys.arrowright=false;return [log.slice(0,14).join(' '),log.length,G.player.hp,G.player.kos,ENG.press.toFixed(2)]}""")
        print(r); print('errors',errs); await b.close()
asyncio.run(main())
