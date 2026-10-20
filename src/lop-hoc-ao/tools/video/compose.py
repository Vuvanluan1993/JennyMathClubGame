import json,subprocess,os
keys=list(json.load(open('caps.json')).keys())
def dur(f):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
parts=[]
def still(png,sec,out):
    subprocess.run(['ffmpeg','-loglevel','error','-y','-loop','1','-t',str(sec),'-i',png,'-f','lavfi','-t',str(sec),'-i','anullsrc=r=48000:cl=stereo','-vf','fps=30,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=%.2f:d=0.5'%(sec-0.5),'-c:v','libx264','-crf','18','-preset','veryfast','-c:a','aac','-b:a','160k','-shortest',out],check=True)
still('P_intro.png',5,'c_intro.mp4');parts.append('c_intro.mp4')
for k in keys:
    m=json.load(open(k+'.json'));ss=max(0,(m['ready']-m['f0'])/1000);D=dur(k+'.mp4')-ss-0.2
    ins=['-loop','1','-t','%.2f'%D,'-i','P_'+k+'.png','-ss','%.3f'%ss,'-t','%.2f'%D,'-i',k+'.mp4']
    fc='[1:v]scale=460:995:flags=lanczos[ph];[0:v][ph]overlay=200:42[v0]'
    subs=m.get('subs',[]);last='v0';n=2
    for j,(t,ts) in enumerate(subs):
        st=(ts-m['f0'])/1000-ss
        if st<0: st=0
        en=min(st+max(2.2,1.2+len(t)*0.065),(subs[j+1][1]-m['f0'])/1000-ss if j+1<len(subs) else D)
        if en<=st+0.3: continue
        ins+=['-loop','1','-t','%.2f'%D,'-i','sub_%s_%d.png'%(k,j)]
        fc+=';[%s][%d:v]overlay=764:808:enable=\'between(t,%.2f,%.2f)\'[v%d]'%(last,n,st,en,n);last='v%d'%n;n+=1
    fc+=';[%s]fps=30,format=yuv420p,fade=t=in:st=0:d=0.4,fade=t=out:st=%.2f:d=0.4[vo]'%(last,D-0.4)
    if os.path.exists(k+'.a.webm') and 'a0' in m:
        off=(m['a0']-m['f0'])/1000-ss
        ins+=['-i',k+'.a.webm'];ai=n
        af='[%d:a]'%ai+('adelay=%d|%d,'%(off*1000,off*1000) if off>0 else 'atrim=start=%.3f,asetpts=PTS-STARTPTS,'%(-off))+'apad,atrim=0:%.2f,volume=3.2,alimiter=limit=0.89,afade=t=out:st=%.2f:d=0.4[ao]'%(D,D-0.4)
    else:
        ins+=['-f','lavfi','-t','%.2f'%D,'-i','anullsrc=r=48000:cl=stereo'];af='[%d:a]anull[ao]'%n
    out='c_'+k+'.mp4'
    subprocess.run(['ffmpeg','-loglevel','error','-y']+ins+['-filter_complex',fc+';'+af,'-map','[vo]','-map','[ao]','-c:v','libx264','-crf','19','-preset','veryfast','-c:a','aac','-b:a','160k','-ar','48000','-ac','2','-t','%.2f'%D,out],check=True)
    parts.append(out);print(k,round(D,1))
still('P_outro.png',5,'c_outro.mp4');parts.append('c_outro.mp4')
open('list.txt','w').write(''.join("file '%s'\n"%p for p in parts))
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i','list.txt','-c:v','libx264','-crf','20','-preset','medium','-c:a','aac','-b:a','160k','-movflags','+faststart','JennyClub_gioi_thieu.mp4'],check=True)
print('total',round(dur('JennyClub_gioi_thieu.mp4'),1))
