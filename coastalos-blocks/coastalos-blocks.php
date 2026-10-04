<?php
/**
 * Plugin Name: CoastalOS Blocks
 * Description: Editable, reusable Gutenberg sections for the CoastalOS website.
 * Version: 1.0.0
 * Requires at least: 6.9
 * Requires PHP: 8.1
 * Author: CoastalOS
 * Text Domain: coastalos-blocks
 * Domain Path: /languages
 *
 * @package CoastalOSBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'COASTALOS_BLOCKS_VERSION', '1.0.0' );
define( 'COASTALOS_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );

/** Register the plugin's editor category. */
function coastalos_blocks_categories( $categories ) {
	$categories[] = array(
		'slug'  => 'coastalos-sections',
		'title' => __( 'CoastalOS Sections', 'coastalos-blocks' ),
	);

	return $categories;
}
add_filter( 'block_categories_all', 'coastalos_blocks_categories' );

/** Sanitize the optional CoastalOS site-wide values. */
function coastalos_blocks_sanitize_settings( $settings ) {
	$settings = is_array( $settings ) ? $settings : array();
	$clean    = array();
	$url_keys = array( 'logo_url', 'primary_cta_url', 'talk_link_url' );
	$text_keys = array( 'primary_cta_text', 'talk_link_text', 'phone', 'email', 'address' );

	foreach ( $url_keys as $key ) {
		$clean[ $key ] = isset( $settings[ $key ] ) ? esc_url_raw( $settings[ $key ] ) : '';
	}
	foreach ( $text_keys as $key ) {
		$clean[ $key ] = isset( $settings[ $key ] ) ? sanitize_text_field( $settings[ $key ] ) : '';
	}
	if ( ! empty( $clean['email'] ) && ! is_email( $clean['email'] ) ) {
		$clean['email'] = '';
	}
	return $clean;
}

/** Register the optional values in Settings → CoastalOS. */
function coastalos_blocks_register_settings() {
	register_setting(
		'coastalos_settings_group',
		'coastalos_settings',
		array(
			'type'              => 'array',
			'sanitize_callback' => 'coastalos_blocks_sanitize_settings',
			'default'           => array(),
		)
	);
	add_settings_section( 'coastalos_global', __( 'Global site settings', 'coastalos-blocks' ), '__return_false', 'coastalos-settings' );
	$fields = array(
		'logo_url'        => __( 'Logo image URL', 'coastalos-blocks' ),
		'primary_cta_text'=> __( 'Primary button text', 'coastalos-blocks' ),
		'primary_cta_url' => __( 'Primary button link', 'coastalos-blocks' ),
		'talk_link_text'  => __( 'Talk to our team text', 'coastalos-blocks' ),
		'talk_link_url'   => __( 'Talk to our team link', 'coastalos-blocks' ),
		'phone'           => __( 'Phone', 'coastalos-blocks' ),
		'email'           => __( 'Email', 'coastalos-blocks' ),
		'address'         => __( 'Address', 'coastalos-blocks' ),
	);
	foreach ( $fields as $key => $label ) {
		add_settings_field( 'coastalos_' . $key, $label, 'coastalos_blocks_render_setting_field', 'coastalos-settings', 'coastalos_global', array( 'key' => $key ) );
	}
}
add_action( 'admin_init', 'coastalos_blocks_register_settings' );

/** Render one escaped settings field. */
function coastalos_blocks_render_setting_field( $args ) {
	$settings = get_option( 'coastalos_settings', array() );
	$key      = $args['key'];
	$value    = isset( $settings[ $key ] ) ? $settings[ $key ] : '';
	$type     = 'email' === $key ? 'email' : ( str_ends_with( $key, '_url' ) ? 'url' : 'text' );
	printf( '<input class="regular-text" type="%1$s" id="coastalos-%2$s" name="coastalos_settings[%2$s]" value="%3$s" />', esc_attr( $type ), esc_attr( $key ), esc_attr( $value ) );
}

/** Add the CoastalOS settings screen under the standard Settings menu. */
function coastalos_blocks_add_settings_page() {
	add_options_page( __( 'CoastalOS Settings', 'coastalos-blocks' ), __( 'CoastalOS', 'coastalos-blocks' ), 'manage_options', 'coastalos-settings', 'coastalos_blocks_render_settings_page' );
}
add_action( 'admin_menu', 'coastalos_blocks_add_settings_page' );

/** Seed global values already present in the prototype; each stays optional. */
function coastalos_blocks_activate() {
	add_option(
		'coastalos_settings',
		array(
			'logo_url'         => '',
			'primary_cta_text' => __( 'Request a Property Review', 'coastalos-blocks' ),
			'primary_cta_url'  => '/contact/',
			'talk_link_text'   => __( 'Talk to Our Team', 'coastalos-blocks' ),
			'talk_link_url'    => '/contact/?request=call',
			'phone'            => '(877) 350-0053',
			'email'            => 'info@coastalhospitalitygroup.com',
			'address'          => '711 S El Camino Real, San Clemente, CA 92672',
		)
	);
}
register_activation_hook( __FILE__, 'coastalos_blocks_activate' );

/** Render Settings API form, which supplies capability checks and a nonce. */
function coastalos_blocks_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'CoastalOS Settings', 'coastalos-blocks' ); ?></h1>
		<p><?php esc_html_e( 'Leave a value blank to hide that item. The logo and CTA blocks use these values wherever they are placed.', 'coastalos-blocks' ); ?></p>
		<form action="options.php" method="post">
			<?php settings_fields( 'coastalos_settings_group' ); ?>
			<?php do_settings_sections( 'coastalos-settings' ); ?>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/** Render a logo from settings, falling back to the WordPress site title. */
function coastalos_blocks_render_global_logo() {
	$settings = get_option( 'coastalos_settings', array() );
	$logo     = isset( $settings['logo_url'] ) ? $settings['logo_url'] : '';
	if ( $logo ) {
		return sprintf( '<a class="coastalos-global-logo" href="%1$s"><img src="%2$s" alt="%3$s" /></a>', esc_url( home_url( '/' ) ), esc_url( $logo ), esc_attr( get_bloginfo( 'name' ) ) );
	}
	return sprintf( '<a class="coastalos-global-logo" href="%1$s">%2$s</a>', esc_url( home_url( '/' ) ), esc_html( get_bloginfo( 'name' ) ) );
}

/** Render one optional site-wide CTA. */
function coastalos_blocks_render_global_cta( $attributes ) {
	$settings = get_option( 'coastalos_settings', array() );
	$variant  = isset( $attributes['variant'] ) && 'team' === $attributes['variant'] ? 'team' : 'primary';
	$text     = isset( $settings[ $variant . '_cta_text' ] ) ? $settings[ $variant . '_cta_text' ] : ( isset( $settings['talk_link_text'] ) && 'team' === $variant ? $settings['talk_link_text'] : '' );
	$url      = isset( $settings[ $variant . '_cta_url' ] ) ? $settings[ $variant . '_cta_url' ] : ( isset( $settings['talk_link_url'] ) && 'team' === $variant ? $settings['talk_link_url'] : '' );
	if ( ! $text || ! $url ) {
		return '';
	}
	$class = 'team' === $variant ? 'coastalos-global-cta is-team' : 'coastalos-global-cta';
	return sprintf( '<a class="%1$s" href="%2$s">%3$s</a>', esc_attr( $class ), esc_url( $url ), esc_html( $text ) );
}

/** Render only the site contact values that have been configured. */
function coastalos_blocks_render_global_contact() {
	$settings = get_option( 'coastalos_settings', array() );
	$items    = array();
	if ( ! empty( $settings['phone'] ) ) {
		$items[] = sprintf( '<li><a href="%1$s">%2$s</a></li>', esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $settings['phone'] ) ), esc_html( $settings['phone'] ) );
	}
	if ( ! empty( $settings['email'] ) && is_email( $settings['email'] ) ) {
		$items[] = sprintf( '<li><a href="%1$s">%2$s</a></li>', esc_url( 'mailto:' . $settings['email'] ), esc_html( $settings['email'] ) );
	}
	if ( ! empty( $settings['address'] ) ) {
		$items[] = sprintf( '<li>%s</li>', esc_html( $settings['address'] ) );
	}
	return $items ? '<ul class="coastalos-global-contact">' . implode( '', $items ) . '</ul>' : '';
}

/** Render a section wrapper while preserving the saved inner blocks. */
function coastalos_blocks_render_section( $attributes, $content, $block ) {
	if ( ! empty( $attributes['hideOnPage'] ) ) {
		return '';
	}

	$backgrounds = array( 'light', 'white', 'navy' );
	$spacings    = array( 'normal', 'compact' );
	$background  = isset( $attributes['background'] ) && in_array( $attributes['background'], $backgrounds, true ) ? $attributes['background'] : 'light';
	$spacing     = isset( $attributes['spacing'] ) && in_array( $attributes['spacing'], $spacings, true ) ? $attributes['spacing'] : 'normal';
	$block_slug  = str_replace( 'coastalos/', '', $block->name );

	$property_cards = 'property-cards' === $block_slug ? coastalos_blocks_render_property_cards( $attributes ) : '';

	/* Preserve the source prototype section, while marking its existing element. */
	if ( class_exists( 'WP_HTML_Tag_Processor' ) && preg_match( '/<section\b/i', $content ) ) {
		if ( $property_cards ) {
			$content = preg_replace( '/<\/section\s*>/i', $property_cards . '</section>', $content, 1 );
		}
		$processor = new WP_HTML_Tag_Processor( $content );
		if ( $processor->next_tag( array( 'tag_name' => 'SECTION' ) ) ) {
			$processor->add_class( 'wp-block-coastalos-' . sanitize_html_class( $block_slug ) );
			$processor->add_class( 'coastalos-section' );
			$processor->add_class( 'is-bg-' . $background );
			$processor->add_class( 'is-spacing-' . $spacing );
			$processor->set_attribute( 'data-coastalos-block', sanitize_html_class( $block_slug ) );
			return $processor->get_updated_html();
		}
	}
	$content .= $property_cards;

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'               => 'coastalos-section is-bg-' . $background . ' is-spacing-' . $spacing,
			'data-coastalos-block' => sanitize_html_class( $block_slug ),
		)
	);

	return sprintf(
		'<section %1$s><div class="coastalos-section__inner">%2$s</div></section>',
		$wrapper_attributes,
		$content // Core serializes and escapes saved inner blocks.
	);
}

/** Load only the prototype stylesheet(s) used by the current page content. */
function coastalos_blocks_enqueue_prototype_styles() {
	$post_id = get_queried_object_id();
	if ( is_admin() && isset( $_GET['post'] ) ) {
		$post_id = absint( $_GET['post'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only editor stylesheet selection.
	}
	if ( ! $post_id ) {
		return;
	}
	$blocks = parse_blocks( get_post_field( 'post_content', $post_id ) );
	$pages  = array();
	$collect_pages = static function ( $items ) use ( &$collect_pages, &$pages ) {
		foreach ( $items as $item ) {
			if ( ! empty( $item['attrs']['prototypePage'] ) ) {
				$pages[] = sanitize_title( $item['attrs']['prototypePage'] );
			}
			if ( ! empty( $item['innerBlocks'] ) ) {
				$collect_pages( $item['innerBlocks'] );
			}
		}
	};
	$collect_pages( $blocks );
	if ( $pages ) {
		$shared_css = COASTALOS_BLOCKS_PATH . 'assets/css/prototype.css';
		wp_enqueue_style( 'coastalos-prototype', plugins_url( 'assets/css/prototype.css', __FILE__ ), array(), (string) filemtime( $shared_css ) );
	}
	foreach ( array_unique( $pages ) as $page ) {
		$file = COASTALOS_BLOCKS_PATH . 'assets/css/pages/' . $page . '.css';
		if ( is_readable( $file ) ) {
			wp_enqueue_style( 'coastalos-prototype-' . $page, plugins_url( 'assets/css/pages/' . $page . '.css', __FILE__ ), array( 'coastalos-prototype' ), (string) filemtime( $file ) );
		}
	}
}
add_action( 'enqueue_block_assets', 'coastalos_blocks_enqueue_prototype_styles' );

/** Render responsive property cards from published Property entries. */
function coastalos_blocks_render_property_cards( $attributes ) {
	$posts_to_show = isset( $attributes['postsToShow'] ) ? absint( $attributes['postsToShow'] ) : 3;
	$posts_to_show = max( 1, min( 30, $posts_to_show ) );
	$layout        = isset( $attributes['layout'] ) && 'home' === $attributes['layout'] ? 'home' : 'portfolio';

	$properties = new WP_Query(
		array(
			'post_type'              => 'coastalos_property',
			'post_status'            => 'publish',
			'posts_per_page'         => $posts_to_show,
			'orderby'                => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
			'update_post_meta_cache' => true,
			'update_post_term_cache' => false,
		)
	);

	if ( ! $properties->have_posts() ) {
		return '';
	}

	ob_start();
	?>
	<div class="pcard-grid<?php echo 'home' === $layout ? ' pcard-grid-3' : ''; ?>">
		<?php
		while ( $properties->have_posts() ) :
			$properties->the_post();
			$property_id = get_the_ID();
			$location    = get_post_meta( $property_id, '_coastalos_property_location', true );
			$property_type = get_post_meta( $property_id, '_coastalos_property_type', true );
			$website     = get_post_meta( $property_id, '_coastalos_property_url', true );
			$card_url    = $website ? add_query_arg(
				array(
					'utm_source'   => 'coastalos',
					'utm_medium'   => 'portfolio',
					'utm_campaign' => 'property_card',
				),
				$website
			) : '';
			?>
			<?php if ( $card_url ) : ?>
				<a class="card pcard" href="<?php echo esc_url( $card_url ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( sprintf( __( 'Visit the %s website (opens in a new tab)', 'coastalos-blocks' ), get_the_title() ) ); ?>">
			<?php else : ?>
				<article class="card pcard">
			<?php endif; ?>
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="pcard-img"><?php the_post_thumbnail( 'large', array( 'loading' => 'lazy', 'decoding' => 'async' ) ); ?></div>
					<?php endif; ?>
					<div class="pcard-meta">
						<h3 class="pcard-name"><?php echo esc_html( get_the_title() ); ?></h3>
						<?php if ( $location ) : ?><span class="pcard-loc"><?php echo esc_html( $location ); ?></span><?php endif; ?>
						<?php if ( $property_type ) : ?><span class="pcard-type"><?php echo esc_html( $property_type ); ?></span><?php endif; ?>
						<?php if ( $card_url ) : ?><span class="pcard-view" aria-hidden="true"><?php esc_html_e( 'Visit website', 'coastalos-blocks' ); ?> <i>↗</i></span><?php endif; ?>
					</div>
			<?php if ( $card_url ) : ?>
				</a>
			<?php else : ?>
				</article>
			<?php endif; ?>
		<?php endwhile; ?>
	</div>
	<?php
	wp_reset_postdata();
	return (string) ob_get_clean();
}

/** Render a front-end-only form block; submissions are never sent or stored. */
function coastalos_blocks_render_contact_form( $attributes ) {
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'coastalos-form-block' ) );
	$form_id            = wp_unique_id( 'coastalos-form-' );
	$room_options       = isset( $attributes['roomOptions'] ) ? preg_split( '/\r\n|\r|\n/', $attributes['roomOptions'] ) : array();
	$room_options       = array_filter( array_map( 'trim', $room_options ) );
	$fields             = array(
		'name'     => isset( $attributes['nameLabel'] ) ? $attributes['nameLabel'] : '',
		'email'    => isset( $attributes['emailLabel'] ) ? $attributes['emailLabel'] : '',
		'property' => isset( $attributes['propertyLabel'] ) ? $attributes['propertyLabel'] : '',
	);

	ob_start();
	?>
	<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated by WordPress. ?>>
		<form class="coastalos-demo-form" data-coastalos-demo-form novalidate>
			<?php if ( ! empty( $attributes['heading'] ) ) : ?>
				<div class="form-head"><b><?php echo esc_html( $attributes['heading'] ); ?></b></div>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['requestLegend'] ) && ( ! empty( $attributes['requestReview'] ) || ! empty( $attributes['requestCall'] ) ) ) : ?>
				<fieldset class="f full">
					<legend><?php echo esc_html( $attributes['requestLegend'] ); ?></legend>
					<div class="chips">
						<?php if ( ! empty( $attributes['requestReview'] ) ) : ?>
							<input type="radio" name="<?php echo esc_attr( $form_id ); ?>-request" id="<?php echo esc_attr( $form_id ); ?>-review" value="review" checked><label for="<?php echo esc_attr( $form_id ); ?>-review"><?php echo esc_html( $attributes['requestReview'] ); ?></label>
						<?php endif; ?>
						<?php if ( ! empty( $attributes['requestCall'] ) ) : ?>
							<input type="radio" name="<?php echo esc_attr( $form_id ); ?>-request" id="<?php echo esc_attr( $form_id ); ?>-call" value="call"><label for="<?php echo esc_attr( $form_id ); ?>-call"><?php echo esc_html( $attributes['requestCall'] ); ?></label>
						<?php endif; ?>
					</div>
				</fieldset>
			<?php endif; ?>

			<?php foreach ( $fields as $key => $label ) : ?>
				<?php if ( $label ) : ?>
					<div class="f">
						<label for="<?php echo esc_attr( $form_id . '-' . $key ); ?>"><?php echo esc_html( $label ); ?></label>
						<input id="<?php echo esc_attr( $form_id . '-' . $key ); ?>" name="<?php echo esc_attr( $key ); ?>" type="<?php echo 'email' === $key ? 'email' : 'text'; ?>" autocomplete="<?php echo 'name' === $key ? 'name' : ( 'email' === $key ? 'email' : 'organization' ); ?>" required>
						<span class="err" aria-live="polite"></span>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>

			<?php if ( ! empty( $attributes['showLocation'] ) && ! empty( $attributes['locationLabel'] ) ) : ?>
				<div class="f">
					<label for="<?php echo esc_attr( $form_id ); ?>-location"><?php echo esc_html( $attributes['locationLabel'] ); ?></label>
					<input id="<?php echo esc_attr( $form_id ); ?>-location" name="location" type="text" autocomplete="address-level2" placeholder="<?php echo esc_attr( $attributes['locationPlaceholder'] ?? '' ); ?>">
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['showRooms'] ) && ! empty( $attributes['roomsLegend'] ) && $room_options ) : ?>
				<fieldset class="f full">
					<legend><?php echo esc_html( $attributes['roomsLegend'] ); ?></legend>
					<div class="chips">
						<?php foreach ( $room_options as $index => $room_option ) : $room_id = $form_id . '-room-' . absint( $index ); ?>
							<input type="radio" name="<?php echo esc_attr( $form_id ); ?>-rooms" id="<?php echo esc_attr( $room_id ); ?>" value="<?php echo esc_attr( $room_option ); ?>"><label for="<?php echo esc_attr( $room_id ); ?>"><?php echo esc_html( $room_option ); ?></label>
						<?php endforeach; ?>
					</div>
				</fieldset>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['showMessage'] ) && ! empty( $attributes['messageLabel'] ) ) : ?>
				<div class="f full">
					<label for="<?php echo esc_attr( $form_id ); ?>-message"><?php echo esc_html( $attributes['messageLabel'] ); ?> <i>(<?php esc_html_e( 'optional', 'coastalos-blocks' ); ?>)</i></label>
					<textarea id="<?php echo esc_attr( $form_id ); ?>-message" name="message"></textarea>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['submitLabel'] ) ) : ?>
				<div class="f full"><button class="btn btn-primary" type="submit"><?php echo esc_html( $attributes['submitLabel'] ); ?></button></div>
			<?php endif; ?>

			<?php if ( ! empty( $attributes['privacyText'] ) || ( ! empty( $attributes['privacyLinkText'] ) && ! empty( $attributes['privacyUrl'] ) ) ) : ?>
				<p class="form-privacy"><?php echo esc_html( $attributes['privacyText'] ); ?> <?php if ( ! empty( $attributes['privacyLinkText'] ) && ! empty( $attributes['privacyUrl'] ) ) : ?><a href="<?php echo esc_url( $attributes['privacyUrl'] ); ?>"><?php echo esc_html( $attributes['privacyLinkText'] ); ?></a>.<?php endif; ?></p>
			<?php endif; ?>
			<?php if ( ! empty( $attributes['successMessage'] ) ) : ?><p class="coastalos-form-success" role="status" hidden><?php echo esc_html( $attributes['successMessage'] ); ?></p><?php endif; ?>
		</form>
	</div>
	<?php
	return (string) ob_get_clean();
}

/** Register block metadata and add the shared server render callback. */
function coastalos_blocks_register() {
	$block_directories = glob( COASTALOS_BLOCKS_PATH . 'blocks/*', GLOB_ONLYDIR );
	if ( ! is_array( $block_directories ) ) {
		return;
	}

	foreach ( $block_directories as $block_directory ) {
		if ( is_readable( $block_directory . '/block.json' ) ) {
		$callbacks = array(
				'contact-form' => 'coastalos_blocks_render_contact_form',
				'global-cta'   => 'coastalos_blocks_render_global_cta',
				'global-logo'  => 'coastalos_blocks_render_global_logo',
				'global-contact' => 'coastalos_blocks_render_global_contact',
			);
			$slug            = basename( $block_directory );
			$render_callback = isset( $callbacks[ $slug ] ) ? $callbacks[ $slug ] : 'coastalos_blocks_render_section';
			register_block_type(
				$block_directory,
				array( 'render_callback' => $render_callback )
			);
		}
	}
}
add_action( 'init', 'coastalos_blocks_register' );

/** Register the content type used for Coastal Hospitality Group properties. */
function coastalos_blocks_register_property_type() {
	$labels = array(
		'name'                  => __( 'Properties', 'coastalos-blocks' ),
		'singular_name'         => __( 'Property', 'coastalos-blocks' ),
		'add_new_item'          => __( 'Add property', 'coastalos-blocks' ),
		'edit_item'             => __( 'Edit property', 'coastalos-blocks' ),
		'new_item'              => __( 'New property', 'coastalos-blocks' ),
		'view_item'             => __( 'View property', 'coastalos-blocks' ),
		'search_items'          => __( 'Search properties', 'coastalos-blocks' ),
		'not_found'             => __( 'No properties found.', 'coastalos-blocks' ),
		'not_found_in_trash'    => __( 'No properties found in Trash.', 'coastalos-blocks' ),
		'all_items'             => __( 'All properties', 'coastalos-blocks' ),
		'menu_name'             => __( 'Properties', 'coastalos-blocks' ),
		'name_admin_bar'        => __( 'Property', 'coastalos-blocks' ),
	);

	register_post_type(
		'coastalos_property',
		array(
			'labels'             => $labels,
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'menu_icon'          => 'dashicons-building',
			'rewrite'            => array( 'slug' => 'property' ),
			'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'publicly_queryable' => false,
		)
	);

	register_post_meta(
		'coastalos_property',
		'_coastalos_property_location',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
	register_post_meta(
		'coastalos_property',
		'_coastalos_property_type',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
	register_post_meta(
		'coastalos_property',
		'_coastalos_property_url',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'esc_url_raw',
			'auth_callback'     => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'coastalos_blocks_register_property_type' );

/** Add structured fields for property cards. */
function coastalos_blocks_add_property_meta_box() {
	add_meta_box(
		'coastalos-property-details',
		__( 'Property details', 'coastalos-blocks' ),
		'coastalos_blocks_render_property_meta_box',
		'coastalos_property',
		'normal',
		'default'
	);
}
add_action( 'add_meta_boxes_coastalos_property', 'coastalos_blocks_add_property_meta_box' );

/** Render property detail fields with current stored values. */
function coastalos_blocks_render_property_meta_box( $post ) {
	wp_nonce_field( 'coastalos_save_property_details', 'coastalos_property_nonce' );
	$location = get_post_meta( $post->ID, '_coastalos_property_location', true );
	$type     = get_post_meta( $post->ID, '_coastalos_property_type', true );
	$url      = get_post_meta( $post->ID, '_coastalos_property_url', true );
	?>
	<p>
		<label for="coastalos-property-location"><strong><?php esc_html_e( 'Location', 'coastalos-blocks' ); ?></strong></label><br />
		<input id="coastalos-property-location" name="coastalos_property_location" type="text" class="widefat" value="<?php echo esc_attr( $location ); ?>" />
	</p>
	<p>
		<label for="coastalos-property-type"><strong><?php esc_html_e( 'Property type', 'coastalos-blocks' ); ?></strong></label><br />
		<input id="coastalos-property-type" name="coastalos_property_type" type="text" class="widefat" value="<?php echo esc_attr( $type ); ?>" />
	</p>
	<p>
		<label for="coastalos-property-url"><strong><?php esc_html_e( 'External website', 'coastalos-blocks' ); ?></strong></label><br />
		<input id="coastalos-property-url" name="coastalos_property_url" type="url" class="widefat" value="<?php echo esc_attr( $url ); ?>" />
	</p>
	<p class="description"><?php esc_html_e( 'Add a featured image for the property card. External links receive CoastalOS UTM parameters automatically.', 'coastalos-blocks' ); ?></p>
	<?php
}

/** Save the property-specific card fields. */
function coastalos_blocks_save_property_meta( $post_id ) {
	if ( ! isset( $_POST['coastalos_property_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['coastalos_property_nonce'] ) ), 'coastalos_save_property_details' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( 'coastalos_property' !== get_post_type( $post_id ) ) {
		return;
	}

	$text_fields = array(
		'coastalos_property_location' => '_coastalos_property_location',
		'coastalos_property_type'     => '_coastalos_property_type',
	);
	foreach ( $text_fields as $input_name => $meta_key ) {
		if ( isset( $_POST[ $input_name ] ) ) {
			update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $input_name ] ) ) );
		}
	}
	if ( isset( $_POST['coastalos_property_url'] ) ) {
		update_post_meta( $post_id, '_coastalos_property_url', esc_url_raw( wp_unslash( $_POST['coastalos_property_url'] ) ) );
	}
}
add_action( 'save_post_coastalos_property', 'coastalos_blocks_save_property_meta' );

/** Load translations from the plugin folder. */
function coastalos_blocks_load_textdomain() {
	load_plugin_textdomain( 'coastalos-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'coastalos_blocks_load_textdomain' );

/** Register the reusable wrapper pattern category. */
function coastalos_blocks_pattern_category() {
	register_block_pattern_category(
		'coastalos-sections',
		array( 'label' => __( 'CoastalOS Sections', 'coastalos-blocks' ) )
	);
	register_block_pattern_category(
		'coastalos-pages',
		array( 'label' => __( 'CoastalOS Pages', 'coastalos-blocks' ) )
	);
}
add_action( 'init', 'coastalos_blocks_pattern_category', 20 );

require_once COASTALOS_BLOCKS_PATH . 'patterns/register.php';
