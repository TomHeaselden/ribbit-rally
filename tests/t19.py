import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(4)'); await pg.wait_for_timeout(300); await pg.screenshot(path='q0.png')
        await pg.click('#trackGrid .card:nth-child(1)')
        for i,(off) in enumerate([0,1,2]):
            await pg.evaluate("""(n)=>{for(let k=0;k<60*4;k++)update(1/60);G.cd=-2;const T=G.T,P=G.player;opts.autoGas=false;
              // find spot: n=0 top of a hill looking down, n=1 bottom looking up, n=2 mid-jump on a pad
              let best=0;if(n===2){const pd=T.pads[1];best=(pd.i+2)%TN;}else{let bv=n===0?-1:1e9;for(let i=40;i<TN-40;i++){const h=T.hgt[i];const ahead=T.hgt[(i+12)%TN]-h;if(n===0&&ahead<-120&&h>bv){bv=h;best=i}if(n===1&&ahead>120&&h<bv){bv=h;best=i}}}
              const q=T.pts[best];P.x=q.x;P.y=q.y;P.idx=best;P.a=q.a;G.camYaw=q.a;P.speed=n===2?500:0;P.vx=Math.cos(q.a)*P.speed;P.vy=Math.sin(q.a)*P.speed;P.z=n===2?40:0;P.vz=n===2?100:0;
              G.karts.filter(k=>!k.isP).forEach((k,j)=>{const qi=(best+6+j*3)%TN,qq=T.pts[qi];k.x=qq.x+qq.nx*(j%2?40:-40);k.y=qq.y+qq.ny*(j%2?40:-40);k.idx=qi;k.a=qq.a;k.speed=0;k.vx=k.vy=0;});
              for(let k=0;k<3;k++)update(1/60);}""",off)
            await pg.wait_for_timeout(1300); await pg.screenshot(path=f'q{i+1}.png')
        print(errs)
        await b.close()
asyncio.run(main())
