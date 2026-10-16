import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
SP=''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':720});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.evaluate("""opts.players=1;opts.track=0;startRace();G.cd=1.21;const P=G.player;for(let i=0;i<200;i++){aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);}
          P.a=G.T.pts[P.idx].a+Math.PI;for(let i=0;i<130;i++){const d=angDiff(P.a,G.T.pts[P.idx].a+Math.PI);keys.arrowleft=d<-.05;keys.arrowright=d>.05;update(1/60);}keys.arrowleft=keys.arrowright=false;render();""")
        await pg.wait_for_timeout(200); await pg.screenshot(path=SP+'reset_count.png')
        await pg.evaluate("const P=G.player;for(let i=0;i<70;i++){const d=angDiff(P.a,G.T.pts[P.idx].a+Math.PI);keys.arrowleft=d<-.05;keys.arrowright=d>.05;update(1/60);}keys.arrowleft=keys.arrowright=false;for(let i=0;i<12;i++)update(1/60);render()")
        await pg.wait_for_timeout(200); await pg.screenshot(path=SP+'reset_done.png')
        print('errors',errs); await b.close()
asyncio.run(main())
