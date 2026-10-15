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
        await pg.click('#bPlay'); await pg.click('#bToTracks'); await pg.click('#levelTabs .lvl:nth-child(2)'); await pg.click('#trackGrid .card:nth-child(3)')
        # freeze real-time loop, step manually to chosen countdown moments
        await pg.evaluate("()=>{G.paused=true;}")
        for name,target in [('c1',4.4),('c2',2.2),('c3',1.15)]:
            await pg.evaluate("""(tg)=>{G.paused=false;let n=0;while(G.cd>tg&&n<1000){update(1/60);n++;}
              if(tg>1.5){G.revT=0;update(1/60);for(let i=0;i<20;i++)update(1/60);}
              for(let i=0;i<4;i++)spawnFlyer();for(const f of G.flyers)if(f.t<.2){f.t=f.dur*.45;f.x+=f.vx*f.dur*.45;f.y+=f.vy*f.dur*.45;}
              render();G.paused=true;}""",target)
            await pg.wait_for_timeout(200); await pg.screenshot(path=name+'.png',timeout=120000)
        print(await pg.evaluate("[G.fire.length,G.flyers.length,G.state]"),errs)
        await b.close()
asyncio.run(main())
