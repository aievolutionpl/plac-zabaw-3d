import cv2,numpy as np,os,json
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(os.path.join(D,'..','models','photo.png'));H,W=im.shape[:2]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)]
Y=np.arange(H)[:,None];X=np.arange(W)[None,:]
ground=(Y>205)
M={
 'blue':(h>=100)&(h<=122)&(s>150)&(v>110)&(Y>300),
 'orange':(h>=8)&(h<=20)&(s>160)&(v>170)&(Y>270)&~((X>640)&(X<720)&(Y<380)),
 'sand':(h>=12)&(h<=26)&(s>25)&(s<120)&(v>170)&(Y>280),
 'path':(s<45)&(v>70)&(v<150)&(Y>150),
}
res={}
for k,m in M.items():
    m8=m.astype(np.uint8)*255
    m8=cv2.morphologyEx(m8,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    m8=cv2.morphologyEx(m8,cv2.MORPH_CLOSE,np.ones((21,21),np.uint8))
    cs,_=cv2.findContours(m8,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    out=[]
    for c in cs:
        if cv2.contourArea(c)<1500:continue
        a=cv2.approxPolyDP(c,3.0,True)[:,0,:]
        out.append(a.tolist())
    res[k]=out;print(k,[len(p) for p in out])
json.dump(res,open(os.path.join(D,'..','models','polys.json'),'w'))
vis=im.copy()
for k,col in zip(res,[(255,0,0),(0,140,255),(160,220,240),(80,80,80)]):
    for p in res[k]:cv2.polylines(vis,[np.array(p,np.int32)],True,col,2)
cv2.imwrite(os.path.expanduser('~/.hermes/cache/scratch/polys.jpg'),vis,[cv2.IMWRITE_JPEG_QUALITY,88])
