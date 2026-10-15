import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':800,'height':600});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=TRACKS.findIndex(d=>d.n==='Tower Twister');opts.laps=1;newRace();G.cd=1.21;const T=G.T,P=G.player;
          for(const k of G.karts)if(!k.isP){k.x=1e6;k.y=1e6;k.speed=0}
          const rows=[];let n=0,launches=0,wasAir=false;
          while(n<60*40){if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;
            const h=T.hgt[P.idx];const climbing=h>30&&h<2900&&T.hgt[(P.idx+1)%TN]>h;
            if(P.air&&!wasAir&&climbing)launches++;wasAir=P.air;
            if(climbing)rows.push([n,P.idx,+kH(T,P).toFixed(1),+P.z.toFixed(1),P.air?1:0,P.speed|0,+(P.slope||0).toFixed(3)]);
            if(T.hgt[P.idx]>2900)break;}
          keys.arrowleft=keys.arrowright=keys.arrowdown=false;
          // frame-to-frame change in the height the kart is drawn at
          let maxJump=0,bigJumps=0;for(let i=1;i<rows.length;i++){const a=rows[i-1][2]+rows[i-1][3],b=rows[i][2]+rows[i][3];const d=Math.abs(b-a);maxJump=Math.max(maxJump,d);if(d>15)bigJumps++;}
          let gH=0;for(let i=1;i<rows.length;i++)gH=Math.max(gH,Math.abs(rows[i][2]-rows[i-1][2]));
          return {climbFrames:rows.length,launchesWhileClimbing:launches,airFrames:rows.filter(r=>r[4]).length,maxDrawnHeightStep:+maxJump.toFixed(1),maxGroundStep:+gH.toFixed(1),bigSteps:bigJumps,sample:rows.slice(200,240)}}""")
        s=r.pop('sample');print(json.dumps(r));
        for row in s[:40]: print(row)
        print('errors',errs); await b.close()
asyncio.run(main())
