import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for vw,vh,nm in [(1280,760,'r'),(400,820,'rm')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh})
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(PAGE); await pg.wait_for_timeout(500)
            await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.wait_for_timeout(200)
            await pg.click('#oRev button[data-v="moto"]'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=nm+'0.png',timeout=120000)
            ow=await pg.evaluate("document.documentElement.scrollWidth>innerWidth||document.querySelector('#sTrack').scrollWidth>innerWidth")
            print(nm,'style',await pg.evaluate("opts.revStyle"),'overflow',ow,errs)
            if nm=='r':
                await pg.click('#trackGrid .card:nth-child(2)')
                await pg.evaluate("""()=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}G.cd=-2;G.paused=true;
                  const T=G.T,P=G.player;const ti=Math.floor(TN*.35),q=T.pts[ti];P.x=q.x;P.y=q.y;P.idx=ti;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;
                  G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ti+150+j*4)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;k.speed=0;});
                  const c=G.carp[0];const q2=T.pts[(ti+9)%TN];c.x=q2.x+q2.nx*90;c.y=q2.y+q2.ny*90;c.a=q2.a+Math.PI+.7;c.tx=c.x;c.ty=c.y;c.state='surface';c.t=99;c.rise=1;c.mouth=1;
                  const c2=G.carp[1];const q3=T.pts[(ti+6)%TN];c2.x=q3.x-q3.nx*150;c2.y=q3.y-q3.ny*150;c2.a=q3.a+1.3;c2.tx=c2.x+900;c2.ty=c2.y;c2.state='swim';c2.t=99;c2.rise=0;
                  for(let i=0;i<5;i++){G.t+=1/60;updateFX(1/60);}render();}""")
                await pg.wait_for_timeout(200); await pg.screenshot(path='bigcarp.png',timeout=120000)
            await pg.close()
        await b.close()
asyncio.run(main())
