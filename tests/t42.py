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
        r=await pg.evaluate("""()=>{GL3.ok=false;const out=[];for(const ti of [3,25,45,65,81]){opts.track=ti;newRace();G.cd=1.21;let gulps=0,surf=0;const os=spitOut;spitOut=function(c,k){gulps++;return os(c,k)};
          let n=0;while(n<60*300){const P=G.player;if(P.ko<=0&&!P.gulped)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;for(const c of G.carp)if(c.state==='surface'&&c.t>1.88)surf++;if(G.karts.every(k=>k.fin))break;}
          spitOut=os;out.push(TRACKS[ti].n+': all finished '+G.karts.every(k=>k.fin)+' in '+(n/60|0)+'s, carp '+G.carp.length+', pop-ups '+surf+', gulp-and-spits '+gulps);G.over=true;}return out}""")
        print('\n'.join(r));print(errs)
        await b.close()
asyncio.run(main())
