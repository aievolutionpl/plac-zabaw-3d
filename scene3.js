import * as THREE from 'three';
import {OrbitControls} from 'three/addons/OrbitControls.js';
// ===== kamera dopasowana do zdjęcia 1024x778 (horyzont y≈105) =====
const IW=1024,IH=778,VF=50,HZ=105;
const f=(IH/2)/Math.tan(THREE.MathUtils.degToRad(VF/2));
const pitch=Math.atan((IH/2-HZ)/f), CAMY=7;
const camPos=new THREE.Vector3(0,CAMY,0);
function ground(u,v){ // piksel zdjęcia -> punkt na ziemi (x,z)
 let d=new THREE.Vector3((u-IW/2)/f,-(v-IH/2)/f,-1);
 d.applyAxisAngle(new THREE.Vector3(1,0,0),-pitch);
 const t=-CAMY/d.y;return new THREE.Vector3(d.x*t,0,d.z*t)}
const mpp=(v)=>{const a=ground(500,v),b=ground(501,v);return a.distanceTo(b)}; // metry na piksel na wysokości v

const R=new THREE.WebGLRenderer({antialias:true});const MOB=matchMedia('(pointer:coarse)').matches||innerWidth<800;R.setPixelRatio(Math.min(devicePixelRatio,MOB?1.5:2));R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
document.body.prepend(R.domElement);
const S=new THREE.Scene();
{const c=document.createElement('canvas');c.width=4;c.height=512;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,512);
 gr.addColorStop(0,'#4f9fe0');gr.addColorStop(.6,'#9fd0f2');gr.addColorStop(1,'#e2f1fb');g.fillStyle=gr;g.fillRect(0,0,4,512);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;S.background=t}
S.fog=new THREE.Fog(0xcfe3ee,60,200);
const fitFov=()=>{const a=innerWidth/innerHeight;return a<IW/IH?THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(VF/2))*(IW/IH)/a)):VF};
const C=new THREE.PerspectiveCamera(fitFov(),innerWidth/innerHeight,.5,400);
const Q=new URLSearchParams(location.search);
C.position.copy(camPos);C.rotation.set(-pitch,0,0,'YXZ');
const tgt=new THREE.Vector3(0,0,-1).applyAxisAngle(new THREE.Vector3(1,0,0),-pitch).multiplyScalar(18).add(camPos);
const O=new OrbitControls(C,R.domElement);O.target.copy(tgt);O.enableDamping=true;O.maxPolarAngle=1.5;O.minDistance=3;O.maxDistance=70;O.enablePan=false;O.rotateSpeed=MOB?.7:1;
if(!Q.get('free')){O.minAzimuthAngle=-1.1;O.maxAzimuthAngle=1.1}
O.update();O.autoRotateSpeed=.5;document.getElementById('a').onclick=()=>O.autoRotate=!O.autoRotate;
S.add(new THREE.HemisphereLight(0xdcecff,0x7aa860,1.3));
const sun=new THREE.DirectionalLight(0xfff1d6,3.2);sun.position.set(-14,26,2);sun.castShadow=true;sun.shadow.mapSize.set(MOB?2048:4096,MOB?2048:4096);
Object.assign(sun.shadow.camera,{left:-45,right:45,top:10,bottom:-60,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;
sun.target.position.set(0,0,-18);S.add(sun,sun.target);

const mats={};const M=(c,r=.6,m=0)=>{const k=c+'_'+r+'_'+m;return mats[k]||(mats[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}))};
function add(g,m,x=0,y=0,z=0,p=S){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
const box=(w,h,d,c,x,y,z,p=S,r=.6,m=0)=>add(new THREE.BoxGeometry(w,h,d),M(c,r,m),x,y,z,p);
const cyl=(r,h,c,x,y,z,p=S,s=20,r2=.5,m=0)=>add(new THREE.CylinderGeometry(r,r,h,s),M(c,r2,m),x,y,z,p);
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const GREY=0xd5d9df,BLUE=0x1f6fe0,ORG=0xff7a12,RED=0xc4202a,YEL=0xffcc1a,GRN=0x2ea84a;

// ===== podłoże =====
{const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#5a8f2c';g.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){g.fillStyle=`hsl(${75+rnd()*30},${40+rnd()*25}%,${24+rnd()*18}%)`;g.fillRect(rnd()*512,rnd()*512,2+rnd()*3,2+rnd()*3)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(50,50);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 const gr=add(new THREE.PlaneGeometry(600,600),new THREE.MeshStandardMaterial({map:t,roughness:1}));gr.rotation.x=-Math.PI/2;gr.castShadow=false}
const POLY=await (await fetch('models/polys.json')).json();
function flat(poly,col,y,r=.9){const sh=new THREE.Shape();let first=1;
 for(const [u,v] of poly){const g=ground(u,Math.max(v,215));first?(sh.moveTo(g.x,-g.z),first=0):sh.lineTo(g.x,-g.z)}
 const m=add(new THREE.ShapeGeometry(sh),M(col,r),0,y,0);m.rotation.x=-Math.PI/2;m.castShadow=false;m.material=m.material.clone();m.material.side=THREE.DoubleSide;m.material.polygonOffset=true;m.material.polygonOffsetFactor=-y*100;m.material.polygonOffsetUnits=-y*100;return m}
{const GJ=await (await fetch('models/ground.json')).json();
 const tx=await new THREE.TextureLoader().loadAsync('models/ground.jpg');tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=16;
 const gp=add(new THREE.PlaneGeometry(GJ.x1-GJ.x0,GJ.z1-GJ.z0),new THREE.MeshStandardMaterial({map:tx,roughness:.95}),(GJ.x0+GJ.x1)/2,.02,(GJ.z0+GJ.z1)/2);
 gp.rotation.x=-Math.PI/2;gp.castShadow=false}

// ===== elementy =====
const place=(g,u,v,ry=0,sc=1)=>{const p=ground(u,v);g.position.set(p.x,0,p.z);g.rotation.y=ry;g.scale.setScalar(sc);S.add(g);return g};
function tower(size,h,roofCol,roofShape){const g=new THREE.Group();const hs=size/2-.08;
 for(const dx of[-hs,hs])for(const dz of[-hs,hs])cyl(.07,h+1.6,GREY,dx,(h+1.6)/2,dz,g,12,.4,.5);
 box(size,.12,size,0xe4e7eb,0,h,0,g,.5);
 for(const[sx,sz,w,d]of[[0,-hs,size,.06],[-hs,0,.06,size],[hs,0,.06,size],[0,hs,size,.06]]){box(w,.07,d,YEL,sx,h+.85,sz,g);box(w,.05,d,YEL,sx,h+.45,sz,g);
  for(let i=0;i<5;i++){const t=(i/4-.5)*(size-.3);cyl(.02,.85,YEL,w>d?t:sx,h+.42,w>d?sz:t,g,6)}}
 const rf=add(roofShape==='hex'?new THREE.ConeGeometry(size*.78,1.25,6):new THREE.ConeGeometry(size*.88,1.2,4),M(roofCol,.45),0,h+1.6+.6,0,g);rf.rotation.y=roofShape==='hex'?0:Math.PI/4;
 return g}
function slide(len,drop,w,col){const g=new THREE.Group();const L=Math.hypot(len,drop);const b=new THREE.Group();b.rotation.x=Math.atan2(drop,len);g.add(b);
 box(w,.07,L,col,0,0,0,b,.25,.4);box(.07,.28,L,col,w/2,.14,0,b,.25,.4);box(.07,.28,L,col,-w/2,.14,0,b,.25,.4);b.position.set(0,drop/2+.1,len/2);return g}
function net(w,len){const g=new THREE.Group();for(let i=0;i<7;i++)box(.025,.025,len,0x8a97a8,(i/6-.5)*w,0,0,g);for(let i=0;i<=12;i++)box(w,.025,.025,0x8a97a8,0,.01,(i/12-.5)*len,g);box(.07,.5,len,RED,w/2,.3,0,g);box(.07,.5,len,RED,-w/2,.3,0,g);return g}
// wieża czerwona (heksagonalny dach) – lewa, wieża niebieska – prawa
const T1=place(tower(2.4,2.4,0xc4202a,'hex'),668,402,.15);
const T2=place(tower(2.4,2.1,0x1f66d6,'gable'),873,390,-.1);
const T0=place(tower(2.0,1.5,0xff7a12,'gable'),602,420,.2);
// tunel czerwony między wieżami
{const a=T1.position.clone().add(new THREE.Vector3(.4,3.4,0)),b=T2.position.clone().add(new THREE.Vector3(-.4,3.0,0));const mid=a.clone().add(b).multiplyScalar(.5).add(new THREE.Vector3(0,.7,0));
 const cv=new THREE.CatmullRomCurve3([a,mid,b]);add(new THREE.TubeGeometry(cv,50,.5,20,false),new THREE.MeshStandardMaterial({color:0xbd1f26,roughness:.3,side:THREE.DoubleSide}))}
{const g=slide(3.4,1.9,.9,0xcfd4da);const p=T2.position;g.position.set(p.x+1.4,1.7,p.z+.9);g.rotation.y=.35;S.add(g)}
{const g=slide(3,1.7,.9,0xcfd4da);const p=T1.position;g.position.set(p.x-1.6,1.45,p.z+1);g.rotation.y=-.2;S.add(g)}
{const g=net(1.1,3.2);const p=T1.position;g.position.set(p.x-.2,1.2,p.z+2.6);g.rotation.x=-.5;S.add(g)}
{const g=new THREE.Group();g.rotation.x=-.2;for(let i=0;i<7;i++)cyl(.03,.85,YEL,0,.2+i*.27,0,g,8).rotation.z=Math.PI/2;box(.08,2,.08,BLUE,-.4,1,0,g);box(.08,2,.08,BLUE,.4,1,0,g);place(g,845,430)}

// ===== pociąg (lewa strona, silnik z lewej) =====
const wheel=(p,x,z,c,hub)=>{const w=cyl(.4,.14,c,x,.4,z,p,24,.4);w.rotation.x=Math.PI/2;const h=cyl(.16,.16,hub,x,.4,z+(z>0?.04:-.04),p,16);h.rotation.x=Math.PI/2};
const train=new THREE.Group();
box(2.4,.18,1.5,0x444851,0,.55,0,train);box(1.6,.95,1.4,RED,-.2,1.1,0,train,.4);box(1.3,1.35,1.5,YEL,-.9,1.35,0,train,.4);box(1.6,.12,1.9,BLUE,-.9,2.1,0,train,.4);
for(const z of[-.76,.76])box(.5,.45,.04,0x9fd8ff,-.9,1.55,z,train,.1);
{const bo=cyl(.52,1.8,0xb86a2e,.95,1.15,0,train,28);bo.rotation.z=Math.PI/2;
 for(let i=0;i<6;i++){const r=add(new THREE.TorusGeometry(.53,.045,8,28),M(0x8d4b1d,.5),.2+i*.3,1.15,0,train);r.rotation.y=Math.PI/2}
 cyl(.16,.5,0x2a2a2e,.7,1.85,0,train,14);cyl(.22,.1,0x2a2a2e,.7,2.12,0,train,14);
 const ft=add(new THREE.SphereGeometry(.5,20,12,0,Math.PI*2,0,Math.PI/2),M(0xffe08a,.4),1.85,1.15,0,train);ft.rotation.z=-Math.PI/2}
for(const x of[-.55,.75])for(const z of[-.8,.8])wheel(train,x,z,YEL,RED);
for(let k=0;k<2;k++){const c=new THREE.Group();c.position.set(-3.6-k*3.5,0,0);train.add(c);
 box(3,.18,1.5,0xcfd4da,0,.55,0,c);for(const px of[-1.4,1.4])for(const pz of[-.68,.68])cyl(.05,1.3,0xe9ecef,px,1.25,pz,c,10);
 box(3.2,.12,1.7,GRN,0,1.95,0,c,.4);box(2.2,.1,1.3,GRN,0,2.07,0,c,.4);
 for(const z of[-.74,.74]){box(3,.55,.07,GRN,0,.95,z,c,.5);box(3,.05,.07,0xe9ecef,0,1.3,z,c)}
 box(.5,.1,1.2,0xe8cfa0,0,.78,0,c);for(const dx of[-.8,.8])for(const z of[-.8,.8])wheel(c,dx,z,BLUE,0xffffff)}
// silnik z LEWEJ strony zdjęcia -> obrót o 180°, pociąg skierowany w lewo
train.rotation.y=Math.PI;{const p=ground(175,345);train.position.set(p.x,.05,p.z);train.rotation.y=Math.PI-.18;S.add(train)}
// ===== bujaki =====
const springs=[];
function springRider(u,v,col,ry){const g=new THREE.Group();cyl(.5,.08,0x9aa0a8,0,.04,0,g,16);
 const pts=[];for(let i=0;i<=60;i++){const t=i/60;pts.push(new THREE.Vector3(Math.cos(t*Math.PI*14)*.16,.1+t*.8,Math.sin(t*Math.PI*14)*.16))}
 add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),180,.025,6,false),M(0x777d86,.3,.8),0,0,0,g);
 const top=new THREE.Group();top.position.y=.9;g.add(top);const b=add(new THREE.SphereGeometry(.5,20,14),M(col,.5),0,.35,0,top);b.scale.set(1.5,.85,.7);
 add(new THREE.SphereGeometry(.28,16,12),M(col,.5),.7,.7,0,top);add(new THREE.ConeGeometry(.08,.3,8),M(col,.5),.62,1.05,.1,top);add(new THREE.ConeGeometry(.08,.3,8),M(col,.5),.62,1.05,-.1,top);
 box(.5,.08,.5,0x4a4d52,-.05,.8,0,top);springs.push(top);place(g,u,v,ry)}
springRider(300,330,0xeef0f2,.4);springRider(40,360,0xc7ccd2,-.2);
// ===== karuzela w piaskownicy =====
const rb=new THREE.Group();const spin=new THREE.Group();spin.position.y=.35;rb.add(spin);
cyl(.2,.4,0x2c2f34,0,.2,0,rb,16,.4,.5);cyl(1.55,.1,0xaeb4bc,0,0,0,spin,48,.35,.7);cyl(.07,1.2,0x1c1e22,0,.6,0,spin,12,.4,.6);
for(let i=0;i<4;i++){const a=i*Math.PI/2+.3;const arc=add(new THREE.TorusGeometry(.78,.045,10,24,Math.PI),M(0x1c1e22,.4,.6),0,.9,0,spin);arc.rotation.y=-a;
 box(.55,.07,.35,0x111214,Math.cos(a)*.95,.38,Math.sin(a)*.95,spin).rotation.y=-a+Math.PI/2}
place(rb,800,590,0,1.15);
// ławka łukiem
{const c=ground(800,590);for(let i=0;i<=9;i++){const a=-.6+i*.2;const b=box(.35,.14,1.2,0xa5703a,c.x+Math.cos(a)*5.6,.55,c.z+Math.sin(a)*5.6,S,.8);b.rotation.y=-a}}

// ===== drzewa wzdłuż horyzontu i wokół =====
function tree(x,z,s,bl){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);S.add(g);
 const th=2.6+rnd()*1.4;cyl(.24,th,0x6b4a30,0,th/2,0,g,10,.9);
 const col=bl?[0xf3a8c2,0xe987aa,0x9ed27f]:[0x3f8f3c,0x4a9d48,0x2e7d32,0x5aa84c];
 const n=6+Math.floor(rnd()*3);for(let i=0;i<n;i++){const r=1.3+rnd()*.9;add(new THREE.IcosahedronGeometry(r,2),M(col[Math.floor(rnd()*col.length)],.85),(rnd()-.5)*2.4,th+.6+rnd()*2,(rnd()-.5)*2.4,g)}}
for(let u=-60;u<=1090;u+=34){const v=116+rnd()*14;const g=ground(u,v);tree(g.x*1.0,g.z,1.6+rnd()*.8,rnd()<.1)}
[[110,262,1.3,1],[345,250,1.2],[560,255,1.1],[760,268,1],[950,262,1.2]].forEach(a=>{const g=ground(a[0],a[1]);tree(g.x,g.z,a[2],a[3])});
// krzewy
for(let i=0;i<30;i++){const u=rnd()*1100-40,v=190+rnd()*40;const g=ground(u,v);add(new THREE.IcosahedronGeometry(.8+rnd()*.6,1),M(i%4?0x3f9a46:0xe987aa,.9),g.x,.5,g.z)}
// budynki w tle
function winTex(tint){const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');g.fillStyle=tint;g.fillRect(0,0,128,256);
 for(let y=10;y<250;y+=22)for(let x=8;x<120;x+=20){g.fillStyle='#4b5563';g.fillRect(x,y,12,14);g.fillStyle='rgba(180,215,240,.55)';g.fillRect(x+1,y+1,10,6)}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const tints=['#e8e0cf','#d3d6d9','#cdbfa8','#e3dcd0','#c9ced3'];
for(let i=0;i<9;i++){const w=16+rnd()*10,h=24+rnd()*20;const t=winTex(tints[i%5]);t.repeat.set(Math.round(w/7),Math.round(h/14));
 const b=add(new THREE.BoxGeometry(w,h,12),new THREE.MeshStandardMaterial({map:t,roughness:.9}),-70+i*18+rnd()*3,h/2,-95-rnd()*10);b.castShadow=false}
addEventListener('resize',()=>{C.aspect=innerWidth/innerHeight;C.fov=fitFov();C.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});
const clk=new THREE.Clock();
R.setAnimationLoop(()=>{const t=clk.getElapsedTime();spin.rotation.y=t*.7;springs.forEach((s,i)=>s.rotation.z=Math.sin(t*2+i*1.3)*.22);O.update();R.render(S,C)});
