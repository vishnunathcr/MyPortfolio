(function(){var h=document.getElementById('name');if(!h)return;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
window.addEventListener('pointermove',function(e){var r=h.getBoundingClientRect();
var x=Math.min(Math.max((e.clientX-r.left)/r.width,0),1),y=Math.min(Math.max((e.clientY-r.top)/Math.max(r.height,1),0),1);
h.style.setProperty('--w',Math.round(200+x*600));h.style.setProperty('--d',Math.round(75+(1-y)*25));});})();
