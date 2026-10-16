import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
SP=''
async def run(p,name,vw,vh,touch=False):
    b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    ctx=await b.new_context(viewport={'width':vw,'height':vh},has_touch=touch,is_mobile=touch)
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(PAGE); await pg.wait_for_timeout(600)
    await pg.click('#bPlay2'); await pg.wait_for_timeout(1500)
    print(name,'title:',await pg.text_content('#frogTitle'),'|',await pg.text_content('#bToTracks'))
    await pg.click('#frogGrid > :nth-child(5)'); await pg.wait_for_timeout(300)
    await pg.click('#bToTracks'); await pg.wait_for_timeout(600)
    print(name,'title:',await pg.text_content('#frogTitle'),'|',await pg.text_content('#bToTracks'))
    await pg.click('#frogGrid > :nth-child(5)'); await pg.wait_for_timeout(200)   # taken by P1: should be refused
    await pg.click('#frogGrid > :nth-child(2)'); await pg.wait_for_timeout(400)
    if name=='wide': await pg.screenshot(path=SP+'sp_pick.png')
    print(name,'frogs',await pg.evaluate("[opts.frog,opts.frog2]"))
    await pg.click('#bToTracks'); await pg.wait_for_timeout(2500)
    await pg.click('#trackGrid > :nth-child(3)'); await pg.wait_for_timeout(2500)
    await pg.screenshot(path=SP+f'sp_{name}_count.png')
    await pg.evaluate("G.cd=1.25"); await pg.wait_for_timeout(1500)
    if not touch:
        await pg.keyboard.down('d'); await pg.keyboard.down('ArrowLeft'); await pg.wait_for_timeout(1500); await pg.keyboard.up('d'); await pg.keyboard.up('ArrowLeft')
    await pg.evaluate("G.players[0].item='bubble';G.players[1].item='star'")
    await pg.wait_for_timeout(2500)
    await pg.screenshot(path=SP+f'sp_{name}_race.png')
    print(name,'yaw',await pg.evaluate("[G.players[0].a.toFixed(2),G.players[1].a.toFixed(2),G.players.map(p=>Math.round(p.speed)).join(',')]"),'touch2',await pg.evaluate("[!document.querySelector('#touch2').hidden,getComputedStyle(document.querySelector('#touch')).right,getComputedStyle(document.querySelector('#touch2')).left]"))
    print(name,'errors',errs); await b.close()
async def main():
    async with async_playwright() as p:
        await run(p,'wide',1280,720)
        await run(p,'tall',600,900)
        await run(p,'tablet',1024,768,True)
asyncio.run(main())
