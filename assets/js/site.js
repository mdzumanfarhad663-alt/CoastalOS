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

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
})();
