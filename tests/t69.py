import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900},device_scale_factor=2)
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(200)
        ks=['rest','A','E','I','O','U','MBP','FV','TH','S']
        import PIL.Image as I
        tiles=[]
        for k in ks:
            await pg.evaluate("(k)=>drawMouth(0,Object.assign({},VIS.rest,VIS[k]))",k); await pg.wait_for_timeout(60)
            await pg.screenshot(path='v.png',clip={'x':95,'y':150,'width':110,'height':95})
            tiles.append(I.open('v.png').copy())
        w,h=tiles[0].size;sheet=I.new('RGB',(w*5,h*2),'white')
        for n,t in enumerate(tiles):sheet.paste(t,((n%5)*w,(n//5)*h))
        sheet.save('viseme_sheet.png');print(ks)
        await b.close()
asyncio.run(main())
