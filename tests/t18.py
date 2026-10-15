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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(2)'); await pg.click('#trackGrid .card:nth-child(4)')
        # set up a scene: bird overhead dropping ahead, puddle ahead, arm sweeper later
        await pg.evaluate("""()=>{for(let n=0;n<60*5;n++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;P.speed=0;
          const ni=(P.idx)%TN;const q=T.pts[(ni+14)%TN];G.puddles.push({x:q.x+q.nx*30,y:q.y+q.ny*30,i:(ni+14)%TN,lat:30,r:38,life:15,grow:1,rot:1});
          const q2=T.pts[(ni+8)%TN];G.poos.push({x:q2.x-q2.nx*35,y:q2.y-q2.ny*35,h:90,vh:0,i:(ni+8)%TN,lat:-35});
          const q3=T.pts[(ni+11)%TN];G.birds.push({x:q3.x,y:q3.y,tx:0,ty:0,vx:Math.cos(q3.a+1.5)*520,vy:Math.sin(q3.a+1.5)*520,life:3,dropped:true,c:1,ph:0,ti:0,lat:0});
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qq=T.pts[(ni+150+j*5)%TN];k.x=qq.x;k.y=qq.y;k.idx=(ni+150+j*5)%TN;});}""")
        await pg.wait_for_timeout(1200); await pg.screenshot(path='p1.png')
        # sweeper view
        await pg.evaluate("()=>{const T=G.T,sp=T.spinners[0],P=G.player;const ni=(sp.i-6+TN)%TN,q=T.pts[ni];P.x=q.x;P.y=q.y;P.idx=ni;P.a=q.a;G.camYaw=q.a;P.speed=0;G.birds=[];G.poos=[];}")
        await pg.wait_for_timeout(1200); await pg.screenshot(path='p2.png')
        print(errs)
        await b.close()
asyncio.run(main())
