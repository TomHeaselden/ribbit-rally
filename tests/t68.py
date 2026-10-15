import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{mouthSay('Zoom zoom! Catch me if you can!',.68);const tl=MOUTH.tl;const out=[];for(let t=0;t<tl.end;t+=.05){const now=MOUTH.start+t*1000;const tg=mouthTarget(now);out.push(Object.keys(VIS).find(k=>VIS[k]===tg)||'gap')}return [tl.end.toFixed(2),out.join(' ')]}""")
        print(r)
        await b.close()
asyncio.run(main())
