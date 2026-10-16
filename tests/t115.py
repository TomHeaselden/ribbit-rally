import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
# back on track after 3 seconds: wrong way, spun out and stopped, stuck against the bank; and no resets in normal racing
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':800,'height':600});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(()=>{GL3.ok=false;const out={};let resc=[];const orig=rescueKart;rescueKart=k=>{resc.push([k.isP,+(G.raceT).toFixed(2),(k.lostT||0).toFixed(1),(k._stuck||0).toFixed(1),k.spin.toFixed(1),Math.round(k.speed)]);orig(k)};
          const steerTo=(P,want)=>{const d=angDiff(P.a,want);keys.arrowleft=d<-.05;keys.arrowright=d>.05;};
          const start=()=>{opts.track=0;opts.laps=3;opts.players=1;newRace();G.cd=1.21;const P0=G.player;for(let i=0;i<240;i++){aiControl(P0,1/60);keys.arrowleft=P0._s<-.25;keys.arrowright=P0._s>.25;update(1/60);}keys.arrowleft=keys.arrowright=false;resc=[];const P=G.player;P.a=G.T.pts[P.idx].a;P.lostT=0;P._stuck=0;P._rp=P.prog;P._rpT=0;P.spin=0;return P};
          const face=P=>Math.cos(angDiff(P.a,G.T.pts[P.idx].a)).toFixed(2);
          // 1: turned round and driving the wrong way
          let P=start();P.a=G.T.pts[P.idx].a+Math.PI;const t0=G.raceT;let n=0;while(n<400&&!resc.length){steerTo(P,G.T.pts[P.idx].a+Math.PI);update(1/60);n++}keys.arrowleft=keys.arrowright=false;
          out.wrongWay={resetAfter:(G.raceT-t0).toFixed(2),facing:face(P),onTrack:Math.abs(P._lat)<G.T.w/2};
          // 2: spun out, then left stopped facing backwards (holding brake)
          P=start();hitKart(P,'spin');const t1=G.raceT;n=0;while(P.spin>0){update(1/60);n++}P.a=G.T.pts[P.idx].a+Math.PI;keys.arrowdown=true;while(n<400&&!resc.length){update(1/60);n++}keys.arrowdown=false;
          out.spunOut={resetAfter:(G.raceT-t1).toFixed(2),facing:face(P)};
          // 3: stopped sideways against the bank
          P=start();{const q=G.T.pts[P.idx];P.a=q.a+Math.PI/2;P.x=q.x+q.nx*(G.T.w/2-20);P.y=q.y+q.ny*(G.T.w/2-20);}const t2=G.raceT;n=0;keys.arrowdown=true;while(n<400&&!resc.length){update(1/60);n++}keys.arrowdown=false;
          out.stuck={resetAfter:(G.raceT-t2).toFixed(2),facing:face(P)};
          // 4: normal racing with the autopilot: should never need a reset
          const tally={};for(const ti of [0,12,30,50,64,80]){opts.track=ti;newRace();G.cd=1.21;resc=[];P=G.player;n=0;while(n<60*200&&!P.fin){aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++}
            keys.arrowleft=keys.arrowright=keys.arrowdown=false;tally[TRACKS[ti].n]=[JSON.stringify(resc.filter(x=>x[0])),P.fin?'fin '+P.place:'not fin',Math.round(G.raceT)];}
          out.normal=tally;rescueKart=orig;return out})()""")
        for k,v in r.items(): print(k,v)
        print('errors',errs); await b.close()
asyncio.run(main())
