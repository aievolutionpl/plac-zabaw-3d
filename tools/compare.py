import cv2,numpy as np,os,sys
D=os.path.dirname(os.path.abspath(__file__))
a=cv2.imread(os.path.join(D,'..','models','photo.png'))
b=cv2.imread(sys.argv[1]);b=cv2.resize(b,(a.shape[1],a.shape[0]))
def masks(im):
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)];Y=np.arange(im.shape[0])[:,None]
    return {'blue':(h>=100)&(h<=122)&(s>130)&(v>90)&(Y>300)&(Y<500),
            'orange':(h>=6)&(h<=20)&(s>150)&(v>150)&(Y>260)&(Y<500),
            'sand':(h>=12)&(h<=26)&(s>25)&(s<130)&(v>160)&(Y>280),
            'green':(h>=33)&(h<=75)&(s>60)&(Y>600)}
A=masks(a);B=masks(b)
for k in A:
    i=(A[k]&B[k]).sum();u=(A[k]|B[k]).sum();print(k,'IoU=%.2f'%(i/max(u,1)),'photo=%d render=%d'%(A[k].sum(),B[k].sum()))
# side by side
sb=np.hstack([a,b]);cv2.imwrite(os.path.expanduser('~/.hermes/cache/scratch/sbs.jpg'),cv2.resize(sb,None,fx=.8,fy=.8),[cv2.IMWRITE_JPEG_QUALITY,88])
