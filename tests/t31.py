import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300); await pg.evaluate('window.TT=52')
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=+(window.TT||81);newRace();G.cd=1.21;const ev=[];const orig=damage;
          damage=function(k,amt,why){if(why==='wall'&&!k.isP&&ev.length<12){const T=G.T;ev.push([k.f.name,'idx',k.idx,'speed',k.speed|0,'lat',k._lat|0,'half-width',T.w/2,'wig',k._wig,'gas',k._g,'brake',k._b,'steer',(k._s||0).toFixed(2),'spin',k.spin.toFixed(1),'dizzy',k.dizzy.toFixed(1),'heading-vs-road',Math.round(angDiff(T.pts[k.idx].a,k.a)*57)]);}return orig(k,amt,why)};
          let n=0;while(n<60*120){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;}
          damage=orig;return ev}""")
        for x in r: print(' '.join(map(str,x)))
        await b.close()
asyncio.run(main())
