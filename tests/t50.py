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
        r=await pg.evaluate("""async()=>{const out={};for(const what of ['rev','pop']){const off=new OfflineAudioContext(1,44100*2,44100);AC=off;sound=true;REV_STYLES.jet[what](1);const d=(await off.startRendering()).getChannelData(0);
            const idx=[];for(let i=0;i<d.length;i++)if(!isFinite(d[i]))idx.push(i);out[what]=[idx.length,idx.slice(0,3),idx.slice(-2)];}
          // isolate pieces of the pop
          const t0=()=>{const off=new OfflineAudioContext(1,44100,44100);AC=off;return off};
          let off=t0();bang(0,.3,500,.8,.06,80);let d=(await off.startRendering()).getChannelData(0);out.bang=[...d].filter(x=>!isFinite(x)).length;
          off=t0();{const s=AC.createBufferSource();s.buffer=nb(.06);s.connect(AC.destination);s.start(0);}d=(await off.startRendering()).getChannelData(0);out.nb=[...d].filter(x=>!isFinite(x)).length;
          return out}""")
        print(r)
        await b.close()
asyncio.run(main())
