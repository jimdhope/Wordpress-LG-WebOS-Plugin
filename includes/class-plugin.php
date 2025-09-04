<?php
if ( ! defined( 'ABSPATH' ) ) exit;

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/blocks/class-block-remote-actions.php';
require_once __DIR__ . '/blocks/class-block-remote-menu.php';
require_once __DIR__ . '/blocks/class-block-remote-toggle.php';
require_once __DIR__ . '/blocks/class-block-fullscreen-section.php';

class LG_WebOS_WP_Plugin {
const OPTION_KEY = 'lg_webos_wp_settings';

public function __construct() {
add_action( 'init', [ $this, 'register_assets' ] );
add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
add_action( 'init', [ $this, 'register_blocks' ] );

add_action( 'rest_api_init', function() {
register_rest_route( 'lg-webos/v1', '/luna', [
'methods' => 'POST',
'callback' => [ $this, 'rest_luna_proxy' ],
'permission_callback' => function( WP_REST_Request $request ) {
                    // It's crucial to verify the nonce to protect your REST endpoint.
                    return wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' );
                },
] );
} );
}

public function get_settings() {
$defaults = [
'enable_webos_js' => 1,
'simulate_on_desktop' => 1,
'luna_service_whitelist' => "com.webos.service.tv.display,com.webos.service.tv.systemproperty",
];
$opts = get_option( self::OPTION_KEY, [] );
return wp_parse_args( $opts, $defaults );
}

public function register_assets() {
$ver = '0.1.0';
wp_register_script( 'lg-webos-wp-frontend', LG_WEBOS_WP_URL . 'assets/js/frontend.js', [], $ver, true );
wp_localize_script( 'lg-webos-wp-frontend', 'LG_WEBOS_WP', [
'rest' => [ 'root' => rest_url( 'lg-webos/v1' ), 'nonce' => wp_create_nonce( 'wp_rest' ) ],
'settings' => $this->get_settings(),
] );

wp_register_script( 'lg-webos-wp-block', LG_WEBOS_WP_URL . 'assets/js/block.js', [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ], $ver, true );
wp_register_script( 'lg-webos-wp-menu-block', LG_WEBOS_WP_URL . 'assets/js/menu-block.js', [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ], $ver, true );
wp_register_script( 'lg-webos-wp-toggle-block', LG_WEBOS_WP_URL . 'assets/js/toggle-block.js', [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ], $ver, true );
wp_register_script( 'lg-webos-wp-fullscreen-block', LG_WEBOS_WP_URL . 'assets/js/fullscreen-block.js', [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ], $ver, true );

wp_register_style( 'lg-webos-wp', LG_WEBOS_WP_URL . 'assets/css/style.css', [], $ver );
}

public function enqueue_frontend_assets() {
wp_enqueue_script( 'lg-webos-wp-frontend' );
wp_enqueue_style( 'lg-webos-wp' );
}

public function register_blocks() {
// Initialize block classes (they register themselves)
LG_WebOS_Block_Remote_Actions::register();
LG_WebOS_Block_Remote_Menu::register();
LG_WebOS_Block_Remote_Toggle::register();
LG_WebOS_Block_Fullscreen_Section::register();
}

public function rest_luna_proxy( WP_REST_Request $req ) {
$params = $req->get_json_params();
$service = sanitize_text_field( $params['service'] ?? '' );
return rest_ensure_response([ 'ok' => true, 'service' => $service, 'simulated' => true ]);
}
}