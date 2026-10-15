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
        r=await pg.evaluate("""()=>{const o={};for(let i=0;i<TRACKS.length;i++){const T=getTrack(i);const l=T.lvl;o[l]=o[l]||{n:0,b:0,s:0,p:0,w:0};o[l].n++;o[l].b+=T.bumpers.length;o[l].s+=T.spinners.length;o[l].p+=T.pads.length;o[l].w+=T.w;}
          return Object.entries(o).map(([l,v])=>'L'+l+': width '+(v.w/v.n|0)+', bumpers/track '+(v.b/v.n).toFixed(1)+', sweepers/track '+(v.s/v.n).toFixed(1)+', pads/track '+(v.p/v.n).toFixed(1))}""")
        print('\n'.join(r))
        await b.close()
asyncio.run(main())
