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
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(300)
        tiles=[]
        for name,js in [('gentle',"F.smile=F.smileT=.4;F.lookT=F.look=[0,0]"),('grin',"F.smile=F.smileT=1;F.lookT=F.look=[.6,.2]"),('lookup',"F.smile=F.smileT=.5;F.lookT=F.look=[-.7,-.6]"),('blink',"F.smile=F.smileT=.4;F.blinkStart=performance.now()-70")]:
            await pg.evaluate("(js)=>{cancelAnimationFrame(faceRaf);faceRaf=0;const F=FACE[1];F.nextSmile=F.nextLook=F.nextBlink=performance.now()+9e9;eval(js);if(js.includes('blink'))F.blink=1;else F.blink=0;drawCard(1,null)}",js)
            await pg.wait_for_timeout(50);await pg.screenshot(path='f.png',clip={'x':360,'y':130,'width':140,'height':120});tiles.append(I.open('f.png').copy())
        w,h=tiles[0].size;sh=I.new('RGB',(w*4,h),'white')
        for n,t in enumerate(tiles):sh.paste(t,(n*w,0))
        sh.save('face_sheet.png')
        await b.close()
asyncio.run(main())
