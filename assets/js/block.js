(function(wp){
    var el = wp.element.createElement;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var NumberControl = wp.components.NumberControl; // May not exist in older WP
    
    wp.blocks.registerBlockType('lg-webos/remote-actions', {
    title: 'LG webOS Remote Actions',
    icon: 'universal-access-alt',
    category: 'widgets',
    attributes: {
        startIndex: { type:'number', default: 0 },
        listenKeys: { type:'string', default: 'arrows,enter,color' }
    },
    edit: function(props){
        var a = props.attributes;
        var setAttr = function(k){ return function(v){ var up={}; up[k]=v; props.setAttributes(up); }; };
    return [
    el(InspectorControls, {}, el(PanelBody, { title:'Settings' },
        el(NumberControl || TextControl, { label:'Start Index', type:'number', value:a.startIndex, onChange:function(v){ props.setAttributes({startIndex: parseInt(v, 10) || 0}); } }),
        el(TextControl, { label:'Listen Keys (CSV)', help:'Valid keys: arrows, enter, color', value:a.listenKeys, onChange:setAttr('listenKeys') })
    )),
    el('div',{className:'lgwebos-remote-actions-editor'}, 'Remote Actions block — add panels and map keys via attributes.')
    ];
    },
    save: function(){ return null; }
    });
    })(window.wp);