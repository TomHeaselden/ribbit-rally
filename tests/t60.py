import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>new Promise(res=>{const log=[];const u=new SpeechSynthesisUtterance('hello');u.onstart=()=>log.push('start');u.onend=()=>log.push('end');u.onerror=e=>log.push('err:'+e.error);speechSynthesis.speak(u);
          setTimeout(()=>res([log,speechSynthesis.speaking,speechSynthesis.pending]),1500)})""")
        print(r)
        await b.close()
asyncio.run(main())
