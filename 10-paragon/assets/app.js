
(function(){
var hd=document.querySelector('.hd');document.querySelector('.burger').addEventListener('click',function(){hd.classList.toggle('open');this.setAttribute('aria-expanded',hd.classList.contains('open'))});
hd.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){hd.classList.remove('open')})});
var sl=document.querySelectorAll('.hero .sl'),i=0,t;
function go(n){sl[i].classList.remove('on');i=(n+sl.length)%sl.length;sl[i].classList.add('on')}
function auto(){clearInterval(t);t=setInterval(function(){go(i+1)},6000)}
document.querySelector('.arrows .prev').onclick=function(){go(i-1);auto()};
document.querySelector('.arrows .next').onclick=function(){go(i+1);auto()};
auto();
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