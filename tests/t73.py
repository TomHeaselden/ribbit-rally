import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(400)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300)
        await pg.evaluate("""()=>{const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){setTimeout(()=>{u.onstart();setTimeout(()=>u.onend(),1500)},20)}};Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});POINTER.t=-1e9;}""")
        await pg.evaluate("document.querySelector('#frogGrid .card:nth-child(6)').click()"); await pg.wait_for_timeout(700)
        print('state',await pg.evaluate("[MOUTH.raf>0,MOUTH.i,!!cardEyesScreen(5),performance.now()-POINTER.t]"));print('others look at Gizmo:',await pg.evaluate("FACE.map((F,i)=>i===5?'(talking)':F.lookT.map(v=>v.toFixed(1)).join(',')).join(' | ')"));await pg.screenshot(path='live_talk.png')
        await pg.click('#bToTracks'); await pg.wait_for_timeout(300); print('loop stops off-screen:',await pg.evaluate("faceRaf===0"),errs)
        await b.close()
asyncio.run(main())
