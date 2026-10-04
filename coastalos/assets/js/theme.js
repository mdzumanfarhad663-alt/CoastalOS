/* Small theme-owned behavior for the sticky site header. */
( function () {
	'use strict';

	const header = document.querySelector( '.coastalos-site-header' );
	const mobileCta = document.querySelector( '.coastalos-mobile-cta' );
	const contactSection = document.querySelector( '.coastalos-contact, .cta' );
	const revealItems = Array.from( document.querySelectorAll( '.rv' ) );
	const revealAll = function () {
		revealItems.forEach( function ( item ) {
			item.classList.add( 'in' );
		} );
	};

	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches || ! ( 'IntersectionObserver' in window ) ) {
		revealAll();
	} else {
		const observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'in' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.01, rootMargin: '0px 0px 12% 0px' }
		);
		revealItems.forEach( function ( item ) {
			if ( item.getBoundingClientRect().top < window.innerHeight ) {
				item.classList.add( 'in', 'rv-now' );
			} else {
				observer.observe( item );
			}
		} );
		window.addEventListener( 'beforeprint', revealAll );
	}

	requestAnimationFrame( function () {
		document.body.classList.add( 'loaded' );
	} );

	const updateHeader = function () {
		if ( header ) {
			header.classList.toggle( 'scrolled', window.scrollY > 8 );
		}

		if ( mobileCta ) {
			const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
			mobileCta.classList.toggle( 'is-visible', window.scrollY > 600 && contactTop > window.innerHeight * 0.6 );
		}
	};

	updateHeader();
	window.addEventListener( 'scroll', updateHeader, { passive: true } );
} )();
