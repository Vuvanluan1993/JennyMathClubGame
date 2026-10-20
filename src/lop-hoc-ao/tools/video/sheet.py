import subprocess,sys,json,os
from PIL import Image
for n in sys.argv[1:]:
    m=json.load(open(n+'.json'));ss=max(0,(m['ready']-m['f0'])/1000)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',n+'.mp4']).decode())
    ts=[ss+i*(d-ss)/11 for i in range(12)]
    ims=[]
    for i,t in enumerate(ts):
        subprocess.run(['ffmpeg','-loglevel','error','-y','-ss',str(t),'-i',n+'.mp4','-frames:v','1','/tmp/_f.png']);ims.append(Image.open('/tmp/_f.png').resize((195,422)))
    c=Image.new('RGB',(195*6+25,422*2+5),'black')
    for i,im in enumerate(ims):c.paste(im,((i%6)*200,(i//6)*427))
    c.save(n+'_sheet.png');print(n,'dur',round(d,1),'ss',round(ss,1),'audio',('a0' in m) and round((m['a0']-m['f0'])/1000,2))
