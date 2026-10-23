
(function(){
var hd=document.querySelector('.hd');document.querySelector('.burger').addEventListener('click',function(){hd.classList.toggle('open');this.setAttribute('aria-expanded',hd.classList.contains('open'))});
hd.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){hd.classList.remove('open')})});
document.querySelector('.top button').onclick=function(){this.parentNode.remove()};
var chips=document.querySelectorAll('.chips button'),cs=document.querySelectorAll('.cc');
var rcs=document.querySelector('.rcards');document.querySelectorAll('.rarr').forEach(function(b){b.onclick=function(){rcs.scrollBy({left:(b.classList.contains('n')?1:-1)*rcs.clientWidth/3,behavior:'smooth'})}});
var rvs=document.querySelectorAll('.rv');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.15});rvs.forEach(function(el){io.observe(el)})}else rvs.forEach(function(el){el.classList.add('on')});
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('video').forEach(function(v){v.removeAttribute('autoplay');v.pause()})}
chips.forEach(function(b){b.onclick=function(){chips.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');var k=b.dataset.k;cs.forEach(function(c){c.hidden=!(k==='all'||c.dataset.k===k)})}});
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