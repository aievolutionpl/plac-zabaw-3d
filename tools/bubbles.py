import cv2,numpy as np,os,json
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(os.path.join(D,'..','models','photo.png'));H,W=im.shape[:2]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)]
Y=np.arange(H)[:,None]
def bb(m,minA=3000):
    m8=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    n,l,st,ce=cv2.connectedComponentsWithStats(m8);r=[]
    for i in range(1,n):
        if st[i,4]>minA:r.append([int(x) for x in st[i,:4]]+[int(st[i,4])])
    return sorted(r,key=lambda a:-a[4])[:4]
out={}
out['purple']=bb((h>=125)&(h<=150)&(s>90)&(v>80)&(Y>450))
out['yellow']=bb((h>=22)&(h<=32)&(s>150)&(v>180)&(Y>450))
out['orangeBubble']=bb((h>=8)&(h<=17)&(s>180)&(v>200)&(Y>600))
print(json.dumps(out))
# mean colors for palette
def mc(m):
    p=im[m];return [int(x) for x in p.mean(0)[::-1]] if len(p) else None
pal={'blue':mc((h>=100)&(h<=122)&(s>150)&(v>110)&(Y>310)&(Y<480)),'orange':mc((h>=8)&(h<=20)&(s>170)&(v>180)&(Y<480)&(Y>270)),
'sand':mc((h>=14)&(h<=24)&(s>25)&(s<110)&(v>180)&(Y>500)),'red':mc(((h<=5)|(h>=172))&(s>150)&(v>110)&(Y>180)&(Y<250)),
'grass':mc((h>=33)&(h<=75)&(s>70)&(Y>690)),'path':mc((s<40)&(v>60)&(v<130)&(Y>650)&(np.arange(W)[None,:]<250))}
print(json.dumps(pal))
