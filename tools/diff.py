import cv2,numpy as np,os,sys
D=os.path.dirname(os.path.abspath(__file__))
a=cv2.imread(os.path.join(D,'..','models','photo.png'))
b=cv2.imread(sys.argv[1]);b=cv2.resize(b,(a.shape[1],a.shape[0]))
def m(im):
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);h,s,v=[hsv[...,i].astype(int) for i in range(3)]
    return (h>=100)&(h<=122)&(s>130)&(v>90), (h>=6)&(h<=20)&(s>150)&(v>150)
out=np.zeros(a.shape,np.uint8)
for k,(ma,mb) in enumerate(zip(m(a),m(b))):
    col=[(255,0,0),(0,140,255)][k]
    out[ma&~mb]=(0,255,0)   # tylko zdjęcie = zielony
    out[mb&~ma]=(0,0,255)   # tylko render = czerwony
    out[ma&mb]=col
cv2.imwrite(os.path.expanduser('~/.hermes/cache/scratch/diff.jpg'),out,[cv2.IMWRITE_JPEG_QUALITY,88])
