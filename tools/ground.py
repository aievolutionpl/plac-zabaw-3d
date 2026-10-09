import cv2,numpy as np,os,json
from scipy import ndimage as ndi
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(os.path.join(D,'..','models','photo.png'));H,W=im.shape[:2]   # 778x1024
VF,HZ,CY=50.0,105.0,7.0
f=(H/2)/np.tan(np.radians(VF/2));pitch=np.arctan((H/2-HZ)/f)
# --- klasyfikacja pikseli zdjęcia
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)]
Y=np.arange(H)[:,None]+np.zeros((1,W),int)
cls=np.full((H,W),255,np.uint8)   # 255 = nieznane
C={'grass':0,'blue':1,'orange':2,'sand':3,'path':4}
cls[(h>=33)&(h<=80)&(s>50)]=C['grass']
cls[(h>=95)&(h<=125)&(s>110)&(v>70)]=C['blue']
cls[(h>=5)&(h<=22)&(s>130)&(v>130)]=C['orange']
cls[(h>=10)&(h<=28)&(s>20)&(s<135)&(v>150)&(cls==255)]=C['sand']
cls[(s<50)&(v>55)&(v<165)&(cls==255)]=C['path']
cls[Y<215]=0
# usuń drobny szum, wypełnij nieznane najbliższym znanym (sprzęt zasłania podłoże)
k=np.ones((5,5),np.uint8)
for c in range(5):
    m=(cls==c).astype(np.uint8);m=cv2.morphologyEx(m,cv2.MORPH_OPEN,k);cls[(cls==c)&(m==0)]=255
unk=cls==255
idx=ndi.distance_transform_edt(unk,return_distances=False,return_indices=True)
cls=cls[idx[0],idx[1]]
# majority filter (wygładzenie)
oh=np.stack([(cls==c).astype(np.float32) for c in range(5)],-1)
oh=cv2.GaussianBlur(oh,(0,0),3);cls=oh.argmax(-1).astype(np.uint8)
cv2.imwrite(os.path.expanduser('~/.hermes/cache/scratch/cls.png'),np.array([[90,160,70],[165,110,35],[65,125,230],[160,190,225],[120,115,120]],np.uint8)[cls])
# --- teksturowanie podłoża: odwrotne rzutowanie
cs,sn=np.cos(pitch),np.sin(pitch)
def to_img(X,Z):
    P=np.stack([X,np.zeros_like(X)-CY,Z],-1)       # względem kamery (cam w (0,CY,0))
    # Rx(+pitch): y' = y*cos - z*sin ; z' = y*sin + z*cos
    y=P[...,1]*cs-P[...,2]*sn; z=P[...,1]*sn+P[...,2]*cs; x=P[...,0]
    u=W/2+f*x/(-z); vv=H/2-f*y/(-z); return u,vv,z
# zakres: z przy v=215 .. v=778
def gz(vv):
    d=np.array([0,-(vv-H/2)/f,-1.0]);y=d[1]*cs+d[2]*sn*-1 if False else None
    # Rx(-pitch)
    yw=d[1]*cs+d[2]*sn; zw=-d[1]*sn+d[2]*cs; t=-CY/yw; return zw*t
zf,zn=gz(215),gz(778)
xs=lambda z: (W/2)/f*(CY/ (CY) )*abs(z)  # przybliżenie
XL=abs(zf)*0.66
N=2048;x0,x1=-XL,XL;z0,z1=zf-5,min(zn+2,-0.5)
TX=(np.linspace(x0,x1,N));TZ=(np.linspace(z0,z1,N))
X,Z=np.meshgrid(TX,TZ)
u,vv,zc=to_img(X,Z)
valid=(zc<-0.05)&(u>=0)&(u<W-1)&(vv>=215)&(vv<H-1)
ui=np.clip(u,0,W-1).astype(int);vi=np.clip(vv,0,H-1).astype(int)
tc=np.where(valid,cls[vi,ui],0)
pal=np.array([[70,110,40],[31,110,165],[231,125,65],[221,190,160],[118,107,108]],np.float32)   # RGB
rng=np.random.default_rng(3);noise=cv2.GaussianBlur(rng.normal(0,1,(N,N)).astype(np.float32),(0,0),1.2)
tex=pal[tc]*(1+0.07*noise[...,None])
gn=cv2.GaussianBlur(rng.normal(0,1,(N,N)).astype(np.float32),(0,0),5)
tex[tc==0]*=(1+0.12*gn[tc==0][:,None])
tex=np.clip(tex,0,255).astype(np.uint8)   # odwróć wiersze: góra tekstury = z0 (dalej)... patrz JS
cv2.imwrite(os.path.join(D,'..','models','ground.jpg'),tex[...,::-1],[cv2.IMWRITE_JPEG_QUALITY,90])
json.dump({'x0':x0,'x1':x1,'z0':z0,'z1':z1},open(os.path.join(D,'..','models','ground.json'),'w'))
print('bounds',x0,x1,z0,z1,'valid%',valid.mean(),'classes',np.bincount(tc.ravel(),minlength=5)/tc.size)
