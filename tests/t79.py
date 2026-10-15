import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
RUN="""(secs)=>{let n=0;while(G.state==='count'&&n<2000){update(1/60);n++;}for(let i=0;i<secs*60;i++)update(1/60);render();return [G.player.speed|0,Math.round(G.spdD),G.spdN.toFixed(1),ENG.rpm.toFixed(2)]}"""
async def shot(b,vp,touch,name,extra=None):
    ctx=await b.new_context(viewport=vp,device_scale_factor=2,has_touch=touch,is_mobile=touch)
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(PAGE); await pg.wait_for_timeout(500)
    await pg.click('#bPlay'); await pg.wait_for_timeout(200); await pg.click('#bToTracks'); await pg.click('#trackGrid .card:nth-child(1)')
    r=await pg.evaluate(RUN,1.2); print(name,'after 1.2s',r)
    if extra:
        r=await pg.evaluate(extra); print(name,'extra',r)
    await pg.wait_for_timeout(150); await pg.screenshot(path=name)
    print(name,'errors',errs); await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        await shot(b,{'width':1280,'height':720},False,'speedo_desk.png')
        await shot(b,{'width':1280,'height':720},False,'speedo_boost.png',"()=>{const P=G.player;for(let i=0;i<150;i++)update(1/60);P.boost=2;for(let i=0;i<70;i++)update(1/60);render();return [P.speed|0,Math.round(G.spdD),ENG.rpm.toFixed(2)]}")
        await shot(b,{'width':390,'height':844},True,'speedo_phone_portrait.png',"()=>{for(let i=0;i<120;i++)update(1/60);render();return Math.round(G.spdD)}")
        await shot(b,{'width':844,'height':390},True,'speedo_phone_land.png',"()=>{for(let i=0;i<120;i++)update(1/60);render();return Math.round(G.spdD)}")
        await b.close()
asyncio.run(main())
