/* CoastalOS shared site script: header, menu, reveal, mobile CTA. */
(function(){
  requestAnimationFrame(function(){document.body.classList.add('loaded')});

  var header=document.querySelector('header.site'),mcta=document.getElementById('mcta');
  var review=document.getElementById('review')||document.querySelector('.cta');
  var page=location.pathname.split('/').pop()||'index.html';
  var links=[].slice.call(document.querySelectorAll('#menu a'));
  // scroll-spy only for links that point to a section on this page
  var spy=links.filter(function(a){var u=a.getAttribute('href').split('#');return u[1]&&(u[0]===''||u[0]===page)});
  function target(a){return document.getElementById(a.getAttribute('href').split('#')[1])}
  function onScroll(){
    var y=scrollY;header.classList.toggle('scrolled',y>8);
    if(mcta){var r=review?review.getBoundingClientRect().top:Infinity;mcta.classList.toggle('show',y>600&&r>innerHeight*.6)}
    if(spy.length){var cur=null;spy.forEach(function(a){var s=target(a);if(s&&s.getBoundingClientRect().top<160)cur=a});
      spy.forEach(function(a){a.classList.toggle('active',a===cur)})}
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  var nav=document.getElementById('nav'),btn=nav.querySelector('.menu-btn');
  function closeMenu(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Open menu')}
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')});
  links.forEach(function(a){a.addEventListener('click',closeMenu)});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();btn.focus()}});

  // One-time reveals. Anything already in or above the viewport on load is shown
  // at once (no transition), so nothing stays hidden after an anchor jump,
  // a restored scroll position, or in a full-page screenshot.
  var rvs=[].slice.call(document.querySelectorAll('.rv'));
  function revealAll(){rvs.forEach(function(el){el.classList.add('in')})}
  if(!('IntersectionObserver' in window)){revealAll()}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
    rvs.forEach(function(el){if(el.getBoundingClientRect().top<innerHeight){el.classList.add('in','rv-now')}else{io.observe(el)}});
  }
  addEventListener('beforeprint',revealAll);

  // compare toggle (switches once on first view, then user-controlled)
  var cmp=document.getElementById('compare');
  if(cmp){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seg=cmp.querySelector('.seg'),thumb=seg.querySelector('.thumb'),bs=seg.querySelectorAll('button'),cap=cmp.querySelector('.cmp-cap');
  var caps={today:'Each function runs on its own tools and people, and the owner is left connecting the pieces.',central:'One platform coordinates every function, and the owner gets one clear view of the property.'};
  var mode='today',autoCmp=!reduce;
  function setMode(m){mode=m;bs.forEach(function(b){var on=b.dataset.mode===m;b.setAttribute('aria-pressed',on);if(on){thumb.style.width=b.offsetWidth+'px';thumb.style.transform='translateX('+(b.offsetLeft-4)+'px)'}});cmp.classList.toggle('centralized',m==='central');cap.textContent=caps[m]}
  bs.forEach(function(b){b.addEventListener('click',function(){autoCmp=false;setMode(b.dataset.mode)})});
  setMode('today');addEventListener('resize',function(){setMode(mode)});
  var co=new IntersectionObserver(function(es){if(es[0].isIntersecting){co.disconnect();setTimeout(function(){if(autoCmp)setMode('central')},1600)}},{threshold:.6});co.observe(cmp);
  }

  // Property review form (homepage and contact page): front-end validation only, nothing is sent
  var form=document.getElementById('reviewForm');
  if(form){
  // ?request=call (from "Talk to Our Team" links) pre-selects a call instead of a review
  if(/[?&]request=call(&|$)/.test(location.search))document.getElementById('q2').checked=true;
  // "A call with our team" shortcut buttons (contact page)
  document.querySelectorAll('[data-pick-call]').forEach(function(b){b.addEventListener('click',function(){document.getElementById('q2').checked=true;document.getElementById('name').focus()})});
  form.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    form.querySelectorAll('[required]').forEach(function(el){
      var err=el.parentNode.querySelector('.err'),msg='',lab=el.parentNode.querySelector('label').textContent.toLowerCase();
      if(!el.value.trim())msg='Enter your '+lab+'.';
      else if(el.type==='email'&&!/^\S+@\S+\.\S+$/.test(el.value))msg='Enter a valid email, like name@hotel.com.';
      err.textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');if(msg&&ok){el.focus();ok=false}
    });
    if(ok&&!form.querySelector('.form-done')){var d=document.createElement('p');d.className='form-done';d.setAttribute('role','status');d.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>Thanks. Your request has been noted in this preview.';form.appendChild(d);form.querySelector('button[type=submit]').disabled=true}
  });
  }
})();
