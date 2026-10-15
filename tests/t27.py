import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>[61,70,81].map(i=>{const T=getTrack(i);const t0=performance.now();const m=buildWorld3D(T);return [TRACKS[i].n,m.n,(performance.now()-t0)|0,T.decos.length,(T.bb.maxX-T.bb.minX)|0]})""")
        print(r)
        await b.close()
asyncio.run(main())
