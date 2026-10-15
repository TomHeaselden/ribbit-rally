
// ================= original music (composed for Ribbit Rally, generated live) =================
const MUS={on:true,song:null,name:null,step:0,next:0,tempo:1,gain:null,noise:null,duck:1,bus:{}};
function n2m(t){const pc={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[t[0]];let i=1,acc=0;if(t[1]==='#'){acc=1;i=2}else if(t[1]==='b'){acc=-1;i=2}return 12*(+t.slice(i)+1)+pc+acc}
function mel(str){const toks=str.replace(/\|/g,' ').trim().split(/\s+/);const out=new Array(toks.length*2).fill(null);let last=-1;
  toks.forEach((t,i)=>{const s=i*2;if(t==='-'){if(last>=0)out[last].len+=2}else if(t==='.'){last=-1}else{out[s]={m:n2m(t),len:2};last=s}});return out}
const CH={C:[48,52,55],Dm:[50,53,57],Em:[52,55,59],F:[53,57,60],G:[55,59,62],Am:[57,60,64],Bm:[59,62,66],D:[50,54,57]};
const SONGS={
  // "Lily Pad Bounce" - menus and results
  menu:{bpm:124,chords:['C','Am','F','G','C','Am','Dm','G'],
    lead:mel(`E5 G5 C6 G5 E5 G5 A5 G5 | E5 - C5 E5 A5 - G5 E5 | F5 A5 C6 A5 F5 A5 C6 D6 | B5 - G5 - D5 - G5 - |
              E5 G5 C6 G5 E5 G5 A5 G5 | C6 - B5 A5 G5 - E5 G5 | F5 E5 D5 F5 A5 - G5 F5 | E5 - D5 - C5 - . .`),
    kick:'x...x...x...x...',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',ohat:'..x...x...x...x.',bass:'..O...O...O...OR',
    crash:[0],riser:[7],fill:[3,7],pad:1,leadVol:.05,pump:.45},
  // "Ribbit Rush" - racing
  race:{bpm:166,chords:['G','Em','C','D','G','Em','C','D','C','D','Bm','Em','C','D','G','D'],
    lead:mel(`D5 G5 B5 G5 D6 B5 G5 B5 | E5 G5 B5 - G5 E5 G5 B5 | C6 B5 A5 G5 E5 G5 A5 - | F#5 A5 D6 - C6 - A5 F#5 |
              D5 G5 B5 G5 D6 B5 G5 B5 | E6 - D6 B5 G5 - E5 G5 | A5 B5 C6 E6 D6 C6 B5 A5 | D6 - . A5 F#5 - D5 - |
              E6 - E6 D6 C6 - G5 - | F#6 - F#6 E6 D6 - A5 - | F#5 B5 D6 B5 F#5 B5 D6 F#6 | G6 - F#6 E6 D6 - B5 - |
              C6 E6 G6 E6 C6 E6 G6 E6 | D6 F#6 A6 F#6 E6 D6 C6 A5 | B5 D6 G6 - D6 B5 G5 B5 | A5 - F#5 - D5 - . .`),
    kick:'x...x...x...x...',clap:'....x.......x...',hat:'xxxxxxxxxxxxxxxx',ohat:'..x...x...x...x.',bass:'R.O.R.O.R.O.R.OO',
    crash:[0,8],riser:[7,15],fill:[3,7,11,15],pad:1,leadVol:.05,pump:.25},
};
for(const k in SONGS)SONGS[k].len=SONGS[k].chords.length*16;
function musGain(){if(!AC)return null;if(!MUS.gain){
  const comp=AC.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.12;comp.connect(AC.destination);
  MUS.gain=AC.createGain();MUS.gain.gain.value=0;MUS.gain.connect(comp);
  const B=MUS.bus;B.drum=AC.createGain();B.drum.gain.value=1;B.drum.connect(MUS.gain);
  B.pump=AC.createGain();B.pump.gain.value=1;B.pump.connect(MUS.gain);   // bass + chords duck on every kick
  B.lead=AC.createGain();B.lead.gain.value=1;B.lead.connect(MUS.gain);
  B.dly=AC.createDelay(1);B.fb=AC.createGain();B.fb.gain.value=.28;B.wet=AC.createGain();B.wet.gain.value=.22;
  B.lead.connect(B.dly);B.dly.connect(B.fb).connect(B.dly);B.dly.connect(B.wet).connect(MUS.gain);
  const len=AC.sampleRate*1.5,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;MUS.noise=buf;}
  return MUS.gain}
function musLevel(){if(!MUS.gain||!AC)return;const v=MUS.on&&MUS.song?.45*MUS.duck:0;MUS.gain.gain.cancelScheduledValues(AC.currentTime);MUS.gain.gain.setTargetAtTime(v,AC.currentTime,.15)}
function playSong(name){if(!AC)return;musGain();if(MUS.name===name&&MUS.song){musLevel();return}
  MUS.name=name;MUS.song=SONGS[name];MUS.step=0;MUS.tempo=1;MUS.next=AC.currentTime+.08;musLevel()}
function stopSong(){MUS.song=null;MUS.name=null;musLevel()}
function setDuck(v){MUS.duck=v;musLevel()}
function env(g,t,vol,dur,a=.005){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.setTargetAtTime(vol*.6,t+a+.02,.08);g.gain.setTargetAtTime(0,t+dur,.03)}
function vOsc(type,f,t,dur,vol,dest,lp,det=0){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(det)o.detune.value=det;
  env(g,t,vol,dur);let n=o;if(lp){const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;o.connect(fl);n=fl}n.connect(g).connect(dest);o.start(t);o.stop(t+dur+.3);return o}
function vNoise(t,dur,vol,hp,dest,bp){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=MUS.noise;f.type=bp?'bandpass':'highpass';f.frequency.value=bp||hp;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f).connect(g).connect(dest);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function vKick(t,dest){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(48,t+.09);g.gain.setValueAtTime(.95,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g).connect(dest);o.start(t);o.stop(t+.35);
  const c=AC.createOscillator(),cg=AC.createGain();c.type='square';c.frequency.value=900;cg.gain.setValueAtTime(.08,t);cg.gain.exponentialRampToValueAtTime(.001,t+.012);c.connect(cg).connect(dest);c.start(t);c.stop(t+.02);}
function vClap(t,dest){for(let i=0;i<3;i++)vNoise(t+i*.011,i<2?.02:.16,.32,0,dest,1500);vOsc('triangle',210,t,.04,.1,dest)}
function vRiser(t,dur,dest){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=MUS.noise;s.loop=true;f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(7000,t+dur);
  g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.22,t+dur);g.gain.setValueAtTime(0,t+dur+.01);s.connect(f).connect(g).connect(dest);s.start(t);s.stop(t+dur+.05)}
const mf=m=>440*Math.pow(2,(m-69)/12);
function playStep(S,step,t,sd){const B=MUS.bus;const bar=Math.floor(step/16),s=step%16;const ch=CH[S.chords[bar]];
  const isFill=S.fill.includes(bar%16)&&s>=12;
  if(S.kick[s]==='x'){vKick(t,B.drum);const p=B.pump.gain;p.cancelScheduledValues(t);p.setValueAtTime(S.pump,t);p.linearRampToValueAtTime(1,t+sd*3.2);}
  if(S.clap[s]==='x')vClap(t,B.drum);
  if(isFill)vNoise(t,.09,.12+(s-12)*.05,1200,B.drum),vOsc('triangle',180+(s-12)*30,t,.04,.08,B.drum);
  else{if(S.hat[s]==='x')vNoise(t,.03,s%2?.035:.06,8000,B.drum);if(S.ohat[s]==='x')vNoise(t,.14,.09,6500,B.drum);}
  if(s===0&&S.crash.includes(bar))vNoise(t,1.4,.2,4500,B.drum);
  if(s===0&&S.riser.includes(bar))vRiser(t,sd*16,B.drum);
  // pad: detuned saw chord held for the bar, pumped by the kick
  if(S.pad&&s===0)for(const m of ch)for(const dt of [-14,0,14])vOsc('sawtooth',mf(m+12),t,sd*15,.022,B.pump,2400,dt);
  const b=S.bass[s];if(b!=='.'){const root=ch[0]-24;const m=b==='R'?root:b==='5'?root+7:root+12;
    vOsc('sawtooth',mf(m),t,sd*.9,.15,B.pump,1100);vOsc('sine',mf(m-12),t,sd*.9,.2,B.pump);}
  if(s%2===1&&!isFill){const m=ch[[0,1,2,1,2,0,1,2][(s>>1)%8]]+24;vOsc('square',mf(m),t,sd*.5,.018,B.pump,3500);}
  const L=S.lead[step];if(L){const d=L.len*sd*.92;
    const o=vOsc('square',mf(L.m),t,d,S.leadVol,B.lead,3600);vOsc('sawtooth',mf(L.m),t,d,S.leadVol*.6,B.lead,3000,9);
    if(d>sd*3){const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=6;lg.gain.value=mf(L.m)*.012;lfo.connect(lg).connect(o.frequency);lfo.start(t+sd*2);lfo.stop(t+d+.2)}
    vOsc('triangle',mf(L.m+12),t,d,S.leadVol*.35,B.lead);}
}
setInterval(()=>{if(!AC||!MUS.song||AC.state!=='running')return;const S=MUS.song;const sd=60/S.bpm/4/MUS.tempo;
  if(MUS.bus.dly)MUS.bus.dly.delayTime.setTargetAtTime(sd*3,AC.currentTime,.1);
  if(MUS.next<AC.currentTime-.2)MUS.next=AC.currentTime+.05;
  while(MUS.next<AC.currentTime+.3){   // schedule .3s ahead so a busy moment on the page can't make the music skip
    playStep(S,MUS.step,MUS.next,sd);MUS.next+=sd;MUS.step=(MUS.step+1)%S.len;}},25);
