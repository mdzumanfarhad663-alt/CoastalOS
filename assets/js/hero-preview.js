/* TEMP hero preview (Oct 2026): crossfades the homepage hero photo so Jed can pick one.
   To remove: delete this file, its <script> tag in index.html and the "TEMP hero preview" CSS block in index.html.
   Slide 1 is the current Blind Pass photo; the other slides load after the page has loaded. */
(function(){
  var hero=document.querySelector('.hx'),par=hero&&hero.querySelector('.bg-par');if(!par)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides=[par.querySelector('img.bg')];
  ['hero-option-1','hero-option-2','hero-option-3'].forEach(function(n){
    var im=document.createElement('img');im.className='bg';im.alt='';im.decoding='async';
    im.setAttribute('data-srcset','assets/home-v2/'+n+'-1280.webp 1280w, assets/home-v2/'+n+'-1920.webp 1920w');
    par.appendChild(im);slides.push(im)});
  function load(im){var s=im.getAttribute('data-srcset');if(!s)return;im.removeAttribute('data-srcset');im.sizes='100vw';im.srcset=s}
  if(document.readyState==='complete')slides.forEach(load);else addEventListener('load',function(){slides.forEach(load)});
  par.classList.add('hxs');slides[0].classList.add('on');

  var dots=document.createElement('div');dots.className='hxs-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Hero photo options');
  var label=document.createElement('p');label.className='hxs-label';label.setAttribute('aria-live','polite');
  var btns=slides.map(function(_,k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show option '+(k+1));
    b.addEventListener('click',function(){go(k);start()});dots.appendChild(b);return b});
  hero.appendChild(dots);hero.appendChild(label);

  var i=0,timer=null,paused=false;
  function go(k){i=(k+slides.length)%slides.length;load(slides[i]);
    slides.forEach(function(s,j){s.classList.toggle('on',j===i)});
    btns.forEach(function(b,j){b.setAttribute('aria-pressed',j===i?'true':'false')});
    label.textContent='Option '+(i+1)}
  function start(){clearInterval(timer);if(reduce||paused)return;timer=setInterval(function(){go(i+1)},5000)}
  hero.addEventListener('mouseenter',function(){paused=true;clearInterval(timer)});
  hero.addEventListener('mouseleave',function(){paused=false;start()});
  go(0);start();
})();
