import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1100,'height':760})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""async()=>{const out=[];for(let i=0;i<8;i++){AC=new OfflineAudioContext(1,44100*1.3,44100);sound=true;FROG_VOICES[i](0.02);const d=(await AC.startRendering()).getChannelData(0);let pk=0,e=0,last=0;for(let j=0;j<d.length;j++){const x=Math.abs(d[j]);pk=Math.max(pk,x);e+=x*x;if(x>.02)last=j}
          out.push(FROGS[i].name+': peak '+pk.toFixed(2)+', rms '+Math.sqrt(e/d.length).toFixed(3)+', length '+(last/44100).toFixed(2)+'s')}return out}""")
        print('\n'.join(r))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        await pg.click('#frogGrid .card:nth-child(3)'); await pg.wait_for_timeout(120); await pg.screenshot(path='fv.png')
        print('selected',await pg.evaluate("opts.frog"),'boing',await pg.evaluate("document.querySelectorAll('#frogGrid .boing').length"),errs)
        await b.close()
asyncio.run(main())
