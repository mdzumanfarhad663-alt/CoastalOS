/* CoastalOS shared site script: header, menu, reveal, mobile CTA. */
(function(){
  requestAnimationFrame(function(){document.body.classList.add('loaded')});

  var header=document.querySelector('header.site'),mcta=document.getElementById('mcta');
  var review=document.querySelector('[data-mcta-hide]')||document.getElementById('review')||document.querySelector('.cta');
  var mctaAfter=document.querySelector('[data-mcta-after]');
  var page=location.pathname.split('/').pop()||'index.html';
  var links=[].slice.call(document.querySelectorAll('#menu a'));
  // scroll-spy only for links that point to a section on this page
  var spy=links.filter(function(a){var u=a.getAttribute('href').split('#');return u[1]&&(u[0]===''||u[0]===page)});
  function target(a){return document.getElementById(a.getAttribute('href').split('#')[1])}
  var lastY=scrollY,mctaUp=true;
  function onScroll(){
    var y=scrollY;header.classList.toggle('scrolled',y>8);
    if(mcta){var r=review?review.getBoundingClientRect().top:Infinity,past=mctaAfter?mctaAfter.getBoundingClientRect().bottom<0:y>600;var ft=document.querySelector('footer');var fr=ft?ft.getBoundingClientRect().top:Infinity;var up=y<lastY-2,down=y>lastY+2;if(down)mctaUp=false;if(up)mctaUp=true;lastY=y;mcta.classList.toggle('show',past&&mctaUp&&r>innerHeight*.6&&fr>innerHeight)}
    if(spy.length){var cur=null;spy.forEach(function(a){var s=target(a);if(s&&s.getBoundingClientRect().top<160)cur=a});
      spy.forEach(function(a){a.classList.toggle('active',a===cur)})}
  }
  // Back to top: shown after the first section (the hero), smooth scroll unless reduced motion, then focus the skip link
  var top=document.createElement('button');top.type='button';top.className='to-top';top.setAttribute('aria-label','Back to top');
  top.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';document.body.appendChild(top);
  var firstSec=document.querySelector('main > section');
  function syncTop(){var past=firstSec?firstSec.getBoundingClientRect().bottom<0:scrollY>600;top.classList.toggle('show',past)}
  top.addEventListener('click',function(){var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({top:0,behavior:rm?'auto':'smooth'});
    var skip=document.querySelector('.skip')||document.body,done=false;
    function focusTop(){if(done)return;done=true;if(skip===document.body){document.body.setAttribute('tabindex','-1')}skip.focus({preventScroll:true})}
    if(rm)focusTop();else{addEventListener('scrollend',focusTop,{once:true});setTimeout(focusTop,900)}});
  addEventListener('scroll',syncTop,{passive:true});syncTop();
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
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.01,rootMargin:'0px 0px 12% 0px'});
    rvs.forEach(function(el){if(el.getBoundingClientRect().top<innerHeight){el.classList.add('in','rv-now')}else{io.observe(el)}});
  }
  addEventListener('beforeprint',revealAll);

  // Motion system: data-anim="fade-up|fade-in|scale-in|draw",
  // data-stagger="<anim>" on a parent (children get the anim and an 80ms step), data-delay="ms".
  // Reveals once at ~15% visibility; elements on screen at load start right away; never replays.
  var reduceM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP=50,MAXSTEP=2;
  [].forEach.call(document.querySelectorAll('[data-stagger]'),function(p){
    var kind=p.getAttribute('data-stagger')||'fade-up',base=+(p.getAttribute('data-delay')||0);
    [].forEach.call(p.children,function(c,i){if(!c.hasAttribute('data-anim'))c.setAttribute('data-anim',kind);c.setAttribute('data-delay',base+Math.min(i,MAXSTEP)*STEP)});
  });
  var anims=[].slice.call(document.querySelectorAll('[data-anim]'));
  function prepDraw(el){
    [].forEach.call(el.querySelectorAll('path,line,polyline,circle'),function(sh){
      if(!sh.getTotalLength)return;var L;try{L=Math.ceil(sh.getTotalLength())}catch(err){return}
      if(!L)return;
      sh.style.strokeDasharray=L;sh.style.strokeDashoffset=reduceM?0:L;
    });
  }
  function show(el){
    var d=+(el.getAttribute('data-delay')||0);el.style.setProperty('--d',d+'ms');
    if(el.getAttribute('data-anim')==='draw'){
      [].forEach.call(el.querySelectorAll('path,line,polyline,circle'),function(sh){
        sh.style.transition='stroke-dashoffset var(--dur-slow) var(--ease-out) '+d+'ms';sh.style.strokeDashoffset=0;
      });
    }
    el.classList.add('is-in');el.dispatchEvent(new CustomEvent('reveal'));
    setTimeout(function(){el.classList.add('anim-done')},d+1000);
  }
  anims.forEach(function(el){if(el.getAttribute('data-anim')==='draw')prepDraw(el)});
  if(reduceM||!('IntersectionObserver' in window)){anims.forEach(function(el){el.classList.add('is-in')})}
  else{
    var aio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);aio.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px 8% 0px'});
    // two frames so the hidden start state is painted before on-screen elements animate in
    requestAnimationFrame(function(){requestAnimationFrame(function(){anims.forEach(function(el){aio.observe(el)})})});
    // safety net for very fast scrolling: anything already scrolled past is shown at once
    var sweep=false;addEventListener('scroll',function(){if(sweep)return;sweep=true;requestAnimationFrame(function(){sweep=false;
      anims.forEach(function(el){if(!el.classList.contains('is-in')&&el.getBoundingClientRect().bottom<0){el.setAttribute('data-delay',0);show(el);aio.unobserve(el)}})})},{passive:true});
  }
  addEventListener('beforeprint',function(){anims.forEach(function(el){el.classList.add('is-in')})});

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
  var q2=document.getElementById('q2');
  if(q2&&/[?&]request=call(&|$)/.test(location.search))q2.checked=true;
  // "A call with our team" shortcut buttons (contact page)
  document.querySelectorAll('[data-pick-call]').forEach(function(b){b.addEventListener('click',function(){if(q2)q2.checked=true;document.getElementById('name').focus()})});
  // Choosing a call changes the submit label and the next-steps list
  var sub=form.querySelector('button[type=submit]');
  function syncReq(){if(!q2)return;var call=q2.checked;sub.textContent=call?'Request a Call':'Request a Property Review';
    document.querySelectorAll('[data-steps="review"]').forEach(function(e){e.hidden=call});document.querySelectorAll('[data-steps="call"]').forEach(function(e){e.hidden=!call})}
  form.querySelectorAll('input[name=request]').forEach(function(r){r.addEventListener('change',syncReq)});
  document.querySelectorAll('[data-pick-call]').forEach(function(b){b.addEventListener('click',syncReq)});
  syncReq();
  form.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    form.querySelectorAll('[required]').forEach(function(el){
      var err=el.parentNode.querySelector('.err'),msg='',lab=el.parentNode.querySelector('label').textContent.toLowerCase().replace(/^your /,'');
      if(!el.value.trim())msg='Enter your '+lab+'.';
      else if(el.type==='email'&&!/^\S+@\S+\.\S+$/.test(el.value))msg='Enter a valid email, like name@hotel.com.';
      err.textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');if(msg&&ok){el.focus();ok=false}
    });
    if(ok&&!form.querySelector('.form-done')){var d=document.createElement('p');d.className='form-done';d.setAttribute('role','status');d.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>Thanks. Your request has been noted in this preview.';form.appendChild(d);form.querySelector('button[type=submit]').disabled=true}
  });
  }
})();
