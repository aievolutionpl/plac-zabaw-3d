import cv2,os
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(os.path.join(D,'..','models','photo.png'))
out=os.path.expanduser('~/.hermes/cache/scratch')
def crop(n,x,y,w,h,s=2.2):
    c=im[y:y+h,x:x+w];c=cv2.resize(c,None,fx=s,fy=s,interpolation=cv2.INTER_CUBIC)
    cv2.imwrite(os.path.join(out,f'c_{n}.jpg'),c,[cv2.IMWRITE_JPEG_QUALITY,92])
crop('struct',560,90,464,400)
crop('train',0,200,420,230)
crop('front',0,380,1024,398,1.2)
