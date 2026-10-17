import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
RELAY=os.path.join(os.path.dirname(os.path.abspath(__file__)),'mqtt-test-relay.js')
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,subprocess,time,math
from playwright.async_api import async_playwright
# three players in a private room (code), items shared, then the room maker leaves mid-race and another player takes over the computer frogs
PORT=9012
URL=PAGE+f'?mqtt=ws://127.0.0.1:{PORT}/mqtt'
AUTO="""window.__auto=setInterval(()=>{if(!G||G.over||!G.net)return;const P=G.player;if(P.ko<=0&&!P.fin)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;},16);"""
async def player(b,name,frog):
    pg=await b.new_page(viewport={'width':900,'height':640});errs=[];pg.on('pageerror',lambda e:errs.append(name+': '+str(e)))
    await pg.goto(URL);await pg.wait_for_timeout(500);await pg.evaluate("GL3.ok=false")
    await pg.click('#bOnline');await pg.wait_for_timeout(300);await pg.click(f'#frogGrid > :nth-child({frog+1})');await pg.wait_for_timeout(200);await pg.click('#bToTracks');await pg.wait_for_timeout(300)
    return pg,errs
async def main():
    relay=subprocess.Popen(['node',RELAY,str(PORT),'60'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);time.sleep(.6)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch()
            A,ea=await player(b,'A',0);B,eb=await player(b,'B',2);C,ec=await player(b,'C',6)
            await A.click('#bMakeRoom');await A.wait_for_timeout(1500)
            code=await A.evaluate('NET.code');print('room code',code,'|',(await A.text_content('#lobCode')).strip())
            await B.fill('#roomCode',code.lower());await B.click('#bJoinRoom')
            await C.fill('#roomCode','ZZZZ');await C.click('#bJoinRoom');await C.wait_for_timeout(9500)
            print('C with wrong code:',await C.text_content('#onMsg'))
            await C.fill('#roomCode',code);await C.click('#bJoinRoom');await C.wait_for_timeout(2500)
            for n,pg in (('A',A),('B',B),('C',C)):print(n,await pg.evaluate("NET.state"),await pg.text_content('#lobMsg'),await pg.evaluate("JSON.stringify(NET.ps.map(p=>FROGS[p[1]].name))"),'start button',await pg.is_visible('#bLobStart'))
            await A.screenshot(path='net_room.png')
            await A.evaluate("NET.laps=2");await A.click('#bLobStart');await A.wait_for_timeout(1500)
            for pg in (A,B,C):await pg.evaluate(AUTO)
            await A.wait_for_timeout(7000)
            # items: each kind fired by B arrives at A and C
            for it in ['bubble','lily','fly','croak','star']:
                before=[await pg.evaluate("NET.rx&&NET.rx.i||0") for pg in (A,C)]
                await B.evaluate(f"G.player.spin=0;G.player.item='{it}';G.player.tongueT=0;useItem(G.player)");await A.wait_for_timeout(500)
                after=[await pg.evaluate("NET.rx&&NET.rx.i||0") for pg in (A,C)]
                print('item',it,'received by A,C:',[a-b for a,b in zip(after,before)])
            # the room maker (host, running the computer frogs) leaves in the middle of the race
            hostSlot=await A.evaluate("G.player.slot");print('host leaves now')
            await A.close()
            await B.wait_for_timeout(6000)
            for n,pg in (('B',B),('C',C)):
                print(n,'host now',await pg.evaluate("NET.host"),'bots driven here',await pg.evaluate("G.karts.filter(k=>!k.remote&&!k.isP).length"),'remote',await pg.evaluate("G.karts.filter(k=>k.remote).length"))
            bot=await B.evaluate("G.karts.findIndex(k=>!k.human&&k.slot!==%d)"%hostSlot)
            p1=await C.evaluate(f"G.karts[{bot}].prog");await C.wait_for_timeout(3000);p2=await C.evaluate(f"G.karts[{bot}].prog")
            print('a computer frog keeps racing on C:',p1,'->',p2,'| old host jetski prog on C',await C.evaluate(f"[G.karts[{hostSlot}].prog,G.karts[{hostSlot}].human,G.karts[{hostSlot}].remote]"))
            for i in range(90):
                await B.wait_for_timeout(1000)
                if await B.evaluate("!$('#sResult').hidden") and await C.evaluate("!$('#sResult').hidden"):break
            for n,pg in (('B',B),('C',C)):
                print(n,'results:',await pg.text_content('#rTitle'),'|',await pg.evaluate("[...document.querySelectorAll('#standings li')].map(l=>l.textContent.replace(/\\s+/g,' ')).join(' / ')"))
            print('errors',ea+eb+ec)
            await b.close()
    finally:
        relay.terminate();out=relay.stdout.read();print('relay BAD lines:',[l for l in out.splitlines() if 'BAD' in l][:5])
asyncio.run(main())
