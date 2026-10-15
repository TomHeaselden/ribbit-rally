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
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=81;newRace();G.cd=1.21;const hist={};const orig=damage;let air=0,tot=0;
          damage=function(k,amt,why){if(why==='wall'&&!k.isP){const b=Math.floor(k.idx/20)*20;hist[b]=(hist[b]||0)+1;tot++;if(k.air||k.z>0)air++;}return orig(k,amt,why)};
          let n=0;while(n<60*200){const P=G.player;if(P.ko<=0)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;update(1/60);n++;if(G.karts.every(k=>k.fin))break;}
          damage=orig;const T=G.T;const rows=Object.entries(hist).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([i,c])=>{i=+i;let mc=0;for(let j=i;j<i+20;j++)mc=Math.max(mc,T.curv[j%TN]);let sl=0;for(let j=i;j<i+20;j++)sl=Math.min(sl,(T.hgt[(j+1)%TN]-T.hgt[j])/(T.L/TN));return 'idx '+i+'-'+(i+19)+': '+c+' hits, tightest radius '+(1/mc|0)+', steepest drop '+(sl*100|0)+'%'});
          return {tot,air,rows}}""")
        print(r['tot'],'wall hits,',r['air'],'while airborne');print('\n'.join(r['rows']))
        await b.close()
asyncio.run(main())
