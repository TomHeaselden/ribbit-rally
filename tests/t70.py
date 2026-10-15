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
        await pg.evaluate("""()=>{window._cr=0;const oc=croak;window.croak=function(){window._cr++;return oc.apply(this,arguments)};
          const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){window._spokeAt=performance.now()-window._click;setTimeout(()=>{u.onstart();setTimeout(()=>u.onend(),500)},20)}};Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});
          frogGrid.children[0].addEventListener('pointerdown',()=>window._click=performance.now(),true)}""")
        await pg.click('#frogGrid .card:nth-child(1)'); await pg.wait_for_timeout(1200)
        print('croaks played:',await pg.evaluate("window._cr"),'| speech starts after click (ms):',round(await pg.evaluate("window._spokeAt")),errs)
        await b.close()
asyncio.run(main())
