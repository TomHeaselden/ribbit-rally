import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{const out={1:[],2:[],3:[],4:[]};for(let i=0;i<TRACKS.length;i++){const T=getTrack(i);let worst=1e9;for(const pd of T.pads){for(let k=-3;k<=24;k++)worst=Math.min(worst,1/Math.max(1e-6,T.curv[(pd.i+k)%TN]));}
          out[T.lvl].push(T.pads.length+'/'+(worst===1e9?'-':worst|0));}return out}""")
        for k,v in r.items(): print('L'+k,' '.join(v))
        print(errs)
        await b.close()
asyncio.run(main())
