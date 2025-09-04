<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class LG_WebOS_Block_Remote_Menu {

	public static function register() {
		register_block_type( 'lg-webos/remote-menu', [
			'editor_script' => 'lg-webos-wp-menu-block',
			'style' => 'lg-webos-wp',
			'render_callback' => [ __CLASS__, 'render' ],
			'attributes' => [
				'colorKey' => [ 'type' => 'string', 'default' => '' ],
				'stickyTop' => [ 'type' => 'boolean', 'default' => false ],
				'startHidden' => [ 'type' => 'boolean', 'default' => false ],
				'wrap' => [ 'type' => 'boolean', 'default' => true ],
			],
		] );
	}

	public static function render( $attrs, $content ) {
		$attrs = wp_parse_args( $attrs, [
			'colorKey' => '',
			'stickyTop' => false,
			'startHidden' => false,
			'wrap' => true,
		] );
		$data = [
			'wrap' => (bool) $attrs['wrap'],
			'colorKey' => (string) $attrs['colorKey'],
			'startHidden' => (bool) $attrs['startHidden'],
		];
		$menu_attr = esc_attr( wp_json_encode( $data ) );
		$classes = 'lgwebos-menu';
		if ( ! empty( $attrs['stickyTop'] ) ) $classes .= ' lgwebos-sticky-top';
		if ( ! empty( $attrs['startHidden'] ) ) $classes .= ' hidden';
		return '<nav class="' . esc_attr( $classes ) . '" data-lgwebos-menu="' . $menu_attr . '">' . $content . '</nav>';
	}
}