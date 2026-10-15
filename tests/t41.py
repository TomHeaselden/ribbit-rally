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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(1)'); await pg.click('#trackGrid .card:nth-child(2)')
        await pg.evaluate("""()=>{G.paused=false;let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}G.cd=-2;
          const T=G.T,P=G.player;const ti=Math.floor(TN*.35),q=T.pts[ti];P.x=q.x;P.y=q.y;P.idx=ti;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;opts.autoGas=false;
          G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(ti+150+j*4)%TN,qq=T.pts[qi];k.x=qq.x;k.y=qq.y;k.idx=qi;k.speed=0;});
          const c=G.carp[0];const q2=T.pts[(ti+5)%TN];c.x=q2.x+q2.nx*60;c.y=q2.y+q2.ny*60;c.a=q2.a+Math.PI+.6;c.tx=c.x;c.ty=c.y;c.state='surface';c.t=99;c.rise=1;c.mouth=1;c.idx=(ti+5)%TN;
          const c2=G.carp[1];const q3=T.pts[(ti+9)%TN];c2.x=q3.x-q3.nx*120;c2.y=q3.y-q3.ny*120;c2.a=q3.a+1.2;c2.tx=c2.x+500;c2.ty=c2.y;c2.state='swim';c2.t=99;c2.rise=0;
          for(let i=0;i<5;i++){G.t+=1/60;updateFX(1/60);}render();G.paused=true;}""")
        await pg.wait_for_timeout(200); await pg.screenshot(path='k1.png',timeout=120000)
        # gulp and spit the player
        await pg.evaluate("""()=>{G.paused=false;const P=G.player,c=G.carp[0];P.x=c.x+Math.cos(c.a)*54;P.y=c.y+Math.sin(c.a)*54;P.spitCD=0;for(let i=0;i<3;i++)update(1/60);window._g=!!P.gulped;for(let i=0;i<25;i++)update(1/60);render();G.paused=true;window._z=P.z|0;}""")
        await pg.wait_for_timeout(200); await pg.screenshot(path='k2.png',timeout=120000)
        print('gulped',await pg.evaluate("window._g"),'height after spit',await pg.evaluate("window._z"),errs)
        await b.close()
asyncio.run(main())
