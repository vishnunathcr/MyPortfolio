(function(){
var fine=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var cur=null,mx=-100,my=-100,timer=null;
if(fine){cur=document.createElement('div');cur.className='cursor-dot';cur.setAttribute('aria-hidden','true');document.body.appendChild(cur);document.documentElement.classList.add('has-cur');}
function aim(){var t=document.querySelector('.tank');if(!t||reduce)return null;var svg=t.querySelector('svg'),r=svg.getBoundingClientRect(),s=r.width/100;
var cx=r.left+50*s,cy=r.top+30*s,a=Math.atan2(my-cy,mx-cx);
t.querySelector('.turret').setAttribute('transform','rotate('+(a*180/Math.PI).toFixed(1)+' 50 30)');
return{a:a,cx:cx,cy:cy,s:s,vis:r.bottom>0&&r.top<innerHeight};}
function pos(x,y,a){return'translate('+(x-14)+'px,'+(y-6)+'px) rotate('+a+'rad)';}
function boom(x,y){var b=document.createElement('div');b.className='boom';b.style.left=(x-22)+'px';b.style.top=(y-22)+'px';document.body.appendChild(b);
var an=b.animate([{transform:'scale(.2)',opacity:1},{transform:'scale(1.4)',opacity:0}],{duration:450,easing:'ease-out'});an.onfinish=function(){b.remove()};}
function fire(){var g=aim();if(!g||!g.vis)return;var x0=g.cx+Math.cos(g.a)*46*g.s,y0=g.cy+Math.sin(g.a)*46*g.s,tx=mx,ty=my;
var d=Math.min(900,Math.max(350,Math.hypot(tx-x0,ty-y0)*.9));
var m=document.createElement('div');m.className='missile';m.setAttribute('aria-hidden','true');
m.innerHTML='<svg viewBox="0 0 28 12"><path d="M0 6L7 3V9Z" fill="#ff6b9d"/><rect x="6" y="2.5" width="14" height="7" fill="#f3f1ff"/><path d="M20 2.5L28 6L20 9.5Z" fill="#ffd23f"/><path d="M8 2.5L5 0L12 2.5ZM8 9.5L5 12L12 9.5Z" fill="#ffd23f"/></svg>';
document.body.appendChild(m);
var an=m.animate([{transform:pos(x0,y0,g.a)},{transform:pos(tx,ty,g.a)}],{duration:d,easing:'cubic-bezier(.4,0,.9,.6)',fill:'forwards'});
an.onfinish=function(){m.remove();boom(tx,ty)};}
function schedule(ms){timer=setTimeout(function(){fire();schedule(5000)},ms)}
window.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;
if(cur){cur.style.transform='translate('+(mx-9)+'px,'+(my-9)+'px)';cur.style.opacity=1;cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button')));}
aim();clearTimeout(timer);
if(e.pointerType==='mouse'&&!reduce)schedule(3000);});
window.addEventListener('scroll',aim,{passive:true});
document.documentElement.addEventListener('pointerleave',function(){clearTimeout(timer);if(cur)cur.style.opacity=0;});
})();
