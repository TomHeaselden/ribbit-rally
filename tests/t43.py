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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(1)'); await pg.click('#trackGrid .card:nth-child(1)')
        await pg.evaluate("""()=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}G.cd=-2;G.paused=true;
          const T=G.T,P=G.player;const ti=Math.floor(TN*.4),q=T.pts[ti];P.x=q.x;P.y=q.y;P.idx=ti;P.a=q.a;G.camYaw=q.a;P.speed=0;P.vx=P.vy=0;opts.autoGas=false;
          G.carp.forEach(c=>{c.x+=99999});
          const R=G.karts.filter(k=>!k.isP);R.forEach((k,j)=>{const qi=(ti+(j===0?9:150+j*4))%TN,qq=T.pts[qi];k.x=qq.x+(j===0?qq.nx*30:0);k.y=qq.y+(j===0?qq.ny*30:0);k.idx=qi;k.a=qq.a;k.speed=j===0?120:0;k.vx=k.vy=0;k.shield=0;k.star=0;k.inv=0;});
          window._r=R[0];P.item='tongue';}""")
        await pg.evaluate("()=>{useItem(G.player);G.paused=false;for(let i=0;i<20;i++)update(1/60);render();G.paused=true;}")
        await pg.wait_for_timeout(150); await pg.screenshot(path='tg1.png',timeout=120000)
        await pg.evaluate("()=>{useItem(G.player);G.paused=false;for(let i=0;i<9;i++)update(1/60);render();G.paused=true;window._mid=JSON.stringify({phase:G.player.tng&&G.player.tng.phase})}")
        await pg.wait_for_timeout(150); await pg.screenshot(path='tg2.png',timeout=120000)
        r=await pg.evaluate("()=>{G.paused=false;for(let i=0;i<12;i++)update(1/60);render();G.paused=true;return {mid:window._mid,spin:window._r.spin.toFixed(2),hp:window._r.hp|0,tongueT:G.player.tongueT.toFixed(1),item:G.player.item}}")
        await pg.wait_for_timeout(150); await pg.screenshot(path='tg3.png',timeout=120000)
        print(r,errs)
        await b.close()
asyncio.run(main())
