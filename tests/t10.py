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
        r=await pg.evaluate("""async()=>{const res=[];for(const pw of [.2,1]){AC=new OfflineAudioContext(1,44100*1.5,44100);sound=true;lastOof=-9;frogOof(pw);const buf=await AC.startRendering();const d=buf.getChannelData(0);
          const env=[];for(let i=0;i<15;i++){let m=0;for(let j=i*4410;j<(i+1)*4410;j++)m=Math.max(m,Math.abs(d[j]));env.push(m.toFixed(2))}res.push([pw,env.join(' ')])}return res}""")
        for x in r: print(x)
        await b.close()
asyncio.run(main())
