import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for vp,nm in [({'width':1100,'height':900},'desk'),({'width':390,'height':844},'phone')]:
            pg=await b.new_page(viewport=vp,device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(PAGE); await pg.wait_for_timeout(500)
            await pg.click('#bPlay'); await pg.wait_for_timeout(300)
            box=await pg.evaluate("(()=>{const r=frogGrid.children[5].getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
            await pg.evaluate(f"window.scrollTo(0,{box[1]}-100)"); await pg.wait_for_timeout(200)
            box=await pg.evaluate("(()=>{const r=frogGrid.children[5].getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
            await pg.screenshot(path=f'dm_card_{nm}.png',clip={'x':max(0,box[0]-10),'y':max(0,box[1]-10),'width':box[2]+20,'height':box[3]+20})
            if nm=='desk':
                await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(1)')
                await pg.evaluate("()=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}const P=G.player,D=G.karts.find(k=>k.fi===5);const q=G.T.pts[(P.idx+6)%G.T.pts.length];D.x=q.x+q.nx*40;D.y=q.y+q.ny*40;D.a=q.a;G.paused=true;render()}")
                await pg.wait_for_timeout(200); await pg.screenshot(path='dm_race.png',clip={'x':250,'y':200,'width':600,'height':400})
                await pg.evaluate("()=>{G.paused=false;const D=G.karts.find(k=>k.fi===5);for(const k of G.karts){k.fin=true;k.ft=60+k.fi}G.finishOrder=[D,...G.karts.filter(k=>k!==D)];showResults()}")
                await pg.wait_for_timeout(800); await pg.screenshot(path='dm_results.png')
            print(nm,errs); await pg.close()
        await b.close()
asyncio.run(main())
