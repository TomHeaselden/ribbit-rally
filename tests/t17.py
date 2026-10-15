import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;const out=[];for(const ti of [3,25,45]){opts.track=ti;newRace();G.cd=1.21;for(let n=0;n<30;n++)update(1/60);
          const P=G.player;const res=[];
          // full-speed wall crash
          P.hp=100;P.inv=0;const q=G.T.pts[P.idx];P.a=Math.atan2(q.ny,q.nx);P.speed=620;P.vx=Math.cos(P.a)*620;P.vy=Math.sin(P.a)*620;for(let i=0;i<20;i++)update(1/60);res.push('wall -'+(100-Math.round(P.hp)));
          P.hp=100;P.inv=0;P.shield=0;P.ko=0;hitKart(P,'spin',25);res.push('bubble -'+(100-Math.round(P.hp)));
          const o=G.karts.find(k=>!k.isP);o.hp=100;o.inv=0;o.shield=0;hitKart(o,'spin',30);res.push('rival fly -'+(100-Math.round(o.hp)));
          out.push('L'+G.T.lvl+' '+TRACKS[ti].n+': '+res.join(', '));G.over=true;}return out}""")
        for x in r: print(x)
        print(errs)
        await b.close()
asyncio.run(main())
