
(function(){
var hd=document.querySelector('.hd');document.querySelector('.burger').addEventListener('click',function(){hd.classList.toggle('open');this.setAttribute('aria-expanded',hd.classList.contains('open'))});
hd.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){hd.classList.remove('open')})});
var sl=document.querySelectorAll('.hero .sl'),i=0,t;
function go(n){var p=sl[i];i=(n+sl.length)%sl.length;var c=sl[i];if(c===p)return;c.className='sl pre';void c.offsetWidth;c.className='sl on';c.removeAttribute('aria-hidden');p.className='sl out';p.setAttribute('aria-hidden','true');setTimeout(function(){if(p!==sl[i])p.className='sl'},1000)}
function auto(){clearInterval(t);if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))t=setInterval(function(){go(i+1)},4500)}
document.querySelector('.arrows .prev').onclick=function(){go(i-1);auto()};
document.querySelector('.arrows .next').onclick=function(){go(i+1);auto()};
auto();
var hero=document.querySelector('.hero');['mouseenter','focusin'].forEach(function(ev){hero.addEventListener(ev,function(){clearInterval(t)})});['mouseleave','focusout'].forEach(function(ev){hero.addEventListener(ev,auto)});
var rvs=document.querySelectorAll('.rv');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.12});rvs.forEach(function(el){io.observe(el)})}else rvs.forEach(function(el){el.classList.add('on')});
window.addEventListener('scroll',function(){hd.classList.toggle('sm',window.scrollY>60)},{passive:true});
})();

document.querySelectorAll('form[data-wa]').forEach(function(fm){
  fm.addEventListener('submit',function(e){
    e.preventDefault();
    var n=fm.name.value.trim(),p=fm.phone.value.trim(),er=fm.querySelector('.err');
    if(!n){er.textContent=er.dataset.n;er.hidden=false;fm.name.focus();return}
    if(p.replace(/\D/g,'').length<7){er.textContent=er.dataset.p;er.hidden=false;fm.phone.focus();return}
    er.hidden=true;
    var msg=fm.dataset.prefix+fm.dataset.topic+'. '+fm.name.labels[0].childNodes[0].textContent.trim()+': '+n+'; '+fm.phone.labels[0].childNodes[0].textContent.trim()+': '+p+'; '+fm.service.value+(fm.object.value.trim()?'; '+fm.object.value.trim():'');
    var u='https://wa.me/'+fm.dataset.wa+'?text='+encodeURIComponent(msg);
    fm.querySelector('.wa-open').href=u;fm.querySelector('.ok').hidden=false;
    window.open(u,'_blank','noopener');
  });
});