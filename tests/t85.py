import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300); await pg.evaluate('speechSynthesis.speak=()=>{}')
        await pg.click('#frogGrid > :nth-child(2)'); await pg.wait_for_timeout(60); box=await pg.evaluate("(()=>{const r=frogGrid.children[1].getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()"); await pg.screenshot(path='lulu_line.png',clip={'x':box[0]-30,'y':box[1]-80,'width':box[2]+60,'height':box[3]+90}); print(await pg.evaluate('[opts.frog,document.querySelectorAll(".say").length,frogGrid.children[1].className]')); await pg.wait_for_timeout(600)
        box=await pg.evaluate("(()=>{const r=frogGrid.children[1].getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
        await pg.screenshot(path='lulu_line.png',clip={'x':box[0]-10,'y':box[1]-60,'width':box[2]+20,'height':box[3]+70})
        print(await pg.evaluate("[...document.querySelectorAll('.say')].map(x=>x.textContent)"),errs); await b.close()
asyncio.run(main())
