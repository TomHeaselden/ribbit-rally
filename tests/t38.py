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
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(3)'); await pg.wait_for_timeout(300); await pg.screenshot(path='x0.png',timeout=120000)
        await pg.click('#trackGrid .card:nth-child(4)')
        for name,kind in [('x1','spr'),('x2','bug'),('x3','open')]:
            await pg.evaluate("""(kind)=>{G.paused=false;let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}
              const T=G.T,P=G.player;let ti;if(kind==='spr'){ti=T.spinners[0].i-4}else if(kind==='bug'){ti=T.bumpers[1].i-4}else{ti=Math.floor(TN*.3)}
              ti=(ti+TN)%TN;const q=T.pts[ti];P.x=q.x;P.y=q.y;P.idx=ti;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;P.inv=5;
              G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ti+(kind==='open'?5+j*3:200+j*4))%TN,qq=T.pts[qi];k.x=qq.x+qq.nx*(j%2?60:-60);k.y=qq.y+qq.ny*(j%2?60:-60);k.idx=qi;k.a=qq.a;k.speed=kind==='open'?500:0;k.vx=k.vy=0;});
              G.cd=-2;for(let i=0;i<20;i++){G.t+=1/60;updateFX(1/60);}render();G.paused=true;}""",kind)
            await pg.wait_for_timeout(200); await pg.screenshot(path=name+'.png',timeout=120000)
        print(errs)
        await b.close()
asyncio.run(main())
