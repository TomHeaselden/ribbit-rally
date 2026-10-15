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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(1)'); await pg.click('#trackGrid .card:nth-child(2)')
        await pg.evaluate("""()=>{for(let n=0;n<60*5;n++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;P.speed=0;P.vx=P.vy=0;const ni=P.idx;
          for(const [o,l,v] of [[5,-30,0],[9,40,1],[14,-10,2]]){const q=T.pts[(ni+o)%TN];G.puddles.push({x:q.x+q.nx*l,y:q.y+q.ny*l,i:(ni+o)%TN,lat:l,r:28,life:12,grow:1,rot:o,v});}
          for(const [o,c,side] of [[7,0,1],[10,1,-1],[13,2,1]]){const q=T.pts[(ni+o)%TN];G.birds.push({x:q.x+q.nx*side*60,y:q.y+q.ny*side*60,tx:0,ty:0,vx:Math.cos(q.a+side*1.4)*520,vy:Math.sin(q.a+side*1.4)*520,life:3,dropped:true,c,ph:o,ti:(ni+o)%TN,lat:0});}
          const q2=T.pts[(ni+4)%TN];G.poos.push({x:q2.x+q2.nx*30,y:q2.y+q2.ny*30,h:60,vh:0,i:(ni+4)%TN,lat:30});
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ni+150+j*5)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;});G.birdT=99;}""")
        await pg.wait_for_timeout(900); await pg.screenshot(path='u1.png')
        print(errs)
        await b.close()
asyncio.run(main())
