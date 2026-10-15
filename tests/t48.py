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
        r=await pg.evaluate("""async()=>{const res={};for(const [name,src] of [['old',null],['new',1]]){}
          // spectral balance: share of energy below 250Hz vs above 1kHz
          const meas=async(fn)=>{AC=new OfflineAudioContext(1,44100*1.4,44100);sound=true;fn(1);const buf=await AC.startRendering();const d=buf.getChannelData(0);
            let lo=0,hi=0,all=0,y1=0,y2=0;const a1=Math.exp(-2*Math.PI*250/44100),a2=Math.exp(-2*Math.PI*1000/44100);let l2=0;
            for(const x of d){y1=a1*y1+(1-a1)*x;l2=a2*l2+(1-a2)*x;const h=x-l2;lo+=y1*y1;hi+=h*h;all+=x*x}return {lowShare:(lo/all).toFixed(2),highShare:(hi/all).toFixed(2),rms:Math.sqrt(all/d.length).toFixed(3)}};
          res.jetRev=await meas(REV_STYLES.jet.rev);res.jetPop=await meas(REV_STYLES.jet.pop);return res}""")
        print(r)
        await b.close()
asyncio.run(main())
