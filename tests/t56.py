import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,struct
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        data=await pg.evaluate("""async()=>{const SR=44100,LEN=11;AC=new OfflineAudioContext(1,SR*LEN,SR);sound=true;for(let i=0;i<8;i++)FROG_VOICES[i](.3+i*1.3);
          const d=(await AC.startRendering()).getChannelData(0);let pk=0;for(const x of d)pk=Math.max(pk,Math.abs(x));const g=pk>.95?.95/pk:1;return Array.from(d,x=>Math.round(x*g*32767)|0)}""")
        s=[int(x) for x in data]
        with open('frog-voices-demo.wav','wb') as f:
            f.write(b'RIFF');f.write(struct.pack('<I',36+len(s)*2));f.write(b'WAVEfmt ');f.write(struct.pack('<IHHIIHH',16,1,1,44100,88200,2,16));f.write(b'data');f.write(struct.pack('<I',len(s)*2));f.write(struct.pack('<%dh'%len(s),*s))
        print('samples',len(s))
        await b.close()
asyncio.run(main())
