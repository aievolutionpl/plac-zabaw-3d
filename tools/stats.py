import cv2,numpy as np,os,sys
D=os.path.dirname(os.path.abspath(__file__))
a=cv2.imread(os.path.join(D,'..','models','photo.png'))
b=cv2.imread(sys.argv[1]);b=cv2.resize(b,(a.shape[1],a.shape[0]))
def mk(im):
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)];Y=np.arange(im.shape[0])[:,None]
    return {'blue':(h>=95)&(h<=125)&(s>110)&(v>70)&(Y>300)&(Y<500),'orange':(h>=5)&(h<=22)&(s>130)&(v>130)&(Y>260)&(Y<500)}
A=mk(a)
for k,m in A.items():
    ys,xs=np.nonzero(m);print(k,'photo bbox',xs.min(),ys.min(),xs.max(),ys.max(),'centroid',int(xs.mean()),int(ys.mean()))
    pa=a[m].mean(0)[::-1].astype(int);pb=b[m].mean(0)[::-1].astype(int);print('  photo RGB',pa,'render RGB at same px',pb)
B=mk(b)
for k,m in B.items():
    ys,xs=np.nonzero(m)
    if len(xs):print(k,'render bbox',xs.min(),ys.min(),xs.max(),ys.max(),'centroid',int(xs.mean()),int(ys.mean()),'n',m.sum(),'photo n',A[k].sum())
