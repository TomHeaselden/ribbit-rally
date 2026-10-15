import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(tracks)=>{GL3.ok=false;const out=[];const orig=damage;for(const ti of tracks){const st={wall:0,spin:0,bump:0,item:0,dmg:0};
          damage=function(k,amt,why){const s=new Error().stack;if(why==="wall")st.wall++;else st.item++;return orig(k,amt,why)};
          opts.track=ti;opts.laps=3;newRace();G.cd=1.21;let n=0;
          while(n<60*300){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;if(G.karts.every(k=>k.fin))break;}
          keys.arrowleft=keys.arrowright=keys.arrowdown=false;
          const T=G.T;out.push([ti,TRACKS[ti].n,'fin '+G.karts.filter(k=>k.fin).length,'t '+(n/60|0),'KO '+G.karts.reduce((a,k)=>a+k.kos,0),JSON.stringify(st),'ftimes '+G.karts.filter(k=>k.fin).map(k=>k.ft|0).sort((a,b)=>a-b).join(','),'L '+(T.L|0)]);G.over=true;}damage=orig;return out}""",[int(x) for x in sys.argv[1:]])
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
