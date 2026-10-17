import os
PAGE='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','out','renderer','index.html'))
RELAY=os.path.join(os.path.dirname(os.path.abspath(__file__)),'mqtt-test-relay.js')
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'output');os.makedirs(OUT,exist_ok=True);os.chdir(OUT)  # screenshots/sounds land in tests/output
import asyncio,subprocess,time,sys,json
from playwright.async_api import async_playwright
# two players find each other with Quick Race through a local test relay, race 1 lap with bots, and both get results
PORT=9011
URL=PAGE+f'?mqtt=ws://127.0.0.1:{PORT}/mqtt'
AUTO="""window.__auto=setInterval(()=>{if(!G||G.over||!G.net)return;const P=G.player;if(P.ko<=0&&!P.fin)aiControl(P,1/60);keys.arrowleft=P._s<-.25;keys.arrowright=P._s>.25;keys.arrowdown=!!P._b;},16);"""
async def player(b,name,frog):
    pg=await b.new_page(viewport={'width':900,'height':640});errs=[];pg.on('pageerror',lambda e:errs.append(name+': '+str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(name+' console: '+m.text))
    await pg.goto(URL);await pg.wait_for_timeout(500);await pg.evaluate("GL3.ok=false")
    await pg.click('#bOnline');await pg.wait_for_timeout(300);await pg.click(f'#frogGrid > :nth-child({frog+1})');await pg.wait_for_timeout(200)
    print(name,'next button:',await pg.text_content('#bToTracks'));await pg.click('#bToTracks');await pg.wait_for_timeout(300)
    return pg,errs
async def main():
    relay=subprocess.Popen(['node',RELAY,str(PORT),'40'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);time.sleep(.6)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch()
            A,ea=await player(b,'A',4);B,eb=await player(b,'B',4)   # both pick Mango
            await A.click('#bQuick');await A.wait_for_timeout(3500)
            print('A:',await A.text_content('#lobTitle'),'|',await A.text_content('#lobMsg'),'| host',await A.evaluate('NET.host'),'state',await A.evaluate('NET.state'))
            await B.click('#bQuick');await B.wait_for_timeout(4500)
            print('B:',await B.text_content('#lobTitle'),'|',await B.text_content('#lobMsg'),'|',await B.text_content('#lobMsg2'),'| host',await B.evaluate('NET.host'))
            print('A roster',await A.evaluate('JSON.stringify(NET.ps.map(p=>FROGS[p[1]].name))'),'B roster',await B.evaluate('JSON.stringify(NET.ps.map(p=>FROGS[p[1]].name))'))
            await A.screenshot(path='net_lobby.png')
            await A.evaluate("NET.laps=1;NET.track=0");await A.click('#bLobStart');await A.wait_for_timeout(1200)
            for pg in (A,B):await pg.evaluate(AUTO)
            print('race:',await A.evaluate("[G.net,G.T.idx,G.laps,G.karts.filter(k=>k.remote).length,G.karts.filter(k=>k.human).length]"),await B.evaluate("[G.net,G.T.idx,G.laps,G.karts.filter(k=>k.remote).length,G.karts.filter(k=>k.human).length]"))
            await A.wait_for_timeout(9000)
            # where each player is on their own screen vs on the other's screen
            a_self=await A.evaluate("[G.player.slot,G.player.x,G.player.y,G.player.prog]");b_self=await B.evaluate("[G.player.slot,G.player.x,G.player.y,G.player.prog]")
            a_on_b=await B.evaluate(f"[G.karts[{a_self[0]}].x,G.karts[{a_self[0]}].y]");b_on_a=await A.evaluate(f"[G.karts[{b_self[0]}].x,G.karts[{b_self[0]}].y]")
            import math
            print('A self prog',a_self[3],'A seen by B off by',round(math.hypot(a_self[1]-a_on_b[0],a_self[2]-a_on_b[1])),'| B seen by A off by',round(math.hypot(b_self[1]-b_on_a[0],b_self[2]-b_on_a[1])))
            bot=await A.evaluate("G.karts.findIndex(k=>!k.human)");bA=await A.evaluate(f"[G.karts[{bot}].x,G.karts[{bot}].y,G.karts[{bot}].prog]");bB=await B.evaluate(f"[G.karts[{bot}].x,G.karts[{bot}].y,G.karts[{bot}].prog,G.karts[{bot}].remote]")
            print('bot on host',[round(v) for v in bA],'bot on B',[round(v) for v in bB[:3]],'remote on B',bB[3])
            # an item fired by A shows up on B
            await A.evaluate("G.player.item='bubble';useItem(G.player)");await B.wait_for_timeout(400)
            print('bubble reached B:',await B.evaluate("G.proj.filter(p=>p.type==='bubble'&&p.owner&&p.owner.slot===%d).length"%a_self[0]))
            await B.screenshot(path='net_race_B.png')
            # race to the finish
            for i in range(60):
                await A.wait_for_timeout(1000)
                if await A.evaluate("!$('#sResult').hidden") and await B.evaluate("!$('#sResult').hidden"):break
            for n,pg in (('A',A),('B',B)):
                print(n,'results:',await pg.text_content('#rTitle'),'|',await pg.text_content('#rSub'))
                print('  ',await pg.evaluate("[...document.querySelectorAll('#standings li')].map(l=>l.textContent.replace(/\\s+/g,' ')).join(' / ')"))
            print('errors',ea+eb)
            await b.close()
    finally:
        relay.terminate();print('relay log:',relay.stdout.read()[-600:])
asyncio.run(main())
