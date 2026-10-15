import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for vw,vh,nm in [(1280,760,'g'),(400,820,'gm')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh})
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type in('error','warning') else None)
            await pg.goto(PAGE); await pg.wait_for_timeout(800)
            print(nm,'gl ok',await pg.evaluate("GL3.ok"))
            await pg.screenshot(path=f'{nm}1.png')
            await pg.click('#bPlay'); await pg.wait_for_timeout(200); await pg.screenshot(path=f'{nm}2.png')
            await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(%s)'%sys.argv[1])
            await pg.wait_for_timeout(1200); await pg.screenshot(path=f'{nm}3.png')
            await pg.wait_for_timeout(3600)
            await pg.evaluate("()=>{G.karts.forEach(k=>{if(!k.isP)k.item='bubble'})}")
            await pg.wait_for_timeout(2500); await pg.screenshot(path=f'{nm}4.png')
            fps=await pg.evaluate("""()=>new Promise(r=>{let n=0;const t0=performance.now();function f(){n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else r(n/2)}requestAnimationFrame(f)})""")
            print('fps',fps, errs[:5])
        await b.close()
asyncio.run(main())
