import * as THREE from 'three';
import {OrbitControls} from 'three/addons/OrbitControls.js';
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;document.body.appendChild(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0xbfe6ff);S.fog=new THREE.Fog(0xbfe6ff,45,110);
const C=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,300);C.position.set(18,13,20);
const O=new OrbitControls(C,R.domElement);O.enableDamping=true;O.maxPolarAngle=1.5;O.target.set(0,1.5,0);O.autoRotate=true;O.autoRotateSpeed=.6;
a.onclick=()=>O.autoRotate=!O.autoRotate;
S.add(new THREE.HemisphereLight(0xffffff,0x8ab070,1.1));
const sun=new THREE.DirectionalLight(0xfff1d6,2.6);sun.position.set(14,26,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:1,far:80});sun.shadow.bias=-.0004;S.add(sun);
const M=(c,r=.55,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const P=0x7b4dd6,Y=0xffc823,Or=0xff8a1f,B=0x1e88e5,G=0x2fb36b,Rd=0xe53935,W=0xf4f4f4;
function add(g,m,x,y,z,p=S){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
const box=(w,h,d,c,x,y,z,p)=>add(new THREE.BoxGeometry(w,h,d),M(c),x,y,z,p);
const cyl=(r,h,c,x,y,z,p,s=24)=>add(new THREE.CylinderGeometry(r,r,h,s),M(c),x,y,z,p);
const spr=[];
// grass
const gr=add(new THREE.CircleGeometry(80,64),M(0x6fbf5a,1),0,0,0);gr.rotation.x=-Math.PI/2;gr.castShadow=false;
// soft floor tiles (blue/orange checker-ish zones)
const fl=new THREE.Group();S.add(fl);
for(let i=-8;i<8;i++)for(let j=-6;j<6;j++){const x=i*2+1,z=j*2+1;if(x*x/ 256+z*z/ 144>1.0)continue;
 const c=((i*3+j*7)%5+5)%5<2?Or:B;box(2,.12,2,c,x,.06,z,fl).scale.set(.98,1,.98);}
// sandpit
const sand=cyl(4.2,.3,0xe9cf93,-1,.2,2,S,48);sand.material.roughness=1;
const rim=add(new THREE.TorusGeometry(4.2,.22,12,64),M(Y),-1,.4,2);rim.rotation.x=Math.PI/2;
// merry-go-round
const mg=new THREE.Group();mg.position.set(-1,.4,2);S.add(mg);
cyl(.12,1.2,0xb0b0b8,0,.6,0,mg);
const disc=cyl(1.8,.15,Rd,0,.25,0,mg,48);
for(let i=0;i<4;i++){const a=i*Math.PI/2;const s=add(new THREE.CylinderGeometry(1.8,1.8,.16,12,1,false,a,Math.PI/2),M(i%2?Y:P),0,.26,0,mg);}
const ring=add(new THREE.TorusGeometry(1.0,.05,8,40),M(0xdddddd,.3,.8),0,1.15,0,mg);ring.rotation.x=Math.PI/2;
for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;cyl(.04,.9,0xdddddd,Math.cos(a)*1.0,.7,Math.sin(a)*1,mg,8);}
// play tower with slide
const T=new THREE.Group();T.position.set(6,0,-3);S.add(T);
for(const[dx,dz]of[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]])box(.3,4.5,.3,P,dx,2.25,dz,T);
box(3.6,.2,3.6,Or,0,2.2,0,T);
// roof
const roof=add(new THREE.ConeGeometry(2.9,1.6,4),M(Y),0,5.3,0,T);roof.rotation.y=Math.PI/4;
for(const dx of[-1.5,1.5])for(const dz of[-1.5,1.5])box(.3,.5,.3,P,dx,4.7,dz,T);
for(const dz of[-1.5,1.5])box(3.3,.1,.1,B,0,3.3,dz,T);
box(.1,.9,3.3,G,-1.5,2.75,0,T);
// ladder rungs
for(let i=0;i<8;i++)box(1.2,.08,.1,0xdddddd,0,.3+i*.28,1.9+i*.01,T);
box(.1,2.4,.1,P,-.6,1.2,1.9,T);box(.1,2.4,.1,P,.6,1.2,1.9,T);
// slide (tube-ish ramp)
const sl=new THREE.Group();sl.position.set(1.8,2.2,0);T.add(sl);
const L=7,ang=Math.atan2(2.1,L);
const ramp=new THREE.Group();ramp.rotation.z=-ang;ramp.position.set(L/2,-1,0);sl.add(ramp);
const len=Math.hypot(L,2.1);
box(len,.1,1.2,B,0,0,0,ramp);box(len,.4,.1,B,0,.2,.6,ramp);box(len,.4,.1,B,0,.2,-.6,ramp);
// rope climbing net + arch
const arch=new THREE.Group();arch.position.set(-8,0,-4);S.add(arch);
for(const dx of[-2.5,2.5])cyl(.15,3.4,Or,dx,1.7,0,arch);
const top=add(new THREE.TorusGeometry(2.5,.15,12,40,Math.PI),M(Or),0,3.3,0,arch);
for(let i=0;i<6;i++)cyl(.04,5.2,0xffffff,-2.3+i*.92,1.6,.05,arch,6).scale.set(1,.55,1);
for(let i=0;i<6;i++){const h=add(new THREE.CylinderGeometry(.04,.04,5,6),M(0xffffff),0,.5+i*.55,.05,arch);h.rotation.z=Math.PI/2;h.scale.set(1,.95,1)}
// monkey bars / jungle gym
const mb=new THREE.Group();mb.position.set(-5,0,-9);S.add(mb);
for(const dx of[-3,3])for(const dz of[-1,1]){const l=cyl(.1,3,G,dx,1.5,dz,mb);l.rotation.z=dx>0?.12:-.12}
for(let i=0;i<7;i++){const r=cyl(.06,2.2,W,-2.4+i*.8,3,0,mb,8);r.rotation.x=Math.PI/2}
// train
const tr=new THREE.Group();tr.position.set(2,0,8);tr.rotation.y=-.4;S.add(tr);
const wheel=(x,z,p)=>{const w=cyl(.4,.2,0x333333,x,.4,z,p);w.rotation.x=Math.PI/2};
// loco
box(2.6,1.4,1.8,Rd,0,1.1,0,tr);cyl(.5,2.0,Rd,.7,1.5,0,tr).rotation.z=Math.PI/2;
tr.children[tr.children.length-1].position.set(-.6,1.5,0);
box(1.6,1.0,1.9,Y,.7,2.2,0,tr).scale.set(.8,1,1);cyl(.2,.7,0x222222,-1.1,2.35,0,tr);
[[-.8,1],[.8,1],[-.8,-1],[.8,-1]].forEach(([x,z])=>wheel(x,z,tr));
for(let k=1;k<=2;k++){const x=3.4*k;box(2.8,1.2,1.8,k==1?B:G,x,1,0,tr);box(2.8,.12,1.8,0xffffff,x,1.65,0,tr);
 for(const s of[-.7,.7])box(.1,.7,.1,Y,x+s,2,.8,tr);
 [[-.8,1],[.8,1],[-.8,-1],[.8,-1]].forEach(([dx,z])=>wheel(x+dx,z,tr));box(.9,.05,.9,Or,x,1.7,0,tr);}
box(.3,.15,.2,0x555555,1.8,.55,0,tr);
// spring riders
for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(-10+i*2,0,6);S.add(g);cyl(.35,.8,0x444,0,.4,0,g,12).scale.set(.4,1,.4);
 const b=add(new THREE.SphereGeometry(.55,16,12),M([Y,P,Rd][i]),0,1.2,0,g);b.scale.set(1.3,.8,.7);g.userData.s=i;spr.push(g)}
// swing
const sw=new THREE.Group();sw.position.set(10,0,6);S.add(sw);
for(const dx of[-2,2])for(const dz of[-1,1]){const l=cyl(.1,4,B,dx,2,dz*.8,sw);l.rotation.z=dx>0?-.15:.15}
const bar=cyl(.1,4.3,B,0,3.9,0,sw);bar.rotation.z=Math.PI/2;
const swings=[];for(const x of[-.9,.9]){const g=new THREE.Group();g.position.set(x,3.85,0);sw.add(g);
 for(const s of[-.3,.3])cyl(.015,2.6,0x999999,s,-1.3,0,g,6);box(.8,.08,.35,Or,0,-2.6,0,g);swings.push(g)}
// fence
for(let i=0;i<60;i++){const a=i/60*Math.PI*2;const x=Math.cos(a)*19,z=Math.sin(a)*14;if(a>0.2&&a<0.5)continue;
 box(.2,1.1,.2,i%2?Or:B,x,.55,z);}
// trees & bushes
function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);S.add(g);cyl(.3,2.5,0x7a4a26,0,1.25,0,g,8);
 for(const[y,r]of[[3,1.8],[4,1.4],[4.9,.9]])add(new THREE.IcosahedronGeometry(r,1),M(0x2e9d4f,.9),0,y,0,g)}
[[-22,-8],[-24,6],[22,-12],[24,4],[-14,-22],[8,-24],[16,16],[-18,18],[0,-26]].forEach(([x,z],i)=>tree(x,z,1+i%3*.2));
for(let i=0;i<14;i++){const a=i*0.9;add(new THREE.IcosahedronGeometry(.7,1),M(0x3fae5a,.9),Math.cos(a)*21,.5,Math.sin(a)*15)}
// clouds
const clouds=[];for(let i=0;i<7;i++){const g=new THREE.Group();for(let j=0;j<4;j++)add(new THREE.SphereGeometry(2+Math.random()*1.5,12,10),new THREE.MeshBasicMaterial({color:0xffffff}),j*2.2,Math.random(),0,g);
 g.position.set(-60+i*20,30+Math.random()*8,-40+Math.random()*30);S.add(g);clouds.push(g)}
// flowers
for(let i=0;i<60;i++){const a=Math.random()*6.28,r=17+Math.random()*3;const x=Math.cos(a)*r*1.1,z=Math.sin(a)*r*.8;
 add(new THREE.SphereGeometry(.13,8,6),M([Rd,Y,P,0xff7ab8][i%4]),x,.15,z)}
addEventListener('resize',()=>{C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});
const clk=new THREE.Clock();
R.setAnimationLoop(()=>{const t=clk.getElapsedTime();mg.rotation.y=t*.8;
 swings.forEach((g,i)=>g.rotation.x=Math.sin(t*1.5+i)*.5);
 spr.forEach((g,i)=>g.children[1].rotation.z=Math.sin(t*2+i)*.25);
 clouds.forEach(c=>{c.position.x+=.01;if(c.position.x>80)c.position.x=-80});
 O.update();R.render(S,C)});
