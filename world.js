import * as THREE from 'three';
import {OrbitControls} from 'three/addons/OrbitControls.js';

const R=new THREE.WebGLRenderer({antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
document.body.appendChild(R.domElement);
const S=new THREE.Scene();
{const c=document.createElement('canvas');c.width=4;c.height=512;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,512);
 gr.addColorStop(0,'#5aa9e6');gr.addColorStop(.55,'#9ccff2');gr.addColorStop(1,'#dff0fa');g.fillStyle=gr;g.fillRect(0,0,4,512);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;S.background=t;}
S.fog=new THREE.Fog(0xcfe6f5,90,260);
const C=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,600);C.position.set(17,15,30);
const O=new OrbitControls(C,R.domElement);O.enableDamping=true;O.maxPolarAngle=1.48;O.minDistance=6;O.maxDistance=90;O.target.set(0,1,2);O.autoRotateSpeed=.5;
document.getElementById('a').onclick=()=>O.autoRotate=!O.autoRotate;
S.add(new THREE.HemisphereLight(0xdfefff,0x7aa860,1.25));
const sun=new THREE.DirectionalLight(0xfff3dc,3.2);sun.position.set(-22,38,16);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);
Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:120});sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;S.add(sun);

const mats={};
const M=(c,r=.6,m=0)=>{const k=c+'_'+r+'_'+m;return mats[k]||(mats[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}))};
function add(g,m,x=0,y=0,z=0,p=S){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
const box=(w,h,d,c,x,y,z,p=S,r=.6,m=0)=>add(new THREE.BoxGeometry(w,h,d),M(c,r,m),x,y,z,p);
const cyl=(r,h,c,x,y,z,p=S,s=20,r2=.5,m=0)=>add(new THREE.CylinderGeometry(r,r,h,s),M(c,r2,m),x,y,z,p);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const GREY=0xd5d9df,BLUE=0x1f6fe0,ORG=0xff7a12,RED=0xe0242b,YEL=0xffcc1a,GRN=0x2ea84a;

// ground
{const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle='#5fb04a';g.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){g.fillStyle=`hsl(${95+rnd()*25},${45+rnd()*25}%,${34+rnd()*18}%)`;g.fillRect(rnd()*512,rnd()*512,2+rnd()*3,2+rnd()*3)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(40,40);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 const gr=add(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({map:t,roughness:1}));gr.rotation.x=-Math.PI/2;gr.castShadow=false;}
function blob(cx,cz,rx,rz,s=0,n=72){const sh=new THREE.Shape();for(let i=0;i<n;i++){const a=i/n*Math.PI*2;
 const k=1+.10*Math.sin(3*a+s)+.07*Math.sin(5*a+2*s)+.04*Math.sin(7*a+3*s);const x=cx+Math.cos(a)*rx*k,y=-(cz+Math.sin(a)*rz*k);i?sh.lineTo(x,y):sh.moveTo(x,y)}sh.closePath();return sh}
function slab(shape,h,col,r=.9){const m=add(new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,curveSegments:1}),M(col,r));m.rotation.x=-Math.PI/2;m.castShadow=false;return m}
function ribbon(pts,w,col,y0){const cv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])));const N=120,pos=[],idx=[];
 for(let i=0;i<=N;i++){const t=i/N,p=cv.getPoint(t),tg=cv.getTangent(t),nx=-tg.z,nz=tg.x;pos.push(p.x+nx*w/2,0,p.z+nz*w/2,p.x-nx*w/2,0,p.z-nz*w/2)}
 for(let i=0;i<N;i++){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const m=add(g,new THREE.MeshStandardMaterial({color:col,roughness:.95,side:THREE.DoubleSide}),0,y0,0);m.castShadow=false;return m}
const pathA=[[-60,-34],[-34,-22],[-23,-8],[-22,5],[-17,14],[-6,19],[8,21],[26,19],[50,24]];
const pathB=[[-20,-24],[0,-20],[22,-16],[48,-26]];
for(const p of[pathA,pathB]){ribbon(p,5.2,0xc7c9cc,.012);ribbon(p,4.4,0x4a4d52,.02)}
slab(blob(-13,0,6.8,9.2,1.3),.14,0xc9c9c4);slab(blob(-13,0,6.5,8.9,1.3),.17,0xefe4c8,1);
slab(blob(11,10.5,4.9,4.9,.4),.14,0xc9c9c4);slab(blob(11,10.5,4.6,4.6,.4),.17,0xefe4c8,1);
slab(blob(5,-2,10.5,8.2,2.1),.12,0x1769e0,.85);
slab(blob(2.5,-1,5,3.8,.8),.15,0xff7414,.85);
slab(blob(7.5,3.6,3.6,1.9,2.2),.15,0xff7414,.85);
slab(blob(11.5,-5.4,2.6,1.4,.5),.15,0xff7414,.85);
{const w=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.8});
 const arc=add(new THREE.TorusGeometry(2.6,.07,6,60,Math.PI*1.2),w,8.6,.16,2.6);arc.rotation.x=-Math.PI/2;arc.castShadow=false;
 box(5,.02,.14,0xffffff,-1,.16,5.2).castShadow=false;
 const a2=add(new THREE.TorusGeometry(1.7,.07,6,50,Math.PI),w,13,.16,-2.4);a2.rotation.x=-Math.PI/2;a2.castShadow=false;}

// main structure
const base=.12;
function tower(x,z,h,roof,size){
 const g=new THREE.Group();g.position.set(x,base,z);S.add(g);const hs=size/2-.1;
 for(const dx of[-hs,hs])for(const dz of[-hs,hs])cyl(.075,h+1.5,GREY,dx,(h+1.5)/2,dz,g,12,.4,.5);
 box(size,.12,size,0xe4e7eb,0,h,0,g,.5);
 for(const[sx,sz,w,d]of[[0,-hs,size,.06],[-hs,0,.06,size],[hs,0,.06,size]]){box(w,.07,d,YEL,sx,h+.85,sz,g);box(w,.05,d,YEL,sx,h+.45,sz,g);
  for(let i=0;i<5;i++){const t=(i/4-.5)*(size-.3);cyl(.02,.85,YEL,w>d?t:sx,h+.42,w>d?sz:t,g,6)}}
 const rf=add(new THREE.ConeGeometry(size*.88,1.15,4),M(roof,.45),0,h+1.5+.57,0,g);rf.rotation.y=Math.PI/4;
 return g}
tower(-1.2,3.2,1.5,ORG,2.2);tower(4.2,-1.8,2.3,RED,2.4);tower(10.4,-1.8,1.5,BLUE,2.2);
{const g=new THREE.Group();g.position.set(1.4,base,-3.4);S.add(g);
 box(.12,1.8,2.2,ORG,0,1,0,g);for(let i=0;i<7;i++)add(new THREE.SphereGeometry(.09,10,8),M(0xffffff,.5),.08,.35+(i%4)*.38,-.8+Math.floor(i/4)*1+(i%2)*.4,g);
 cyl(.06,2,GREY,0,1,-1.05,g,10);cyl(.06,2,GREY,0,1,1.05,g,10)}
{const cv=new THREE.CatmullRomCurve3([new THREE.Vector3(5.2,base+2.55,-1.8),new THREE.Vector3(6.6,base+3.3,-1.8),new THREE.Vector3(8.1,base+3.2,-1.8),new THREE.Vector3(9.4,base+1.85,-1.8)]);
 add(new THREE.TubeGeometry(cv,40,.52,20,false),new THREE.MeshStandardMaterial({color:RED,roughness:.3,side:THREE.DoubleSide}));
 for(const t of[0,1]){const p=cv.getPoint(t);const r=add(new THREE.TorusGeometry(.52,.06,8,24),M(0xb01a20,.3),p.x,p.y,p.z);r.rotation.y=Math.PI/2}}
function ramp(a,b,w,col){const A_=new THREE.Vector3(...a),B_=new THREE.Vector3(...b);const d=A_.distanceTo(B_);const g=new THREE.Group();g.position.copy(A_).add(B_).multiplyScalar(.5);S.add(g);g.lookAt(B_);
 box(w,.07,d,col,0,0,0,g,.25,.4);box(.07,.28,d,col,w/2,.14,0,g,.25,.4);box(.07,.28,d,col,-w/2,.14,0,g,.25,.4)}
ramp([11.7,base+1.45,-1.2],[14.2,base+.12,3.0],1.0,0xcfd4da);
ramp([4.2,base+2.25,-.5],[3.0,base+.12,4.4],1.0,0xcfd4da);
{const g=new THREE.Group();g.position.set(10.4,base,-.2);S.add(g);g.rotation.x=-.18;
 box(.08,2,.08,BLUE,-.4,1,0,g);box(.08,2,.08,BLUE,.4,1,0,g);for(let i=0;i<7;i++)cyl(.03,.85,YEL,0,.25+i*.27,0,g,8).rotation.z=Math.PI/2}
{const a=new THREE.Vector3(0,base+1.55,2.4),b=new THREE.Vector3(3.1,base+2.35,-.6);const d=a.distanceTo(b);const g=new THREE.Group();g.position.copy(a).add(b).multiplyScalar(.5);S.add(g);g.lookAt(b);
 for(let i=0;i<7;i++)box(.025,.025,d,0x8a97a8,(i/6-.5)*1.1,0,0,g);for(let i=0;i<=14;i++)box(1.1,.025,.025,0x8a97a8,0,.01,(i/14-.5)*d,g);
 box(.08,.5,d,RED,.6,.3,0,g);box(.08,.5,d,RED,-.6,.3,0,g);box(.06,.06,d,RED,.6,.58,0,g);box(.06,.06,d,RED,-.6,.58,0,g)}
{const g=new THREE.Group();g.position.set(-3.6,base,5.2);S.add(g);cyl(.09,2.6,GREY,0,1.3,0,g,12,.4,.5);
 for(const sg of[1,-1]){const pts=[];for(let i=0;i<=80;i++){const t=i/80;pts.push(new THREE.Vector3(sg*Math.cos(t*Math.PI*5)*.55,.1+t*2.2,sg*Math.sin(t*Math.PI*5)*.55))}
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,.05,8,false),M(YEL,.4),0,0,0,g)}}

// train
const wheel=(p,x,z,c,hub)=>{const w=cyl(.4,.14,c,x,.4,z,p,24,.4);w.rotation.x=Math.PI/2;const h=cyl(.16,.16,hub,x,.4,z+(z>0?.04:-.04),p,16);h.rotation.x=Math.PI/2};
const train=new THREE.Group();train.position.set(-14.2,.17,-1);train.rotation.y=-Math.PI/2+.22;S.add(train);
box(2.4,.18,1.5,0x444851,0,.55,0,train);box(1.6,.95,1.4,RED,-.2,1.1,0,train,.4);box(1.3,1.35,1.5,YEL,-.9,1.35,0,train,.4);box(1.6,.12,1.9,BLUE,-.9,2.1,0,train,.4);
for(const z of[-.76,.76])box(.5,.45,.04,0x9fd8ff,-.9,1.55,z,train,.1);
{const bo=cyl(.52,1.8,0xb86a2e,.95,1.15,0,train,28);bo.rotation.z=Math.PI/2;
 for(let i=0;i<6;i++){const r=add(new THREE.TorusGeometry(.53,.045,8,28),M(0x8d4b1d,.5),.2+i*.3,1.15,0,train);r.rotation.y=Math.PI/2}
 cyl(.16,.5,0x2a2a2e,.7,1.85,0,train,14);cyl(.22,.1,0x2a2a2e,.7,2.12,0,train,14);
 const ft=add(new THREE.SphereGeometry(.5,20,12,0,Math.PI*2,0,Math.PI/2),M(0xffe08a,.4),1.85,1.15,0,train);ft.rotation.z=-Math.PI/2}
for(const x of[-.55,.75])for(const z of[-.8,.8])wheel(train,x,z,YEL,RED);
for(let k=0;k<2;k++){const c=new THREE.Group();c.position.set(-3.6-k*3.5,0,0);train.add(c);
 box(3,.18,1.5,0xcfd4da,0,.55,0,c);
 for(const px of[-1.4,1.4])for(const pz of[-.68,.68])cyl(.05,1.3,0xe9ecef,px,1.25,pz,c,10);
 box(3.2,.12,1.7,GRN,0,1.95,0,c,.4);box(2.2,.1,1.3,GRN,0,2.07,0,c,.4);
 for(const z of[-.74,.74]){box(3,.55,.07,GRN,0,.95,z,c,.5);box(3,.05,.07,0xe9ecef,0,1.3,z,c)}
 box(.1,.5,1.3,GRN,-1.45,.95,0,c);box(.1,.5,1.3,GRN,1.45,.95,0,c);box(.5,.1,1.2,0xe8cfa0,0,.78,0,c);
 for(const dx of[-.8,.8])for(const z of[-.8,.8])wheel(c,dx,z,BLUE,0xffffff)}
const springs=[];
function springRider(x,z,col,ry){const g=new THREE.Group();g.position.set(x,.17,z);g.rotation.y=ry;S.add(g);
 cyl(.5,.08,0x9aa0a8,0,.04,0,g,16);
 const pts=[];for(let i=0;i<=60;i++){const t=i/60;pts.push(new THREE.Vector3(Math.cos(t*Math.PI*14)*.16,.1+t*.8,Math.sin(t*Math.PI*14)*.16))}
 add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),180,.025,6,false),M(0x777d86,.3,.8),0,0,0,g);
 const top=new THREE.Group();top.position.y=.9;g.add(top);
 const b=add(new THREE.SphereGeometry(.5,20,14),M(col,.5),0,.35,0,top);b.scale.set(1.5,.85,.7);
 add(new THREE.SphereGeometry(.28,16,12),M(col,.5),.7,.7,0,top);
 add(new THREE.ConeGeometry(.08,.3,8),M(col,.5),.62,1.05,.1,top);add(new THREE.ConeGeometry(.08,.3,8),M(col,.5),.62,1.05,-.1,top);
 box(.5,.08,.5,0x4a4d52,-.05,.8,0,top);springs.push(top)}
springRider(-17.8,-1.2,0xeef0f2,.4);springRider(-17.6,2.2,0xc7ccd2,-.2);springRider(-17.4,5.4,0xeef0f2,.1);

// roundabout + bench
const rb=new THREE.Group();rb.position.set(11,.17,10.5);S.add(rb);
const spin=new THREE.Group();spin.position.y=.35;rb.add(spin);
cyl(.2,.4,0x2c2f34,0,.2,0,rb,16,.4,.5);cyl(1.55,.1,0xaeb4bc,0,0,0,spin,48,.35,.7);
cyl(.07,1.2,0x1c1e22,0,.6,0,spin,12,.4,.6);
for(let i=0;i<4;i++){const a=i*Math.PI/2+.3;const arc=add(new THREE.TorusGeometry(.78,.045,10,24,Math.PI),M(0x1c1e22,.4,.6),0,.9,0,spin);arc.rotation.y=-a;
 box(.55,.07,.35,0x111214,Math.cos(a)*.95,.38,Math.sin(a)*.95,spin).rotation.y=-a+Math.PI/2}
for(let i=0;i<=8;i++){const a=-.9+i*.22;const b=box(.35,.14,1.2,0xa5703a,11+Math.cos(a)*5.1,.55,10.5+Math.sin(a)*5.1,S,.8);b.rotation.y=-a;
 if(i%2==0)box(.15,.45,.15,0x6c4524,11+Math.cos(a)*5.1,.3,10.5+Math.sin(a)*5.1)}

// trees
function tree(x,z,s,blossom){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);S.add(g);
 const th=2.4+rnd()*1.2;cyl(.22,th,0x6b4a30,0,th/2,0,g,10,.9);
 const col=blossom?[0xf3a8c2,0xe987aa,0x9ed27f]:[0x3f9a46,0x4aa84f,0x2e8a3e,0x58b055];
 const n=5+Math.floor(rnd()*3);for(let i=0;i<n;i++){const r=1.2+rnd()*.8;add(new THREE.IcosahedronGeometry(r,2),M(col[Math.floor(rnd()*col.length)],.85),(rnd()-.5)*2.2,th+.6+rnd()*1.8,(rnd()-.5)*2.2,g)}}
[[-19,-6,1.2,1],[-20.5,-11,1.1,1],[-9,-13,1.25],[-3,-14,1.4],[3,-15.5,1.3],[10,-14,1.2],[17,-12,1.3],[20,2,1.2],[22,9,1.3],[-21,8,1.2,1],[-22,16,1.3],[-27,0,1.5],[-26,-14,1.5,1],[24,-5,1.4],[26,14,1.4],[15,22,1.4],[-12,24,1.4],[-1,26,1.5]].forEach(a=>tree(a[0],a[1],a[2],a[3]));
for(let n=0,t=0;n<70&&t<800;t++){const x=(rnd()-.5)*190,z=-20-rnd()*55+(rnd()<.35?70+rnd()*30:0);if(Math.abs(x)<28&&z>-24&&z<28)continue;tree(x,z,1.2+rnd()*.9,rnd()<.12);n++}
for(let i=0;i<28;i++){const a=rnd()*Math.PI*2,r=19+rnd()*8;const x=Math.cos(a)*r*1.15,z=Math.sin(a)*r*.7+3;if(z>20)continue;add(new THREE.IcosahedronGeometry(.6+rnd()*.5,1),M([0x3f9a46,0x2e8a3e,0xe987aa][i%3],.9),x,.4,z)}

// buildings
function winTex(tint){const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');g.fillStyle=tint;g.fillRect(0,0,128,256);
 for(let y=10;y<250;y+=22)for(let x=8;x<120;x+=20){g.fillStyle='#4b5563';g.fillRect(x,y,12,14);g.fillStyle='rgba(180,215,240,.55)';g.fillRect(x+1,y+1,10,6)}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const tints=['#e8e0cf','#d3d6d9','#cdbfa8','#e3dcd0','#c9ced3'];
for(let i=0;i<14;i++){const w=14+rnd()*10,h=26+rnd()*28;const t=winTex(tints[i%5]);t.repeat.set(Math.round(w/7),Math.round(h/14));
 const b=add(new THREE.BoxGeometry(w,h,12),new THREE.MeshStandardMaterial({map:t,roughness:.9}),-95+i*15+rnd()*4,h/2,-95-rnd()*14);b.castShadow=false}
// clouds
const clouds=[];
{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
 const tx=new THREE.CanvasTexture(c);for(let i=0;i<9;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false,fog:false}));
  sp.scale.set(70+rnd()*60,18+rnd()*10,1);sp.position.set(-160+i*40,70+rnd()*30,-130-rnd()*50);S.add(sp);clouds.push(sp)}}

addEventListener('resize',()=>{C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});
const clk=new THREE.Clock();
R.setAnimationLoop(()=>{const t=clk.getElapsedTime();spin.rotation.y=t*.7;
 springs.forEach((s,i)=>{s.rotation.z=Math.sin(t*2+i*1.3)*.22});
 clouds.forEach(c=>{c.position.x+=.03;if(c.position.x>190)c.position.x=-190});
 O.update();R.render(S,C)});
