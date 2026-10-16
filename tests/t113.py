import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
SP=''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':720});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(600)
        await pg.evaluate("opts.players=1;opts.frog=0;opts.track=0;opts.laps=3;startRace();G.cd=1.21;for(let i=0;i<30;i++)update(1/60)")
        # drive with the AI until a swell is about 500 units ahead, with every swell made big for the photo
        r=await pg.evaluate("""(()=>{const P=G.player,T=G.T,L=T.cum[TN];for(const w of G.swells)w.A=8;let n=0;
          const ahead=()=>{const s=trackS(T,P);let best=1e9;for(const w of G.swells){if(w.a<4)continue;let d=w.s-s;d=((d%L)+L)%L;best=Math.min(best,d)}return best};
          while(n<2400){aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;const d=ahead();if(d>420&&d<480&&n>200)break;}
          keys.arrowleft=keys.arrowright=false;return [n,Math.round(ahead()),Math.round(P.speed)]})()""")
        print('setup',r)
        await pg.evaluate("render()"); await pg.wait_for_timeout(300); await pg.screenshot(path=SP+'swell_ahead.png')
        # boost into it and catch the hop
        r=await pg.evaluate("""(()=>{const P=G.player;P.boost=2;let n=0,best=0,shot=null;while(n<400){aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;if(P.sAir&&P.sz>best){best=P.sz}if(P.sAir&&P.sz>4&&P.svy<20)break;}
          keys.arrowleft=keys.arrowright=false;return [n,P.sAir,P.sz.toFixed(1),Math.round(P.speed)]})()""")
        print('hop',r)
        await pg.evaluate("render()"); await pg.wait_for_timeout(300); await pg.screenshot(path=SP+'swell_air.png')
        print('errors',errs); await b.close()
asyncio.run(main())
