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
        # simulate a device that has a voice: fake speechSynthesis that fires start, word boundaries and end
        await pg.evaluate("""()=>{window._ev=[];const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){this.speaking=true;window._ev.push('speak');setTimeout(()=>{u.onstart&&u.onstart();window._ev.push('start:'+(THROAT?'throat on':'no throat'))},50);
            [300,600,900].forEach(ms=>setTimeout(()=>{u.onboundary&&u.onboundary({name:'word'});window._ev.push('word')},ms));setTimeout(()=>{this.speaking=false;u.onend&&u.onend();window._ev.push('end:'+(THROAT?'throat on':'throat off'))},1200);}};
          Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});}""")
        await pg.click('#frogGrid .card:nth-child(3)'); await pg.wait_for_timeout(2400)
        print(await pg.evaluate("window._ev"),'music duck',await pg.evaluate("MUS.duck"),errs)
        # quick double-tap on two frogs: only the second should talk
        await pg.evaluate("window._ev=[]");await pg.click('#frogGrid .card:nth-child(1)');await pg.wait_for_timeout(100);await pg.click('#frogGrid .card:nth-child(2)');await pg.wait_for_timeout(2400)
        print('double tap:',await pg.evaluate("window._ev"),errs)
        await b.close()
asyncio.run(main())
