import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':800,'height':600});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=TRACKS.findIndex(d=>d.n==='Tower Twister');opts.laps=1;newRace();G.cd=1.21;const T=G.T;
          const walls={},jumps=[],rescues=[];let maxH=0,air=0,maxSpd=0,minClimb=1e9,n=0;const orig=damage;damage=function(k,a,why){if(why==='wall'){const z=(k.idx/10|0)*10;walls[z]=(walls[z]||0)+1}return orig(k,a,why)};
          const last={};for(const k of G.karts)last[k.id]=k.idx;
          while(n<60*150){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;
            const before=G.karts.map(k=>[k.idx,k.ai&&k.ai.chk]);update(1/60);n++;
            G.karts.forEach((k,i)=>{let d=k.idx-before[i][0];if(d<-TN/2)d+=TN;if(d>TN/2)d-=TN;if(Math.abs(d)>6)jumps.push([k.f.name,before[i][0],k.idx]);});
            maxH=Math.max(maxH,kH(T,P)+P.z);if(P.air)air++;maxSpd=Math.max(maxSpd,P.speed);
            if(T.hgt[P.idx]>500&&T.hgt[P.idx]<2500&&(T.hgt[(P.idx+1)%TN]>T.hgt[P.idx]))minClimb=Math.min(minClimb,P.speed);
            if(G.karts.every(k=>k.fin))break;}
          keys.arrowleft=keys.arrowright=keys.arrowdown=false;damage=orig;
          const zones=Object.entries(walls).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([z,c])=>z+'(h'+Math.round(T.hgt[+z])+'):'+c);
          return {secs:(n/60)|0,fin:G.karts.filter(k=>k.fin).length,ftimes:G.karts.filter(k=>k.fin).map(k=>k.ft|0).sort((a,b)=>a-b),maxH:Math.round(maxH),airFrames:air,maxSpeed:maxSpd|0,minClimbSpeed:minClimb|0,wallZones:zones,idxJumps:jumps.slice(0,8),jumpCount:jumps.length}}""")
        for k,v in r.items(): print(k,':',v)
        print('errors',errs); await b.close()
asyncio.run(main())
