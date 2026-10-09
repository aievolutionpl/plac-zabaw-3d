import cv2,os,sys
D=os.path.dirname(os.path.abspath(__file__))
im=cv2.imread(os.path.join(D,'..','models','photo.png'))
out=os.path.expanduser('~/.hermes/cache/scratch')
def gridcrop(n,x,y,w,h,s,step=20):
    c=im[y:y+h,x:x+w].copy();c=cv2.resize(c,None,fx=s,fy=s,interpolation=cv2.INTER_CUBIC)
    for gx in range((x//step+1)*step,x+w,step):
        X=int((gx-x)*s);cv2.line(c,(X,0),(X,c.shape[0]),(255,255,255),1)
        if gx%(step*2)==0:cv2.putText(c,str(gx),(X+2,12),cv2.FONT_HERSHEY_SIMPLEX,.42,(0,255,255),1)
    for gy in range((y//step+1)*step,y+h,step):
        Y=int((gy-y)*s);cv2.line(c,(0,Y),(c.shape[1],Y),(255,255,255),1)
        if gy%(step*2)==0:cv2.putText(c,str(gy),(2,Y-2),cv2.FONT_HERSHEY_SIMPLEX,.42,(255,255,0),1)
    cv2.imwrite(os.path.join(out,f'g_{n}.jpg'),c,[cv2.IMWRITE_JPEG_QUALITY,90])
gridcrop('struct',580,90,444,330,2.3)
gridcrop('train',0,200,400,200,2.5)
gridcrop('front',380,420,644,358,1.6,40)
