import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
SP=''
CASES=[('desk',1280,720,False,1),('phone_land',844,390,True,1),('phone_port',390,844,True,1),('desk_small',1024,600,False,1),('two_side',1280,720,False,2),('two_stack',600,900,False,2),('two_tablet',1024,768,True,2)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for name,w,h,touch,pl in CASES:
            ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=touch,is_mobile=touch);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(PAGE); await pg.wait_for_timeout(500)
            await pg.evaluate(f"opts.players={pl};opts.frog=5;opts.frog2=2;opts.track=12;opts.laps=3;startRace();G.cd=1.21;"
              "let n=0;while(n<60*14){for(const P of G.players){aiControl(P,1/60)}const [P1,P2]=G.players;if(G.players.length>1){keys.a=P1._s<-.25;keys.d=P1._s>.25;keys.arrowleft=P2._s<-.25;keys.arrowright=P2._s>.25}else{keys.arrowleft=P1._s<-.25;keys.arrowright=P1._s>.25}update(1/60);n++}"
              "for(const k of ['a','d','arrowleft','arrowright'])keys[k]=false;G.karts[3].fin=true;render()")
            await pg.wait_for_timeout(400)
            await pg.screenshot(path=SP+f'lb_{name}.png')
            print(name,errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
