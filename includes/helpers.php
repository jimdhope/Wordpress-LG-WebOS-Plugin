<?php

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * @param string $prefix Optional prefix for the ID. Default: 'lgwebos-'.
 * @return string Unique ID string.
 */
function lgwebos_unique_id( $prefix = 'lgwebos-' ) {
    return $prefix . wp_generate_password( 8, false, false );
}
?>