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
        r=await pg.evaluate("""async()=>{const SR=44100;const res=[];
          for(const plan of [[[0.2,'rev']],[[0.2,'pop']],[[0.2,'rev'],[0.55,'pop']],[[4.9,'pop'],[5.0,'pop']]]){const off=new OfflineAudioContext(1,SR*6|0,SR);sound=true;
            for(const [at,what] of plan){off.suspend(at).then(()=>{AC=off;REV_STYLES.jet[what](1);off.resume()});}
            const d=(await off.startRendering()).getChannelData(0);const bad=[];for(let i=0;i<d.length;i++)if(!isFinite(d[i]))bad.push(i);res.push([JSON.stringify(plan),bad.length,bad.length?(bad[0]/SR).toFixed(3)+'-'+(bad[bad.length-1]/SR).toFixed(3):'']);}
          return res}""")
        for x in r: print(x)
        await b.close()
asyncio.run(main())
