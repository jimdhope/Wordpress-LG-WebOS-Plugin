<?php
/**
* Plugin Name: LG webOS for WordPress
* Description: Blocks and helpers to build LG webOS-style interactive pages (webOS.js + Luna API glue)
* Version: 0.2.0
* Author: Jim Hope
*/

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'LG_WEBOS_WP_DIR', plugin_dir_path( __FILE__ ) );
define( 'LG_WEBOS_WP_URL', plugin_dir_url( __FILE__ ) );

require_once LG_WEBOS_WP_DIR . 'includes/class-plugin.php';

function lg_webos_wp_boot() {
$plugin = new LG_WebOS_WP_Plugin();
}
add_action( 'plugins_loaded', 'lg_webos_wp_boot' );