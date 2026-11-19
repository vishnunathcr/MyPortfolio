(function(){
var fine=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var cur=null,mx=-100,my=-100,timer=null;
if(fine){cur=document.createElement('div');cur.className='cursor-dot';cur.setAttribute('aria-hidden','true');document.body.appendChild(cur);document.documentElement.classList.add('has-cur');}
var PX=64,PY=23.5,BL=24,MIN=-80*Math.PI/180,MAX=50*Math.PI/180;
var MISSILE='<svg viewBox="0 0 100 36"><g fill="#F2F2F2" stroke="#F2F2F2" stroke-width="8" stroke-linejoin="round"><path d="M12 12 L7 2 L24 2 L38 11 Z"/><path d="M12 24 L7 34 L24 34 L38 25 Z"/><path d="M16 11 L62 11 C80 11 92 14 98 18 C92 22 80 25 62 25 L16 25 Q10 25 10 18 Q10 11 16 11 Z"/></g><g fill="#407845" stroke="#40396E" stroke-width="2.4" stroke-linejoin="round"><path d="M12 12 L7 2 L24 2 L38 11 Z"/><path d="M12 24 L7 34 L24 34 L38 25 Z"/></g><path d="M16 11 L62 11 C80 11 92 14 98 18 C92 22 80 25 62 25 L16 25 Q10 25 10 18 Q10 11 16 11 Z" fill="#8CC63F" stroke="#40396E" stroke-width="2.4" stroke-linejoin="round"/><path d="M54 11.6H62V24.4H54Z" fill="#407845"/></svg>';
function aim(){var t=document.querySelector('.tank');if(!t||reduce)return null;var svg=t.querySelector('svg'),r=svg.getBoundingClientRect(),s=r.width/100;
var flip=mx<r.left+r.width/2;t.classList.toggle('flip',flip);
var wx=r.left+(flip?100-PX:PX)*s,wy=r.top+PY*s,dx=mx-wx,dy=my-wy;
var a=Math.max(MIN,Math.min(MAX,Math.atan2(dy,flip?-dx:dx)));
svg.querySelector('.barrel').setAttribute('transform','rotate('+(a*180/Math.PI).toFixed(1)+' '+PX+' '+PY+')');
var lx=PX+BL*Math.cos(a),ly=PY+BL*Math.sin(a);
return{tx:r.left+(flip?100-lx:lx)*s,ty:r.top+ly*s,vis:r.bottom>0&&r.top<innerHeight};}
function pos(x,y,a){return'translate('+(x-26)+'px,'+(y-9.5)+'px) rotate('+a+'rad)';}
function boom(x,y){x=Math.min(Math.max(x,22),innerWidth-22);y=Math.min(Math.max(y,22),innerHeight-22);
var b=document.createElement('div');b.className='boom';b.style.left=(x-22)+'px';b.style.top=(y-22)+'px';document.body.appendChild(b);
var an=b.animate([{transform:'scale(.2)',opacity:1},{transform:'scale(1.4)',opacity:0}],{duration:450,easing:'ease-out'});an.onfinish=function(){b.remove()};}
function fire(){var g=aim();if(!g||!g.vis)return;
var ox=g.tx,oy=g.ty,tx=mx,ty=my,dist=Math.hypot(tx-ox,ty-oy);if(dist<4)return;
var ux=(tx-ox)/dist,uy=(ty-oy)/dist,a=Math.atan2(uy,ux),edge=1e9;
if(ux>0)edge=Math.min(edge,(innerWidth-ox)/ux);else if(ux<0)edge=Math.min(edge,(0-ox)/ux);
if(uy>0)edge=Math.min(edge,(innerHeight-oy)/uy);else if(uy<0)edge=Math.min(edge,(0-oy)/uy);
var m=document.createElement('div');m.className='missile';m.setAttribute('aria-hidden','true');m.innerHTML=MISSILE;document.body.appendChild(m);
var t0=performance.now(),speed=1.1,passed=false;
function step(now){var s=(now-t0)*speed;
if(!passed&&s>=dist){passed=true;if(Math.hypot(mx-tx,my-ty)<=24){m.remove();boom(tx,ty);return;}}
if(s>=edge){m.remove();boom(ox+ux*edge,oy+uy*edge);return;}
m.style.transform=pos(ox+ux*s,oy+uy*s,a);requestAnimationFrame(step);}
m.style.transform=pos(ox,oy,a);requestAnimationFrame(step);}
function schedule(ms){timer=setTimeout(function(){fire();schedule(5000)},ms)}
window.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;
if(cur){cur.style.transform='translate('+(mx-9)+'px,'+(my-9)+'px)';cur.style.opacity=1;cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button')));}
aim();clearTimeout(timer);
if(e.pointerType==='mouse'&&!reduce)schedule(3000);});
window.addEventListener('scroll',aim,{passive:true});
document.documentElement.addEventListener('pointerleave',function(){clearTimeout(timer);if(cur)cur.style.opacity=0;});
})();
(function(){
function light(){return document.documentElement.getAttribute('data-theme')==='light';}
function sync(){document.querySelectorAll('.theme-toggle').forEach(function(b){b.setAttribute('aria-checked',light()?'true':'false');});}
document.addEventListener('click',function(e){if(!e.target.closest('.theme-toggle'))return;
var t=light()?'dark':'light';document.documentElement.setAttribute('data-theme',t);
try{localStorage.setItem('theme',t)}catch(err){}sync();});
window.addEventListener('hashchange',function(){setTimeout(sync,0)});sync();
})();
