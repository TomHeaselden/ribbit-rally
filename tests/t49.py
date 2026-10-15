import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,struct,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        data=await pg.evaluate("""async()=>{const SR=44100,LEN=7.5;const off=new OfflineAudioContext(1,SR*LEN|0,SR);sound=true;
          // schedule like the countdown: three revs with exhaust pops, then a final GO blast
          const plan=[[0.2,'rev'],[0.55,'pop'],[1.35,'rev'],[1.7,'pop'],[2.45,'rev'],[2.8,'pop'],[3.6,'rev'],[3.95,'pop'],[4.9,'pop'],[5.0,'pop']];
          for(const [at,what] of plan){off.suspend(at).then(()=>{AC=off;REV_STYLES.jet[what](what==='pop'&&at>=4.9?1.25:1);off.resume()});}
          const buf=await off.startRendering();const d=buf.getChannelData(0);let pk=0;for(const x of d)pk=Math.max(pk,Math.abs(x));
          const g=pk>0.95?0.95/pk:1;const out=new Array(d.length);for(let i=0;i<d.length;i++)out[i]=Math.round(Math.max(-1,Math.min(1,d[i]*g))*32767);return {pk,s:out}}""")
        s=data['s'];bad=sum(1 for x in s if not isinstance(x,int));s=[x if isinstance(x,int) else 0 for x in s];print('peak',round(data['pk'],2),'samples',len(s),'bad',bad)
        with open('jet-start-demo.wav','wb') as f:
            f.write(b'RIFF');f.write(struct.pack('<I',36+len(s)*2));f.write(b'WAVEfmt ');f.write(struct.pack('<IHHIIHH',16,1,1,44100,88200,2,16));f.write(b'data');f.write(struct.pack('<I',len(s)*2));f.write(struct.pack('<%dh'%len(s),*s))
        await b.close()
asyncio.run(main())
