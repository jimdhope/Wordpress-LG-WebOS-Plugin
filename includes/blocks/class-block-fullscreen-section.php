<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class LG_WebOS_Block_Fullscreen_Section {

    public static function register() {
        register_block_type( 'lg-webos/fullscreen-section', [
            'editor_script' => 'lg-webos-wp-fullscreen-block',
            'style' => 'lg-webos-wp',
            'render_callback' => [ __CLASS__, 'render' ],
            'supports' => [ 'anchor' => true ],
            'attributes' => [
                'anchor' => [ 'type' => 'string', 'default' => '' ],
                'backgroundColor' => [ 'type' => 'string', 'default' => '#000000' ],
                'textColor' => [ 'type' => 'string', 'default' => '#FFFFFF' ],
                'fontFamily' => [ 'type' => 'string', 'default' => '' ],
                'colorKey' => [ 'type' => 'string', 'default' => '' ],
                'backgroundType' => [ 'type' => 'string', 'default' => 'color' ],
                'backgroundUrl' => [ 'type' => 'string', 'default' => '' ],
                'backgroundMediaType' => [ 'type' => 'string', 'default' => '' ],
                'backgroundImageUrl' => [ 'type' => 'string', 'default' => '' ],
                'backgroundVideoUrl' => [ 'type' => 'string', 'default' => '' ],
                'backgroundVideoAutoplay' => [ 'type' => 'boolean', 'default' => true ],
                'backgroundVideoMuted' => [ 'type' => 'boolean', 'default' => true ],
                'backgroundVideoLoop' => [ 'type' => 'boolean', 'default' => true ],
            ],
        ] );
    }

    public static function render( $attrs, $content ) {
        $attrs = wp_parse_args( $attrs, [
            'backgroundColor' => '#000000',
            'textColor' => '#FFFFFF',
            'fontFamily' => '',
            'colorKey' => '',
            'backgroundType' => 'color', // color | media | url
            'backgroundUrl' => '',
            'backgroundMediaType' => '', // image | video
            // legacy
            'backgroundImageUrl' => '',
            'backgroundVideoUrl' => '',
            'backgroundVideoAutoplay' => true,
            'backgroundVideoMuted' => true,
            'backgroundVideoLoop' => true,
            'contentHorizontal' => 'center',
            'contentVertical' => 'center',
        ] );
        $style = sprintf(
            'background-color: %s; color: %s; font-family: %s; position:relative; overflow:hidden;',
            esc_attr( $attrs['backgroundColor'] ),
            esc_attr( $attrs['textColor'] ),
            esc_attr( $attrs['fontFamily'] )
        );
        $color_key_attr = $attrs['colorKey'] ? ' data-color-key="' . esc_attr( $attrs['colorKey'] ) . '"' : '';
        $anchor_attr = ! empty( $attrs['anchor'] ) ? ' id="' . esc_attr( $attrs['anchor'] ) . '"' : '';
        $bg = '';
        $url = '';
        $type = '';
        if ( $attrs['backgroundType'] === 'media' || $attrs['backgroundType'] === 'url' ) {
            $url = $attrs['backgroundUrl'];
            $type = $attrs['backgroundMediaType'];
            if ( ! $type && $url ) {
                $lower = strtolower( parse_url( $url, PHP_URL_PATH ) );
                if ( preg_match( '/\.(mp4|webm|ogg)$/', $lower ) ) { $type = 'video'; } else { $type = 'image'; }
            }
        } elseif ( $attrs['backgroundType'] === 'color' ) {
            // legacy fallback support if provided
            if ( ! empty( $attrs['backgroundImageUrl'] ) ) { $url = $attrs['backgroundImageUrl']; $type = 'image'; }
            if ( ! empty( $attrs['backgroundVideoUrl'] ) ) { $url = $attrs['backgroundVideoUrl']; $type = 'video'; }
        }

        if ( $url && $type === 'image' ) {
            $bg = '<img class="lgwebos-fs-bg" src="' . esc_url( $url ) . '" alt="" />';
        } elseif ( $url && $type === 'video' ) {
            $bg = '<video class="lgwebos-fs-bg"' . ( $attrs['backgroundVideoAutoplay'] ? ' autoplay' : '' ) . ( $attrs['backgroundVideoMuted'] ? ' muted' : '' ) . ( $attrs['backgroundVideoLoop'] ? ' loop' : '' ) . ' playsinline>
<source src="' . esc_url( $url ) . '" />
</video>';
        }
        $inner_style = sprintf(
            'display:flex; width:100%%; height:100%%; justify-content:%s; align-items:%s;',
            $attrs['contentHorizontal'] === 'left' ? 'flex-start' : ( $attrs['contentHorizontal'] === 'right' ? 'flex-end' : 'center' ),
            $attrs['contentVertical'] === 'top' ? 'flex-start' : ( $attrs['contentVertical'] === 'bottom' ? 'flex-end' : 'center' )
        );
        return '<div class="lgwebos-fullscreen-section lgwebos-panel"' . $anchor_attr . ' style="' . $style . '"' . $color_key_attr . '>' . $bg . '<div class="lgwebos-fs-inner" style="' . esc_attr( $inner_style ) . '">' . $content . '</div></div>';
    }
}
