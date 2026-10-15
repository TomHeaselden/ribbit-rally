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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(1)')
        await pg.screenshot(path='f0.png',timeout=120000)
        await pg.click('#trackGrid .card:nth-child(2)')
        await pg.evaluate("""()=>{for(let n=0;n<60*5;n++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;const fp=T.pads.filter(p=>p.fs);const ni=(fp[0].i-6+TN)%TN,q=T.pts[ni];
          P.x=q.x;P.y=q.y;P.idx=ni;P.prog=ni;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ni+200+j*4)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;k.speed=0;k.vx=k.vy=0;});}""")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='f1.png',timeout=120000)
        print(errs)
        await b.close()
asyncio.run(main())
