import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,base64,io
from playwright.async_api import async_playwright
from PIL import Image
SP=''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1100,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(500)
        await pg.click('#bPlay'); await pg.wait_for_timeout(2000)
        st=['shake','twerk','tummy','hop','dab','robot','sway','moonwalk']
        sheet=Image.new('RGB',(256*6,256*8),(235,240,250))
        for i in range(8):
            for f in range(6):
                u=await pg.evaluate(f"danceFrame({i},{f*0.07},'{st[i]}').toDataURL()")
                im=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
                sheet.paste(im,(f*256,i*256),im)
        sheet.save('dance-poses.png'); print('errors',errs); await b.close()
asyncio.run(main())
