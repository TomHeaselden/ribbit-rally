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
        r=await pg.evaluate("""()=>{GL3.ok=false;const out=[];for(const ti of [3,25,45,65]){opts.track=ti;opts.laps=3;newRace();G.cd=1.21;let gp=0,gr=0;const os=spitOut;spitOut=function(c,k){if(k.isP)gp++;else gr++;return os(c,k)};
          let n=0;while(n<60*300){const P=G.player,T=G.T;if(P.ko<=0&&!P.gulped){const q=T.pts[(P.idx+8)%TN];const da=angDiff(P.a,Math.atan2(q.y-P.y,q.x-P.x));keys.arrowleft=da<-.08;keys.arrowright=da>.08;}
            update(1/60);n++;if(G.karts.every(k=>k.fin))break;}
          keys.arrowleft=keys.arrowright=false;spitOut=os;out.push(TRACKS[ti].n+': finished '+G.karts.filter(k=>k.fin).length+'/8 in '+(n/60|0)+'s, you gulped '+gp+'x, rivals gulped '+gr+'x');G.over=true;}return out}""")
        print('\n'.join(r),errs)
        await b.close()
asyncio.run(main())
