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
        # show each mouth shape on a different frog
        await pg.evaluate("""()=>{const ks=['A','E','I','O','U','MBP','FV','TH'];ks.forEach((k,i)=>drawMouth(i,Object.assign({},VIS.rest,VIS[k])));
          ks.forEach((k,i)=>{const d=document.createElement('div');d.className='say';d.textContent=k==='A'?'"ah"':k==='E'?'"eh"':k==='I'?'"ee"':k==='O'?'"oh"':k==='U'?'"oo"':k==='MBP'?'"m/b/p"':k==='FV'?'"f/v"':'"th/l/t"';frogGrid.children[i].append(d)})}""")
        await pg.wait_for_timeout(150); await pg.screenshot(path='visemes.png')
        await pg.evaluate("()=>{document.querySelectorAll('.say').forEach(x=>x.remove());for(let i=0;i<8;i++)drawMouth(i,null)}")
        print(await pg.evaluate("textToVisemes('Zoom zoom! Catch me if you can!').segs.map(s=>s[0]).join(' ')"))
        # simulated voice with word boundaries; record the shape timeline
        await pg.evaluate("""()=>{const fake={speaking:false,cancel(){},getVoices(){return []},speak(u){setTimeout(()=>{u.onstart();let ci=0,t=0;u.text.split(' ').forEach(w=>{const idx=u.text.indexOf(w,ci);ci=idx+w.length;setTimeout(()=>u.onboundary({name:'word',charIndex:idx,charLength:w.length}),t);t+=420});setTimeout(()=>u.onend(),t+150)},30)}};
          Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});window._tr=[];const iv=setInterval(()=>{const c=MOUTH.cur;window._tr.push((c.press>.5?'M':c.round>.6?'o':c.open>.6?'A':c.width>1.1?'e':c.open>.15?'.':'_'))},50);setTimeout(()=>clearInterval(iv),4500)}""")
        await pg.click('#frogGrid .card:nth-child(1)'); 
        await pg.wait_for_timeout(4800)
        print('shape track:',''.join(await pg.evaluate("window._tr")))
        print('closed:',await pg.evaluate("MOUTH.tl===null&&MOUTH.raf===0"),errs)
        await b.close()
asyncio.run(main())
