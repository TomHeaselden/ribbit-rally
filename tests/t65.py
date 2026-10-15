import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1100,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{for(let i=0;i<8;i++)drawMouth(i,1)}"); await pg.wait_for_timeout(100); await pg.screenshot(path='mouth_all.png')
        await pg.evaluate("()=>{for(let i=0;i<8;i++)drawMouth(i,0)}")
        # simulate a voice that reports words, record mouth openness over time
        await pg.evaluate("""()=>{const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){setTimeout(()=>{u.onstart();let ci=0;const ws=u.text.split(' ');let t=0;ws.forEach(w=>{const idx=u.text.indexOf(w,ci);ci=idx+w.length;setTimeout(()=>u.onboundary({name:'word',charIndex:idx,charLength:w.length}),t);t+=380});setTimeout(()=>u.onend(),t+200)},30)}};
          Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});window._o=[];const t0=performance.now();const iv=setInterval(()=>{window._o.push(+mouthOpen(performance.now()).toFixed(2))},60);setTimeout(()=>clearInterval(iv),4200);}""")
        await pg.click('#frogGrid .card:nth-child(1)'); await pg.wait_for_timeout(1300); await pg.screenshot(path='mouth_talk.png'); await pg.wait_for_timeout(3200)
        o=await pg.evaluate("window._o"); print('openness trace:',' '.join(str(x) for x in o))
        print('closed after:',await pg.evaluate("MOUTH.ev.length===0&&!MOUTH.talk"),errs)
        await b.close()
asyncio.run(main())
