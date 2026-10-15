import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1200,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(100)
        await pg.evaluate("""()=>{window.LOG=[];const ps=playStep;window.playStep=function(S,step,t,sd){LOG.push([AC.currentTime,t,sd]);return ps(S,step,t,sd)}}""")
        await pg.click('#bPlay'); await pg.wait_for_timeout(150); await pg.click('#bToTracks')
        cached=await pg.evaluate("Object.keys(trackCache).length")
        for lv in [4,3,2,4,1,3]:
            await pg.click(f'#levelTabs button:nth-child({lv})'); await pg.wait_for_timeout(250)
        await pg.wait_for_timeout(4000)
        for lv in [2,4,1,3]:
            await pg.click(f'#levelTabs button:nth-child({lv})'); await pg.wait_for_timeout(150)
        r=await pg.evaluate("""()=>{let skips=0,late=0,worst=0;for(let i=1;i<LOG.length;i++){const [now,t,sd]=LOG[i];const gap=t-LOG[i-1][1];if(gap>sd*1.05)skips++;if(t<now)late++;worst=Math.max(worst,now-t)}
            return {steps:LOG.length,skips,late,cards:trackGrid.children.length,built:Object.keys(trackCache).length+'/'+TRACKS.length}}""")
        print('cached at start',cached,r,'errors',errs); await b.close()
asyncio.run(main())
