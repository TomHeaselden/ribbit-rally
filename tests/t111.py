import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio
from playwright.async_api import async_playwright
SP=''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1280,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_timeout(800)
        await pg.screenshot(path=SP+'sp_title.png')
        # fake game controllers
        await pg.evaluate("""window.FP=[0,1].map(i=>({connected:true,index:i,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))}));navigator.getGamepads=()=>FP;""")
        await pg.evaluate("opts.players=2;opts.frog=0;opts.frog2=6;opts.track=2;startRace();G.cd=1.21")
        await pg.wait_for_timeout(300)
        r=await pg.evaluate("""(()=>{FP[0].axes[0]=-.9;FP[1].buttons[15].pressed=true;FP[1].buttons[1].pressed=true;
          const a=readInput(G.players[0]),b=readInput(G.players[1]);
          G.players[0].item='turbo';G.players[1].item='shield';FP[0].buttons[2].pressed=true;pollPads();FP[1].buttons[4].pressed=true;pollPads();
          const used=[G.players[0].item,G.players[1].item,G.players[0].boost>0,G.players[1].shield>0];
          FP[0].buttons[9].pressed=true;pollPads();const paused=G.paused;FP[0].buttons[9].pressed=false;pollPads();FP[0].buttons[9].pressed=true;pollPads();
          return {p1:a,p2:b,used,paused,unpaused:!G.paused}})()""")
        print(r)
        await pg.evaluate("for(const p of FP){p.axes[0]=0;p.buttons.forEach(x=>x.pressed=false)}")
        # race to the end quickly with both humans on autopilot, then look at the results screen
        await pg.evaluate("""(()=>{GL3.okSave=GL3.ok;let n=0;while(!G.over&&n<60*200){for(const P of G.players){aiControl(P,1/60);}const [P1,P2]=G.players;keys.a=P1._s<-.25;keys.d=P1._s>.25;keys.arrowleft=P2._s<-.25;keys.arrowright=P2._s>.25;update(1/60);n++;}
          for(const k of ['a','d','arrowleft','arrowright'])keys[k]=false;return n})()""")
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=SP+'sp_results.png')
        print(await pg.text_content('#rTitle'),'|',await pg.text_content('#rSub'))
        print('errors',errs); await b.close()
asyncio.run(main())
