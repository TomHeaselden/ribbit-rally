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
        r=await pg.evaluate("""async()=>{const out=[];for(const i of [0,2,3]){const L=FROG_LINES[i];AC=new OfflineAudioContext(1,44100*2,44100);sound=true;THROAT=null;throatStart(L);
            for(const at of [.3,.6,.9])AC.suspend(at).then(()=>{throatPulse();AC.resume()});const d=(await AC.startRendering()).getChannelData(0);let pk=0,e=0;for(const x of d){pk=Math.max(pk,Math.abs(x));e+=x*x}
            AC=new OfflineAudioContext(1,44100,44100);frogCroak(L,0,'intro');const c=(await AC.startRendering()).getChannelData(0);let cp=0;for(const x of c)cp=Math.max(cp,Math.abs(x));
            out.push(FROGS[i].name+': rumble peak '+pk.toFixed(2)+' rms '+Math.sqrt(e/d.length).toFixed(3)+', intro croak peak '+cp.toFixed(2));THROAT=null;}return out}""")
        print('\n'.join(r))
        await b.close()
asyncio.run(main())
