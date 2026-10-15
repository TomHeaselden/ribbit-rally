import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(300)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        await pg.evaluate("""()=>{window._u=[];const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){window._u.push([u.text,u.pitch,u.rate]);setTimeout(()=>{u.onstart&&u.onstart();setTimeout(()=>u.onend&&u.onend(),200)},20)}};Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});}""")
        for n in range(1,9):
            await pg.click(f'#frogGrid .card:nth-child({n})'); await pg.wait_for_timeout(700)
        for u in await pg.evaluate("window._u"): print(u)
        print(errs)
        await b.close()
asyncio.run(main())
