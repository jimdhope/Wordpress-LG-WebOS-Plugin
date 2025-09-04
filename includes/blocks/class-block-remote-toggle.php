<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class LG_WebOS_Block_Remote_Toggle {
public static function register() {
register_block_type( 'lg-webos/remote-toggle', [
'editor_script' => 'lg-webos-wp-toggle-block',
'style' => 'lg-webos-wp',
'render_callback' => [ __CLASS__, 'render' ],
'attributes' => [
'colorKey' => [ 'type' => 'string', 'default' => 'blue' ],
'startOpen' => [ 'type' => 'boolean', 'default' => false ],
'animation' => [ 'type' => 'string', 'default' => 'fade' ],
],
] );
}

public static function render( $attrs, $content ) {
$attrs = wp_parse_args( $attrs, [ 'colorKey' => 'blue', 'startOpen' => false, 'animation' => 'fade' ] );
$data = esc_attr( wp_json_encode( $attrs ) );
$classes = 'lgwebos-remote-content lgwebos-anim-' . esc_attr( $attrs['animation'] );
if ( ! $attrs['startOpen'] ) $classes .= ' hidden';
return '<div class="' . $classes . '" data-lgwebos-toggle="' . $data . '">' . $content . '</div>';
}
}