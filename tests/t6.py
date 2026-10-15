import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        r=await pg.evaluate("""()=>{const out=[];for(let i=0;i<TRACKS.length;i++){const T=getTrack(i);const t0=performance.now();const m=buildWorld3D(T);out.push([TRACKS[i].n,m.n,Math.round(performance.now()-t0)])}return [out,Object.entries(GL3.meshes).map(([k,v])=>[k,v.n])]}""")
        for x in r[0]: print(x)
        print(r[1])
        await b.close()
asyncio.run(main())
