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
        r=await pg.evaluate("""async()=>{const out=[];for(const st of Object.keys(REV_STYLES)){AC=new OfflineAudioContext(1,44100*2.4,44100);sound=true;opts.revStyle=st;
            REV_STYLES[st].rev(1);const ctx=AC;
            let buf;try{const p=ctx.startRendering();buf=await p}catch(e){out.push(st+' ERR '+e);continue}
            const d=buf.getChannelData(0);let pk=0,rms=0;for(const x of d){pk=Math.max(pk,Math.abs(x));rms+=x*x}out.push(st+' rev peak '+pk.toFixed(2)+' rms '+Math.sqrt(rms/d.length).toFixed(3));}
          for(const st of Object.keys(REV_STYLES)){if(st==='froggy')continue;AC=new OfflineAudioContext(1,44100*1.2,44100);REV_STYLES[st].pop(1);const buf=await AC.startRendering();const d=buf.getChannelData(0);let pk=0;for(const x of d)pk=Math.max(pk,Math.abs(x));out.push(st+' pop peak '+pk.toFixed(2));}
          return out}""")
        print('\n'.join(r),errs)
        await b.close()
asyncio.run(main())
