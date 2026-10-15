import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
import PIL.Image as I
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300)
        await pg.evaluate("cancelAnimationFrame(faceRaf);faceRaf=1")
        rows=[]
        for fi,st,times in [(0,'wink',[.05,.3,.6]),(1,'flutter',[0,.07,.15]),(2,'droopy',[.5,1.2,1.75]),(3,'sync',[.1,.3,.5]),(5,'pop',[.1,.25,.45]),(6,'squeeze',[.03,.3,.8])]:
            tiles=[]
            for tt in times:
                await pg.evaluate("([fi,st,tt])=>{const F=FACE[fi];F.style=st;F.look=F.lookT=[0,0];F.smile=.5;blinkShape(F,tt);drawCard(fi,null)}",[fi,st,tt])
                box=await pg.evaluate("(fi)=>{const r=frogGrid.children[fi].querySelector('canvas').getBoundingClientRect();return [r.left,r.top,r.width]}",fi)
                x,y,w=box;await pg.screenshot(path='b.png',clip={'x':x+w*.3,'y':y+w*.05,'width':w*.55,'height':w*.5});tiles.append(I.open('b.png').copy())
            rows.append(tiles)
        w,h=rows[0][0].size;sh=I.new('RGB',(w*3,h*len(rows)),'white')
        for r,tl in enumerate(rows):
            for c_,t in enumerate(tl):sh.paste(t.resize((w,h)),(c_*w,r*h))
        sh.save('blink_sheet.png');print(errs)
        await b.close()
asyncio.run(main())
