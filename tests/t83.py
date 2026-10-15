import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1200,'height':800})
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{const out=[];for(const lv of [1,2,3,4,1,2,3,4]){opts.level=lv;const t0=performance.now();renderTrackSel();out.push('L'+lv+' '+(performance.now()-t0|0)+'ms');}return out.join(', ')}""")
        print(r); await b.close()
asyncio.run(main())
