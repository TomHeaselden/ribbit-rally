import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(3)'); await pg.click('#trackGrid .card:nth-child(5)')
        await pg.evaluate("""()=>{for(let n=0;n<60*4;n++)update(1/60);const T=G.T;const sp=T.spinners[0];const P=G.player;const ni=(sp.i-7+TN)%TN;const q=T.pts[ni];P.x=q.x;P.y=q.y;P.idx=ni;P.prog=ni;P.a=q.a;G.camYaw=q.a;P.speed=200;
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(sp.i+120+j*6)%TN,qq=T.pts[qi];k.x=qq.x+qq.nx*(j%2?30:-30);k.y=qq.y+qq.ny*(j%2?30:-30);k.idx=qi;k.a=qq.a;});G.cd=-2;opts.autoGas=false;}""")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='s1.png')
        await pg.evaluate("()=>{const T=G.T;const bm=T.bumpers[3];const P=G.player;const ni=(bm.i-7+TN)%TN;const q=T.pts[ni];P.x=q.x;P.y=q.y;P.idx=ni;P.a=q.a;G.camYaw=q.a;P.speed=0;G.cd=-2;}")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='s2.png')
        print(errs)
        await b.close()
asyncio.run(main())
