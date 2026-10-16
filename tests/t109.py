import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
# two human players driven by the AI through their own keys: P1 = A/D/S, P2 = arrow keys
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300); await pg.evaluate('window.F1=2;window.F2=1')
        r=await pg.evaluate("""(tracks)=>{GL3.ok=false;const out=[];for(const ti of tracks){
          opts.track=ti;opts.laps=2;opts.players=2;opts.frog=+(window.F1??1);opts.frog2=+(window.F2??2);newRace();G.cd=1.21;let n=0,firstFin=null,waitSeen=0;
          const P1=G.players[0],P2=G.players[1];
          while(n<60*300){for(const P of G.players)if(P.ko<=0)aiControl(P,1/60);
            keys.a=P1._s<-.25;keys.d=P1._s>.25;keys.s=!!P1._b;keys.arrowleft=P2._s<-.25;keys.arrowright=P2._s>.25;keys.arrowdown=!!P2._b;
            if(n===600){P2.speed*=0.2}   // slow P2 down once so the finishes are apart
            update(1/60);n++;if(G.waitT&&!waitSeen)waitSeen=G.waitT;if(G.over)break;}
          for(const k of ['a','d','s','arrowleft','arrowright','arrowdown'])keys[k]=false;
          out.push([ti,TRACKS[ti].n,'over '+G.over,'t '+(n/60|0),'P1 '+P1.f.name+' fin '+P1.fin+' place '+P1.place+' '+(P1.ft|0),'P2 '+P2.f.name+' fin '+P2.fin+' place '+P2.place+' '+(P2.ft|0),'cams differ '+(P1.vs.cam!==P2.vs.cam),'engines '+ENGS.length,
            document.querySelector('#rTitle').textContent,document.querySelector('#rSub').textContent,[...document.querySelectorAll('#standings li.me')].map(l=>l.textContent).join(' | ')]);G.over=true;}return out}""",[int(x) for x in sys.argv[1:]])
        for x in r: print(x)
        print(errs[:3])
        await b.close()
asyncio.run(main())
