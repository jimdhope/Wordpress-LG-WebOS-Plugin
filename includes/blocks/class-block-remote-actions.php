<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class LG_WebOS_Block_Remote_Actions {

    public static function register() {
        register_block_type( 'lg-webos/remote-actions', [
            'editor_script' => 'lg-webos-wp-block',
            'style' => 'lg-webos-wp',
            'render_callback' => [ __CLASS__, 'render' ],
            'attributes' => [
                'startIndex' => [ 'type' => 'number', 'default' => 0 ],
                'listenKeys' => [ 'type' => 'string', 'default' => 'arrows,enter,color' ],
            ],
        ] );
    }

    public static function render( $attrs, $content ) {
        $attrs = wp_parse_args( $attrs, [
            'startIndex' => 0,
            'listenKeys' => 'arrows,enter,color'
        ] );
        $data = esc_attr( wp_json_encode( $attrs ) );
        return '<div class="lgwebos-remote-actions" data-lgwebos="' . $data . '">' . $content . '</div>';
    }
}
