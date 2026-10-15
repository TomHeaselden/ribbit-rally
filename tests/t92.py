import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
MOCK="""()=>{window.SPOKEN=[];const q=[];let busy=false;
  const run=()=>{if(busy||!q.length)return;busy=true;const u=q.shift();SPOKEN.push([u.text,+u.pitch.toFixed(2),+u.rate.toFixed(2)]);
    setTimeout(()=>{u.onstart&&u.onstart();const words=[...u.text.matchAll(/\\S+/g)];words.forEach((w,j)=>setTimeout(()=>u.onboundary&&u.onboundary({name:'word',charIndex:w.index}),j*230/u.rate));
      setTimeout(()=>{busy=false;u.onend&&u.onend();run()},words.length*230/u.rate+120)},30)};
  const ss={speak(u){q.push(u);run()},cancel(){q.length=0},getVoices(){return []},get speaking(){return busy}};
  Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true});}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=1);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.evaluate(MOCK)
        await pg.click('#bPlay'); await pg.wait_for_timeout(400)
        await pg.wait_for_timeout(3000); await pg.click('#frogGrid > :nth-child(3)')
        await pg.wait_for_timeout(1500); print("bonk",await pg.evaluate("[SPK.i,SPK.mode,frogGrid.children[2].className,(FACE[2].dope||0).toFixed(2),document.querySelector('.say').textContent]")); await pg.evaluate("()=>document.getAnimations().forEach(a=>a.pause())"); await pg.locator("#frogGrid > :nth-child(3)").screenshot(path="bonk_dopey.png"); await pg.evaluate("()=>document.getAnimations().forEach(a=>a.play())")
        await pg.wait_for_timeout(11000); print("bonk spoke",await pg.evaluate("SPOKEN"),await pg.evaluate("[SPK.i,frogGrid.children[2].className]"))
        await pg.click('#frogGrid > :nth-child(5)')
        for w in [300,300,300,600]:
            await pg.wait_for_timeout(w); print('t',await pg.evaluate("[SPK.i,frogGrid.children[4].classList.contains('talking'),FACE[4].excite.toFixed(2),faceRaf>0]"))
        st=await pg.evaluate("[SPK.i,frogGrid.children[4].className,FACE[4].excite.toFixed(2),document.querySelector('.say')&&document.querySelector('.say').textContent]")
        print("mid-speech",st,await pg.evaluate("[!!AC,sound,AC&&AC.state,typeof speechSynthesis.speak,String(speechSynthesis.speak).slice(0,30)]"))
        await pg.locator('#frogGrid > :nth-child(5)').screenshot(path='mango_talking.png')
        await pg.wait_for_timeout(4500)
        print('spoken',await pg.evaluate("SPOKEN"))
        print('after',await pg.evaluate("[SPK.i,frogGrid.children[4].className,FACE[4].excite.toFixed(2)]"))
        await pg.click('#frogGrid > :nth-child(8)'); await pg.wait_for_timeout(200); await pg.click('#frogGrid > :nth-child(2)'); await pg.wait_for_timeout(5000)
        print('spoken2',await pg.evaluate("SPOKEN.slice(-4)"),await pg.evaluate("[SPK.i,[...frogGrid.children].filter(c=>c.classList.contains('talking')).length]"))
        print('errors',errs); await b.close()
asyncio.run(main())
