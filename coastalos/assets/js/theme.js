/* Small theme-owned behavior for the sticky site header. */
( function () {
	'use strict';

	const header = document.querySelector( '.coastalos-site-header' );
	const mobileCta = document.querySelector( '.coastalos-mobile-cta' );
	const contactSection = document.querySelector( '.coastalos-contact, .cta' );

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
