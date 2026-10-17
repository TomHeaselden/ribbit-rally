import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
RELAY=os.path.join(os.path.dirname(os.path.abspath(__file__)),'mqtt-test-relay.js')
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,subprocess,time
from playwright.async_api import async_playwright
# two players press Quick Race at the same moment (their two races merge into one), the race starts by itself after 20 s,
# and what happens when the online relay can't be reached
PORT=9013
URL=PAGE+f'?mqtt=ws://127.0.0.1:{PORT}/mqtt'
async def player(b,url,frog):
    pg=await b.new_page(viewport={'width':900,'height':640});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(url);await pg.wait_for_timeout(500);await pg.evaluate("GL3.ok=false")
    await pg.click('#bOnline');await pg.wait_for_timeout(300);await pg.click(f'#frogGrid > :nth-child({frog+1})');await pg.wait_for_timeout(200);await pg.click('#bToTracks');await pg.wait_for_timeout(300)
    return pg,errs
async def main():
    relay=subprocess.Popen(['node',RELAY,str(PORT),'50'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);time.sleep(.6)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch()
            A,ea=await player(b,URL,1);B,eb=await player(b,URL,3)
            await asyncio.gather(A.click('#bQuick'),B.click('#bQuick'))
            await A.wait_for_timeout(6000)
            ra=await A.evaluate("[NET.room,NET.host,NET.ps.length]");rb=await B.evaluate("[NET.room,NET.host,NET.ps.length]")
            print('after 6 s: A',ra,'B',rb,'same race:',ra[0]==rb[0])
            t0=time.time()
            for i in range(30):
                await A.wait_for_timeout(1000)
                if await A.evaluate("!!(G&&G.net&&!G.over)") and await B.evaluate("!!(G&&G.net&&!G.over)"):break
            print('race started by itself after about',round(time.time()-t0+6),'s from pressing Quick Race;',await A.evaluate("G.karts.filter(k=>k.human).length"),'players +',await A.evaluate("G.karts.filter(k=>!k.human).length"),'computer frogs')
            C,ec=await player(b,PAGE+'?mqtt=ws://127.0.0.1:1/mqtt',0)
            await C.click('#bQuick');await C.wait_for_timeout(2500)
            print('unreachable relay:',await C.evaluate("$('#sOnline').hidden?'(still on lobby)':document.querySelector('#onMsg').textContent"))
            await C.screenshot(path='net_menu.png')
            print('errors',ea+eb+ec);await b.close()
    finally:
        relay.terminate()
asyncio.run(main())
