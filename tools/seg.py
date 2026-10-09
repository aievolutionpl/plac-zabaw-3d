import cv2,numpy as np,json
im=cv2.imread('models/photo.png');H,W=im.shape[:2];hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
h,s,v=[hsv[...,i].astype(int) for i in range(3)]  # h 0-179
masks={
 'blue':(h>=100)&(h<=122)&(s>150)&(v>110),
 'orange':(h>=8)&(h<=20)&(s>170)&(v>180),
 'red':((h<=5)|(h>=172))&(s>150)&(v>110),
 'yellow':(h>=22)&(h<=32)&(s>150)&(v>180),
 'sand':(h>=14)&(h<=24)&(s>25)&(s<110)&(v>180),
 'grass':(h>=33)&(h<=75)&(s>70),
 'sky':(h>=95)&(h<=112)&(s<130)&(v>170)&(np.arange(H)[:,None]<300),
}
out=np.zeros_like(im);cols={'blue':(255,0,0),'orange':(0,140,255),'red':(0,0,255),'yellow':(0,255,255),'sand':(180,220,240),'grass':(0,160,0),'sky':(255,200,100)}
info={}
for k,m in masks.items():
    m8=m.astype(np.uint8);m8=cv2.morphologyEx(m8,cv2.MORPH_OPEN,np.ones((3,3),np.uint8));m8=cv2.morphologyEx(m8,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
    out[m8>0]=cols[k]
    n,lab,st,cen=cv2.connectedComponentsWithStats(m8)
    comps=[(int(st[i,4]),[int(x) for x in st[i,:4]],[int(cen[i][0]),int(cen[i][1])]) for i in range(1,n) if st[i,4]>400]
    comps.sort(reverse=True);info[k]=comps[:8]
    np.save(f'tools/m_{k}.npy',m8)
cv2.imwrite('tools/seg.png',out)
for k,c in info.items():
    print(k)
    for a,b,cn in c: print('  area',a,'bbox x,y,w,h',b,'center',cn)
# horizon: first row from top where grass dominates
g=masks['grass'];rows=g.sum(1);print('grass rows first>200px:',[y for y in range(H) if rows[y]>200][:1])
