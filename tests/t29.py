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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(4)'); await pg.click('#trackGrid .card:nth-child(9)')
        await pg.evaluate("""()=>{for(let n=0;n<60*5;n++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;
          // find a low road point with a much higher road close beside it
          let best=0,bv=0;for(let i=0;i<TN;i++){for(let j=0;j<TN;j++){const g=Math.min(Math.abs(i-j),TN-Math.abs(i-j));if(g<20)continue;const dd=Math.hypot(T.pts[i].x-T.pts[j].x,T.pts[i].y-T.pts[j].y);if(dd<T.w+700){const dh=T.hgt[j]-T.hgt[i];if(dh>bv){bv=dh;best=i}}}}
          const ni=(best-6+TN)%TN,q=T.pts[ni];P.x=q.x;P.y=q.y;P.idx=ni;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;P.air=false;P._g0=undefined;P.gvp=undefined;
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ni+200+j*3)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;k._g0=undefined;k.gvp=undefined;k.air=false;k.speed=0;k.vx=k.vy=0;});window._dh=bv;}""")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='g1.png',timeout=120000)
        print('height difference beside road',await pg.evaluate("window._dh|0"),errs)
        await b.close()
asyncio.run(main())
