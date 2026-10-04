<?php
/** Register generated CoastalOS starter page and section patterns. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function coastalos_blocks_register_generated_patterns() {
	$pattern_file = COASTALOS_BLOCKS_PATH . 'patterns/generated.json';
	if ( ! is_readable( $pattern_file ) ) {
		return;
	}
	$patterns = json_decode( file_get_contents( $pattern_file ), true );
	if ( ! is_array( $patterns ) ) {
		return;
	}

	foreach ( array( 'pages' => 'coastalos-pages', 'sections' => 'coastalos-sections' ) as $collection => $category ) {
		foreach ( isset( $patterns[ $collection ] ) && is_array( $patterns[ $collection ] ) ? $patterns[ $collection ] : array() as $pattern ) {
			if ( empty( $pattern['slug'] ) || empty( $pattern['content'] ) ) {
				continue;
			}
			if ( 'pages' === $collection ) {
				$slug  = 'coastalos/page-' . sanitize_title( $pattern['slug'] );
				$title = isset( $pattern['title'] ) ? $pattern['title'] : __( 'CoastalOS page', 'coastalos-blocks' );
				$description = __( 'A complete CoastalOS page starter. Insert it into a page, then edit, rearrange, or remove sections.', 'coastalos-blocks' );
			} else {
				$slug  = sprintf( 'coastalos/section-%s-%s-%d', sanitize_title( $pattern['slug'] ), sanitize_title( $pattern['page'] ?? 'starter' ), absint( $pattern['index'] ?? 0 ) );
				$title = sprintf( __( '%1$s section — %2$s', 'coastalos-blocks' ), ucwords( str_replace( '-', ' ', $pattern['slug'] ) ), ucwords( str_replace( '-', ' ', $pattern['page'] ?? 'starter' ) ) );
				$description = __( 'A copyable CoastalOS prototype section. Duplicate and edit its blocks in the editor.', 'coastalos-blocks' );
			}
			register_block_pattern( $slug, array(
				'title'       => $title,
				'description' => $description,
				'categories'  => array( $category ),
				'content'     => $pattern['content'],
			) );
		}
	}
}
add_action( 'init', 'coastalos_blocks_register_generated_patterns', 30 );
