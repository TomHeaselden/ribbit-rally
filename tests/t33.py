import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{const o={};for(let i=0;i<TRACKS.length;i++){const T=getTrack(i);const n=T.pads.filter(p=>p.fs).length;o[T.lvl]=o[T.lvl]||[];o[T.lvl].push(n);}return o}""")
        for k,v in r.items(): print('L'+k,'final-straight pads per track:',min(v),'-',max(v))
        await b.close()
asyncio.run(main())
