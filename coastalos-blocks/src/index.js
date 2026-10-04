import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { createElement, Fragment } from '@wordpress/element';
import {
	Notice,
	PanelBody,
	RangeControl,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import hero from '../blocks/hero/block.json';
import opportunity from '../blocks/opportunity/block.json';
import capabilities from '../blocks/capabilities/block.json';
import principles from '../blocks/principles/block.json';
import guestJourney from '../blocks/guest-journey/block.json';
import outcomes from '../blocks/outcomes/block.json';
import ownerReporting from '../blocks/owner-reporting/block.json';
import operatorComparison from '../blocks/operator-comparison/block.json';
import propertyCards from '../blocks/property-cards/block.json';
import resultsStrip from '../blocks/results-strip/block.json';
import faq from '../blocks/faq/block.json';
import ctaBand from '../blocks/cta-band/block.json';
import contact from '../blocks/contact/block.json';
import testimonials from '../blocks/testimonials/block.json';
import operatorStory from '../blocks/operator-story/block.json';
import section from '../blocks/section/block.json';
import contactForm from '../blocks/contact-form/block.json';
import globalCta from '../blocks/global-cta/block.json';
import globalLogo from '../blocks/global-logo/block.json';
import globalContact from '../blocks/global-contact/block.json';

const sectionBlocks = [
	hero,
	opportunity,
	capabilities,
	principles,
	guestJourney,
	outcomes,
	ownerReporting,
	operatorComparison,
	propertyCards,
	resultsStrip,
	faq,
	ctaBand,
	contact,
	testimonials,
	operatorStory,
	section,
	contactForm,
	globalCta,
	globalLogo,
	globalContact,
];

function SectionEdit( { attributes, setAttributes, metadata } ) {
	const blockProps = useBlockProps( {
		className: [
			'coastalos-section',
			`is-bg-${ attributes.background || 'light' }`,
			`is-spacing-${ attributes.spacing || 'normal' }`,
			attributes.hideOnPage ? 'is-hidden-on-page' : '',
		]
			.filter( Boolean )
			.join( ' ' ),
	} );

	return createElement(
		Fragment,
		null,
		createElement(
			InspectorControls,
			null,
			createElement(
				PanelBody,
				{
					title: __( 'Section settings', 'coastalos-blocks' ),
					initialOpen: true,
				},
				createElement( SelectControl, {
					label: __( 'Background', 'coastalos-blocks' ),
					value: attributes.background || 'light',
					options: [
						{
							label: __( 'Light', 'coastalos-blocks' ),
							value: 'light',
						},
						{
							label: __( 'White', 'coastalos-blocks' ),
							value: 'white',
						},
						{
							label: __( 'Navy', 'coastalos-blocks' ),
							value: 'navy',
						},
					],
					onChange: ( background ) => setAttributes( { background } ),
				} ),
				createElement( SelectControl, {
					label: __( 'Spacing', 'coastalos-blocks' ),
					value: attributes.spacing || 'normal',
					options: [
						{
							label: __( 'Normal', 'coastalos-blocks' ),
							value: 'normal',
						},
						{
							label: __( 'Compact', 'coastalos-blocks' ),
							value: 'compact',
						},
					],
					onChange: ( spacing ) => setAttributes( { spacing } ),
				} ),
				createElement( ToggleControl, {
					label: __( 'Hide on page', 'coastalos-blocks' ),
					checked: Boolean( attributes.hideOnPage ),
					onChange: ( hideOnPage ) => setAttributes( { hideOnPage } ),
				} ),
				metadata.name === 'coastalos/property-cards' &&
					createElement(
						Fragment,
						null,
						createElement( SelectControl, {
							label: __( 'Card layout', 'coastalos-blocks' ),
							value: attributes.layout || 'portfolio',
							options: [
								{
									label: __(
										'Portfolio grid',
										'coastalos-blocks'
									),
									value: 'portfolio',
								},
								{
									label: __(
										'Home three-column grid',
										'coastalos-blocks'
									),
									value: 'home',
								},
							],
							onChange: ( layout ) => setAttributes( { layout } ),
						} ),
						createElement( RangeControl, {
							label: __(
								'Properties to show',
								'coastalos-blocks'
							),
							min: 1,
							max: 30,
							value: attributes.postsToShow || 3,
							onChange: ( postsToShow ) =>
								setAttributes( { postsToShow } ),
						} )
					)
			)
		),
		createElement(
			'section',
			blockProps,
			createElement(
				'div',
				{ className: 'coastalos-section__inner' },
				metadata.name === 'coastalos/property-cards'
					? createElement(
							Fragment,
							null,
							createElement(
								Notice,
								{ status: 'info', isDismissible: false },
								__(
									'Property cards come from published entries under Properties. Add or reorder them there; this block controls how many appear.',
									'coastalos-blocks'
								)
							),
							createElement( InnerBlocks, {
								renderAppender: InnerBlocks.ButtonBlockAppender,
								templateLock: false,
							} )
						)
					: createElement( InnerBlocks, {
							renderAppender: InnerBlocks.ButtonBlockAppender,
							templateLock: false,
						} )
			)
		)
	);
}

function ContactFormEdit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( { className: 'coastalos-form-editor' } );
	const fields = [
		[ 'nameLabel', __( 'Name label', 'coastalos-blocks' ) ],
		[ 'emailLabel', __( 'Email label', 'coastalos-blocks' ) ],
		[ 'propertyLabel', __( 'Property label', 'coastalos-blocks' ) ],
		[ 'locationLabel', __( 'Location label', 'coastalos-blocks' ) ],
		[ 'locationPlaceholder', __( 'Location hint', 'coastalos-blocks' ) ],
		[ 'requestLegend', __( 'Request choice heading', 'coastalos-blocks' ) ],
		[ 'requestReview', __( 'Review option', 'coastalos-blocks' ) ],
		[ 'requestCall', __( 'Call option', 'coastalos-blocks' ) ],
		[ 'roomsLegend', __( 'Room-count heading', 'coastalos-blocks' ) ],
		[ 'messageLabel', __( 'Message label', 'coastalos-blocks' ) ],
		[ 'submitLabel', __( 'Submit button label', 'coastalos-blocks' ) ],
		[ 'privacyText', __( 'Privacy sentence', 'coastalos-blocks' ) ],
		[ 'privacyLinkText', __( 'Privacy link label', 'coastalos-blocks' ) ],
		[ 'privacyUrl', __( 'Privacy link URL', 'coastalos-blocks' ) ],
		[ 'successMessage', __( 'Preview confirmation', 'coastalos-blocks' ) ],
	];
	const previewFields = [
		attributes.nameLabel,
		attributes.emailLabel,
		attributes.propertyLabel,
		attributes.showLocation ? attributes.locationLabel : '',
	].filter( Boolean );

	return createElement(
		Fragment,
		null,
		createElement(
			InspectorControls,
			null,
			createElement(
				PanelBody,
				{
					title: __( 'Form content', 'coastalos-blocks' ),
					initialOpen: true,
				},
				createElement( TextControl, {
					label: __( 'Form heading', 'coastalos-blocks' ),
					value: attributes.heading,
					onChange: ( heading ) => setAttributes( { heading } ),
				} ),
				...fields.map( ( [ key, label ] ) =>
					createElement( TextControl, {
						key,
						label,
						value: attributes[ key ],
						onChange: ( value ) =>
							setAttributes( { [ key ]: value } ),
					} )
				),
				createElement( TextareaControl, {
					label: __(
						'Room options (one per line)',
						'coastalos-blocks'
					),
					value: attributes.roomOptions,
					onChange: ( roomOptions ) =>
						setAttributes( { roomOptions } ),
				} ),
				createElement( ToggleControl, {
					label: __( 'Show location field', 'coastalos-blocks' ),
					checked: attributes.showLocation,
					onChange: ( showLocation ) =>
						setAttributes( { showLocation } ),
				} ),
				createElement( ToggleControl, {
					label: __( 'Show room count choices', 'coastalos-blocks' ),
					checked: attributes.showRooms,
					onChange: ( showRooms ) => setAttributes( { showRooms } ),
				} ),
				createElement( ToggleControl, {
					label: __( 'Show message field', 'coastalos-blocks' ),
					checked: attributes.showMessage,
					onChange: ( showMessage ) =>
						setAttributes( { showMessage } ),
				} )
			)
		),
		createElement(
			'div',
			blockProps,
			createElement(
				'strong',
				null,
				attributes.heading || __( 'Contact form', 'coastalos-blocks' )
			),
			createElement(
				'div',
				{ className: 'coastalos-form-preview-grid' },
				previewFields.map( ( label, index ) =>
					createElement(
						'div',
						{
							key: index,
							className: 'coastalos-form-preview-field',
						},
						label,
						createElement( 'span' )
					)
				)
			),
			createElement(
				'p',
				{ className: 'coastalos-form-preview-note' },
				__(
					'This preview form validates in the browser. It does not send or store requests.',
					'coastalos-blocks'
				)
			)
		)
	);
}

function GlobalCtaEdit( { attributes, setAttributes } ) {
	return createElement(
		Fragment,
		null,
		createElement(
			InspectorControls,
			null,
			createElement(
				PanelBody,
				{
					title: __( 'Global button', 'coastalos-blocks' ),
					initialOpen: true,
				},
				createElement( SelectControl, {
					label: __( 'Button content', 'coastalos-blocks' ),
					value: attributes.variant || 'primary',
					options: [
						{
							label: __( 'Primary CTA', 'coastalos-blocks' ),
							value: 'primary',
						},
						{
							label: __( 'Talk to our team', 'coastalos-blocks' ),
							value: 'team',
						},
					],
					onChange: ( variant ) => setAttributes( { variant } ),
				} )
			)
		),
		createElement(
			'div',
			useBlockProps( { className: 'coastalos-global-cta-editor' } ),
			__(
				'Button text and link come from Settings → CoastalOS.',
				'coastalos-blocks'
			)
		)
	);
}

function GlobalLogoEdit() {
	return createElement(
		'div',
		useBlockProps( { className: 'coastalos-global-logo-editor' } ),
		__(
			'Logo comes from Settings → CoastalOS; it falls back to the site title.',
			'coastalos-blocks'
		)
	);
}

function GlobalContactEdit() {
	return createElement(
		'div',
		useBlockProps( { className: 'coastalos-global-contact-editor' } ),
		__(
			'Phone, email, and address come from Settings → CoastalOS. Empty values are hidden.',
			'coastalos-blocks'
		)
	);
}

sectionBlocks.forEach( ( metadata ) => {
	const isContactForm = metadata.name === 'coastalos/contact-form';
	const isGlobalCta = metadata.name === 'coastalos/global-cta';
	const isGlobalLogo = metadata.name === 'coastalos/global-logo';
	const isGlobalContact = metadata.name === 'coastalos/global-contact';
	let editComponent = ( props ) =>
		createElement( SectionEdit, { ...props, metadata } );
	if ( isContactForm ) {
		editComponent = ( props ) => createElement( ContactFormEdit, props );
	} else if ( isGlobalCta ) {
		editComponent = ( props ) => createElement( GlobalCtaEdit, props );
	} else if ( isGlobalLogo ) {
		editComponent = () => createElement( GlobalLogoEdit );
	} else if ( isGlobalContact ) {
		editComponent = () => createElement( GlobalContactEdit );
	}
	registerBlockType( metadata.name, {
		edit: editComponent,
		save:
			isContactForm || isGlobalCta || isGlobalLogo || isGlobalContact
				? () => null
				: () => createElement( InnerBlocks.Content ),
	} );
} );
