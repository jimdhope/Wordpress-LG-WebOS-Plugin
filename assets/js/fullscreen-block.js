(function(wp){
    var el = wp.element.createElement;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var ColorPalette = wp.components.ColorPalette;
    var TextControl = wp.components.TextControl;
    var SelectControl = wp.components.SelectControl;
    var InnerBlocks = wp.blockEditor.InnerBlocks;
    var MediaUpload = (wp.blockEditor && wp.blockEditor.MediaUpload) || (wp.editor && wp.editor.MediaUpload);
    var MediaUploadCheck = (wp.blockEditor && wp.blockEditor.MediaUploadCheck) || (wp.editor && wp.editor.MediaUploadCheck);
    
    wp.blocks.registerBlockType('lg-webos/fullscreen-section', {
    title: 'LG webOS Fullscreen Section',
    icon: 'fullscreen-alt',
    category: 'widgets',
    supports: { anchor: true },
    attributes: {
        backgroundColor: { type: 'string', default: '#000000' },
        textColor: { type: 'string', default: '#FFFFFF' },
        fontFamily: { type: 'string', default: '' },
        colorKey: { type: 'string', default: '' },
        backgroundType: { type: 'string', default: 'color' }, // color | media | url
        backgroundUrl: { type: 'string', default: '' },
        backgroundMediaType: { type: 'string', default: '' }, // image | video (optional, can be inferred)
        // Back-compat legacy fields (not shown in UI)
        backgroundImageUrl: { type: 'string', default: '' },
        backgroundVideoUrl: { type: 'string', default: '' },
        backgroundVideoAutoplay: { type: 'boolean', default: true },
        backgroundVideoMuted: { type: 'boolean', default: true },
        backgroundVideoLoop: { type: 'boolean', default: true },
        contentHorizontal: { type: 'string', default: 'center' }, // left | center | right
        contentVertical: { type: 'string', default: 'center' },   // top | center | bottom
    },
    edit: function(props){
        var a = props.attributes;
        var setAttr = function(k){ return function(v){ var up={}; up[k]=v; props.setAttributes(up); }; };

        // Compute preview styles and background element for the editor
        var editorStyle = {
            position: 'relative',
            overflow: 'hidden',
            minHeight: '60vh',
            backgroundColor: a.backgroundType === 'color' ? (a.backgroundColor || '#000') : undefined,
            color: a.textColor || '#fff',
            fontFamily: a.fontFamily || undefined,
            padding: '16px'
        };
        var bgEl = null;
        var mediaUrl = a.backgroundUrl || a.backgroundImageUrl || a.backgroundVideoUrl || '';
        var mediaType = a.backgroundMediaType;
        if (!mediaType && mediaUrl) {
            var lower = (mediaUrl || '').toLowerCase();
            mediaType = /\.(mp4|webm|ogg)(\?.*)?$/.test(lower) ? 'video' : 'image';
        }
        if ((a.backgroundType === 'media' || a.backgroundType === 'url') && mediaUrl) {
            if (mediaType === 'video') {
                bgEl = el('video', {
                    className: 'lgwebos-fs-bg',
                    autoPlay: a.backgroundVideoAutoplay !== false,
                    muted: a.backgroundVideoMuted !== false,
                    loop: a.backgroundVideoLoop !== false,
                    playsInline: true,
                    style: { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }
                }, el('source', { src: mediaUrl }));
            } else {
                bgEl = el('img', {
                    className: 'lgwebos-fs-bg',
                    src: mediaUrl,
                    alt: '',
                    style: { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }
                });
            }
        }

        return [
            el(InspectorControls, {}, 
                el(PanelBody, { title: 'Background' },
                    el(SelectControl, {
                        label: 'Background Type',
                        value: a.backgroundType,
                        options: [
                            { label: 'Color', value: 'color' },
                            { label: 'Media Library', value: 'media' },
                            { label: 'URL', value: 'url' }
                        ],
                        onChange: setAttr('backgroundType')
                    }),
                    a.backgroundType === 'color' && el('div', { className: 'lgwebos-bg-field' },
                        el('p', {}, 'Background Color'),
                        el(ColorPalette, { value: a.backgroundColor, onChange: setAttr('backgroundColor') })
                    ),
                    a.backgroundType === 'media' && MediaUpload && MediaUploadCheck && el(MediaUploadCheck, {},
                        el(MediaUpload, {
                            onSelect: function(media){
                                if(media && media.url){
                                    props.setAttributes({ backgroundUrl: media.url, backgroundMediaType: media.type === 'video' ? 'video' : 'image' });
                                }
                            },
                            allowedTypes: ['image','video'],
                            render: function(obj){
                                var label = a.backgroundUrl ? 'Change Media' : 'Select Media';
                                return el(wp.components.Button, { isSecondary: true, onClick: obj.open }, label);
                            }
                        })
                    ),
                    a.backgroundType === 'url' && el(TextControl, { label: 'Background URL (image or video)', value: a.backgroundUrl, onChange: function(v){
                        // Infer media type from extension if possible
                        var lower = (v||'').toLowerCase();
                        var isVideo = /\.(mp4|webm|ogg)(\?.*)?$/.test(lower);
                        props.setAttributes({ backgroundUrl: v, backgroundMediaType: isVideo ? 'video' : 'image' });
                    } }),
                    (a.backgroundMediaType === 'video' && (a.backgroundType === 'media' || a.backgroundType === 'url')) && el(SelectControl, { label:'Autoplay', value: a.backgroundVideoAutoplay ? '1':'0', options:[{label:'Yes',value:'1'},{label:'No',value:'0'}], onChange:function(v){ setAttr('backgroundVideoAutoplay')(v==='1'); } }),
                    (a.backgroundMediaType === 'video' && (a.backgroundType === 'media' || a.backgroundType === 'url')) && el(SelectControl, { label:'Muted', value: a.backgroundVideoMuted ? '1':'0', options:[{label:'Yes',value:'1'},{label:'No',value:'0'}], onChange:function(v){ setAttr('backgroundVideoMuted')(v==='1'); } }),
                    (a.backgroundMediaType === 'video' && (a.backgroundType === 'media' || a.backgroundType === 'url')) && el(SelectControl, { label:'Loop', value: a.backgroundVideoLoop ? '1':'0', options:[{label:'Yes',value:'1'},{label:'No',value:'0'}], onChange:function(v){ setAttr('backgroundVideoLoop')(v==='1'); } })
                ),
                el(PanelBody, { title: 'Layout' },
                    el(SelectControl, {
                        label: 'Horizontal Alignment',
                        value: a.contentHorizontal,
                        options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' }
                        ],
                        onChange: setAttr('contentHorizontal')
                    }),
                    el(SelectControl, {
                        label: 'Vertical Alignment',
                        value: a.contentVertical,
                        options: [
                            { label: 'Top', value: 'top' },
                            { label: 'Center', value: 'center' },
                            { label: 'Bottom', value: 'bottom' }
                        ],
                        onChange: setAttr('contentVertical')
                    })
                ),
                el(PanelBody, { title: 'Typography' },
                    el('p', {}, 'Text Color'),
                    el(ColorPalette, { value: a.textColor, onChange: setAttr('textColor') }),
                    el(TextControl, { label: 'Font Family', value: a.fontFamily, onChange: setAttr('fontFamily') })
                ),
                el(PanelBody, { title: 'Remote Control' },
                    el(SelectControl, {
                        label: 'Color Key',
                        value: a.colorKey,
                        options: [
                            { label: 'None', value: '' },
                            { label: 'Red', value: 'red' },
                            { label: 'Green', value: 'green' },
                            { label: 'Yellow', value: 'yellow' },
                            { label: 'Blue', value: 'blue' },
                        ],
                        onChange: setAttr('colorKey')
                    })
                )
            ),
            el('div', { className: 'lgwebos-fullscreen-section lgwebos-fullscreen-section-editor', style: editorStyle },
                bgEl,
                el('div', { className: 'lgwebos-fs-inner', style: {
                    position:'relative', zIndex:1, display:'flex', width:'100%', height:'100%',
                    justifyContent: (a.contentHorizontal === 'left' ? 'flex-start' : a.contentHorizontal === 'right' ? 'flex-end' : 'center'),
                    alignItems: (a.contentVertical === 'top' ? 'flex-start' : a.contentVertical === 'bottom' ? 'flex-end' : 'center')
                } }, el(InnerBlocks))
            )
        ];
    },
    save: function(){ 
        return el(InnerBlocks.Content);
    }
    });
    })(window.wp);