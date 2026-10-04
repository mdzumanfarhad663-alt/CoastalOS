<?php
/**
 * CoastalOS theme setup.
 *
 * @package CoastalOS
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Set up theme supports and translations. */
function coastalos_theme_setup() {
	load_theme_textdomain( 'coastalos', get_theme_file_path( '/languages' ) );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-logo', array( 'height' => 40, 'width' => 180, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'coastalos_theme_setup' );

/** Load the small global stylesheet on the front end. */
function coastalos_enqueue_theme_styles() {
	$stylesheet_path = get_theme_file_path( '/assets/css/theme.css' );
	$version         = file_exists( $stylesheet_path ) ? (string) filemtime( $stylesheet_path ) : wp_get_theme()->get( 'Version' );

	wp_enqueue_style(
		'coastalos-theme',
		get_theme_file_uri( '/assets/css/theme.css' ),
		array(),
		$version
	);

	$script_path = get_theme_file_path( '/assets/js/theme.js' );
	wp_enqueue_script(
		'coastalos-theme',
		get_theme_file_uri( '/assets/js/theme.js' ),
		array(),
		file_exists( $script_path ) ? (string) filemtime( $script_path ) : wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'coastalos_enqueue_theme_styles' );

/** Make the site shell styles available in the native block editor. */
function coastalos_editor_styles() {
	add_editor_style( 'assets/css/theme.css' );
}
add_action( 'admin_init', 'coastalos_editor_styles' );

/** Preload only the two primary Latin variable fonts used by the design. */
function coastalos_preload_primary_fonts() {
	if ( is_admin() ) {
		return;
	}

	$fonts = array(
		'outfit-latin.woff2',
		'instrument-sans-latin.woff2',
	);

	foreach ( $fonts as $font ) {
		printf(
			"<link rel=\"preload\" href=\"%s\" as=\"font\" type=\"font/woff2\" crossorigin />\n",
			esc_url( get_theme_file_uri( '/assets/fonts/' . $font ) )
		);
	}
}
add_action( 'wp_head', 'coastalos_preload_primary_fonts', 1 );
