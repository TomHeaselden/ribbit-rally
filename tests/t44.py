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
        r=await pg.evaluate("""()=>{GL3.ok=false;opts.track=25;newRace();G.cd=1.21;let picks=0,yanks=0;const of=fireTongue;fireTongue=function(k){const b=k.tng;of(k);if(!b&&k.tng)yanks++;};
          let n=0;while(n<60*200){const P=G.player;if(P.ko<=0&&!P.gulped)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;update(1/60);n++;for(const k of G.karts)if(k.tongueT>7.98)picks++;if(G.karts.every(k=>k.fin))break;}
          fireTongue=of;return 'all finished '+G.karts.every(k=>k.fin)+', tongue activations '+picks+', tongue shots '+yanks}""")
        print(r)
        await b.close()
asyncio.run(main())
