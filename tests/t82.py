import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':800,'height':600});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;const res=[];for(const mode of ['alone-steer','rub-side','rear-end']){opts.track=0;newRace();G.cd=1.21;update(1/60);const P=G.player,T=G.T;
            for(const k of G.karts)if(!k.isP){k.x=1e6;k.y=1e6;k.speed=0;}  // park the rivals far away
            const q=T.pts[P.idx];P.x=q.x;P.y=q.y;P.a=q.a;P.speed=P.maxS;P.vx=Math.cos(P.a)*P.speed;P.vy=Math.sin(P.a)*P.speed;
            const R=G.karts.find(k=>!k.isP);if(!mode.startsWith('alone')){R.a=q.a;R.speed=mode==='rear-end'?P.maxS*.8:P.maxS;const off=mode==='rub-side'?30:0,fw=mode==='rear-end'?45:0;R.x=q.x+q.nx*off+q.tx*fw;R.y=q.y+q.ny*off+q.ty*fw;R.vx=Math.cos(R.a)*R.speed;R.vy=Math.sin(R.a)*R.speed;R.ai.off=0.05;}
            let minS=1e9,touch=0;for(let i=0;i<90;i++){keys.arrowright=(mode==='rub-side'||mode==='alone-steer')&&i%12<3&&i<60;update(1/60);minS=Math.min(minS,P.speed);if(!mode.startsWith('alone')&&Math.hypot(R.x-P.x,R.y-P.y)<40)touch++;}
            keys.arrowright=false;res.push(mode+': lowest speed '+(minS|0)+' / max '+(P.maxS|0)+', frames touching '+touch+', prog '+P.prog.toFixed(1));G.over=true;}return res}""")
        print('\n'.join(r)); print(errs); await b.close()
asyncio.run(main())
