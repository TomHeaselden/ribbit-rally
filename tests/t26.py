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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(4)')
        await pg.evaluate("document.querySelector('#trackGrid').lastChild.scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300); await pg.screenshot(path='d0.png',timeout=120000)
        await pg.click('#trackGrid .card:last-child')
        await pg.evaluate("""()=>{for(let n=0;n<60*5;n++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;
          // drop the player at the start of the wiggly chicane section: find the region of highest curvature
          let best=0,bv=0;for(let i=0;i<TN;i++){let s=0;for(let k=0;k<25;k++)s+=T.curv[(i+k)%TN];if(s>bv){bv=s;best=i}}
          const ni=(best-8+TN)%TN,q=T.pts[ni];P.x=q.x;P.y=q.y;P.idx=ni;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;P.air=false;P._g0=undefined;P.gvp=undefined;
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ni+4+j*3)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;k.a=qq.a;k.speed=0;k.vx=k.vy=0;k._g0=undefined;k.gvp=undefined;k.air=false;});}""")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='d1.png',timeout=120000)
        print(errs)
        await b.close()
asyncio.run(main())
