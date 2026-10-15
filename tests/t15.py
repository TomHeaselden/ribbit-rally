import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600})
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(ti)=>{GL3.ok=false;opts.track=ti;opts.laps=3;newRace();G.cd=1.21;const hist={};
          for(let n=1;n<=60*300;n++){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);
            if(n%60===0)for(const k of G.karts){if(k.fin)continue;const h=hist[k.f.name]=hist[k.f.name]||[];h.push(k.prog)}}
          const T=G.T;const out=[];for(const k of G.karts){if(k.fin)continue;const h=hist[k.f.name];const st=h.length>20?h[h.length-1]-h[h.length-21]:0;
            const q=T.pts[k.idx];out.push([k.f.name,'prog',(k.prog/TN).toFixed(2),'moved last20s',st,'idx',k.idx,'lat',Math.round(k._lat),'w',T.w,'spd',k.speed|0,'a-diff',Math.round(angDiff(q.a,k.a)*57),'ko',k.ko.toFixed(1),'spin',k.spin.toFixed(1),'near bumper',T.bumpers.filter(b=>Math.abs(b.i-k.idx)<4).map(b=>b.lat|0).join('/'),'near spinner',T.spinners.filter(s=>Math.abs(s.i-k.idx)<6).length,'curv',T.curv[k.idx].toFixed(4)])}
          return out}""",int(sys.argv[1]))
        for x in r: print(x)
        await b.close()
asyncio.run(main())
