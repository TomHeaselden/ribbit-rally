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
        for song in ['race','menu']:
            r=await pg.evaluate("""async(song)=>{const S=SONGS[song];const sd=60/S.bpm/4;const secs=sd*S.len+0.5;AC=new OfflineAudioContext(2,Math.ceil(44100*secs),44100);
              MUS.gain=null;MUS.bus={};MUS.on=true;MUS.duck=1;MUS.name=null;playSong(song);MUS.gain.gain.setValueAtTime(.45,0);
              for(let i=0;i<S.len;i++)playStep(S,i,.05+i*sd,sd);const buf=await AC.startRendering();const d=buf.getChannelData(0);
              let peak=0,sum=0;for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>peak)peak=v;sum+=v*v}
              // pumping check: average level right on kicks vs between
              const bars=[];for(let bar=0;bar<4;bar++){let row=[];for(let s=0;s<16;s+=2){const st=Math.floor((.05+(bar*16+s)*sd)*44100);let m=0;for(let j=st;j<st+Math.floor(sd*44100*2);j++)m=Math.max(m,Math.abs(d[j]));row.push(m.toFixed(2))}bars.push(row.join(' '))}
              return {secs:secs.toFixed(1),peak:peak.toFixed(2),rms:Math.sqrt(sum/d.length).toFixed(3),bars}}""",song)
            print(song,r)
        print(errs)
        await b.close()
asyncio.run(main())
