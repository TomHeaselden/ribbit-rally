import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
RELAY=os.path.join(os.path.dirname(os.path.abspath(__file__)),'mqtt-test-relay.js')
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,subprocess,time
from playwright.async_api import async_playwright
# what an online race looks like in 3D, from the second player's screen
PORT=9014
URL=PAGE+f'?mqtt=ws://127.0.0.1:{PORT}/mqtt'
SP=''
AUTO="""window.__auto=setInterval(()=>{if(!G||G.over||!G.net)return;const P=G.player;if(P.ko<=0&&!P.fin)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;},16);"""
async def main():
    relay=subprocess.Popen(['node',RELAY,str(PORT),'40'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);time.sleep(.6)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch();g=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
            A=await b.new_page(viewport={'width':900,'height':640});await A.goto(URL);await A.wait_for_timeout(500);await A.evaluate("GL3.ok=false;opts.frog=2")
            B=await g.new_page(viewport={'width':1280,'height':720});await B.goto(URL);await B.wait_for_timeout(800);await B.evaluate("opts.frog=4")
            await A.click('#bOnline');await A.click('#bToTracks');await A.click('#bMakeRoom');await A.wait_for_timeout(1500);code=await A.evaluate('NET.code')
            await B.click('#bOnline');await B.click('#bToTracks');await B.fill('#roomCode',code);await B.click('#bJoinRoom');await B.wait_for_timeout(2500)
            await B.screenshot(path=SP+'net_lobby_guest.png')
            await A.evaluate("NET.track=0;NET.laps=2;netRoster()");await A.wait_for_timeout(500);await A.click('#bLobStart')
            await A.evaluate(AUTO);await B.evaluate(AUTO)
            await B.wait_for_timeout(16000)
            await B.screenshot(path=SP+'net_race_3d.png')
            print('B sees',await B.evaluate("G.karts.filter(k=>k.human&&!k.isP).map(k=>k.f.name+' at '+Math.round(Math.hypot(k.x-G.player.x,k.y-G.player.y)))"))
            await b.close();await g.close()
    finally:relay.terminate()
asyncio.run(main())
