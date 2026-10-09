import * as THREE from 'three';
import {OrbitControls} from 'three/addons/OrbitControls.js';
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);
R.outputColorSpace=THREE.SRGBColorSpace;document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x0b0f14);
const W=1024,H=778,ASP=W/H,hh=4,ww=hh*ASP;
const C=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
const D=(ww/2)/Math.tan(THREE.MathUtils.degToRad(45*ASP/2))*.0+7.2;C.position.set(0,0,D);
const O=new OrbitControls(C,R.domElement);O.enableDamping=true;O.target.set(0,0,-.6);
O.minAzimuthAngle=-.75;O.maxAzimuthAngle=.75;O.minPolarAngle=1.05;O.maxPolarAngle=1.95;O.minDistance=3;O.maxDistance=11;
const L=new THREE.TextureLoader();
Promise.all(['models/photo.png','models/depth.png'].map(u=>new Promise(r=>L.load(u,r)))).then(([tx,dt])=>{
 tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=16;
 const cv=document.createElement('canvas');cv.width=dt.image.width;cv.height=dt.image.height;const g=cv.getContext('2d');g.drawImage(dt.image,0,0);
 const px=g.getImageData(0,0,cv.width,cv.height).data;
 // smooth depth
 const dw=cv.width,dh=cv.height;const dep=new Float32Array(dw*dh);for(let i=0;i<dw*dh;i++)dep[i]=px[i*4]/255;
 const sm=(x,y)=>{let s=0,n=0;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const xx=Math.min(dw-1,Math.max(0,x+a)),yy=Math.min(dh-1,Math.max(0,y+b));s+=dep[yy*dw+xx];n++}return s/n};
 const SX=256,SY=Math.round(SX/ASP);const geo=new THREE.PlaneGeometry(1,1,SX,SY);const p=geo.attributes.position,uv=geo.attributes.uv;
 const SC=1.0,Z0=D; // reproject so the picture is identical from the start camera
 for(let i=0;i<p.count;i++){const u=uv.getX(i),v=uv.getY(i);
  const d=sm(Math.min(dw-1,Math.round(u*(dw-1))),Math.min(dh-1,Math.round((1-v)*(dh-1))));
  const z=-3.2+d*3.8; // depth: near(bright)=forward
  const s=(D-z)/D;  // perspective-correct scale so view from start is 1:1
  p.setXYZ(i,(u-.5)*ww*(D-z)/ (D-0)*1.0,(v-.5)*hh*(D-z)/(D-0)*1.0,z)}
 geo.computeVertexNormals();
 const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));S.add(m);
 const h=document.getElementById('l');h.style.opacity=0;setTimeout(()=>h.remove(),600)});
addEventListener('resize',()=>{C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});
R.setAnimationLoop(()=>{O.update();R.render(S,C)});
