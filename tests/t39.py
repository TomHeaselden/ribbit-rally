import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;const out=[];for(const ti of [3,45]){opts.track=ti;newRace();G.cd=1.21;let bugs=0,spr=0;const oh=hitKart;
          hitKart=function(k,kind,d){if(kind==='poo'&&d===10)bugs++;return oh(k,kind,d)};const od=damage;damage=function(k,a,w){if(a===10&&k.spin>1)spr++;return od(k,a,w)};
          let n=0;while(n<60*240){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;if(G.karts.every(k=>k.fin))break;}
          hitKart=oh;damage=od;out.push(TRACKS[ti].n+': insect spin-outs '+bugs+', insects on track '+G.T.bumpers.length+', sprinklers '+G.T.spinners.length);G.over=true;}return out}""")
        print('\n'.join(r))
        await b.close()
asyncio.run(main())
