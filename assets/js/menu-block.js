(function(wp){
var el = wp.element.createElement;
var blockEditor = wp.blockEditor;
var components = wp.components;
var InspectorControls = blockEditor.InspectorControls;
var InnerBlocks = blockEditor.InnerBlocks;
var PanelBody = components.PanelBody;
var SelectControl = components.SelectControl;
var ToggleControl = components.ToggleControl;

wp.blocks.registerBlockType('lg-webos/remote-menu', {
title: 'LG webOS TV Menu',
icon: 'menu',
category: 'widgets',
attributes: {
  colorKey: { type: 'string', default: '' },
  stickyTop: { type: 'boolean', default: false },
  startHidden: { type: 'boolean', default: false },
  wrap: { type: 'boolean', default: true }
},
edit: function(props){
  var a = props.attributes;
  var setAttr = function(k){ return function(v){ var up={}; up[k]=v; props.setAttributes(up); }; };
  return [
    el(InspectorControls, {},
      el(PanelBody, { title:'Menu Settings', initialOpen:true },
        el(SelectControl, {
          label: 'Color Key (optional toggle)',
          value: a.colorKey,
          options: [
            {label:'None', value:''},
            {label:'Red', value:'red'},
            {label:'Green', value:'green'},
            {label:'Yellow', value:'yellow'},
            {label:'Blue', value:'blue'}
          ],
          onChange: setAttr('colorKey')
        }),
        el(ToggleControl, {
          label: 'Sticky Top',
          checked: a.stickyTop,
          onChange: setAttr('stickyTop')
        }),
        el(ToggleControl, {
          label: 'Start Hidden',
          checked: a.startHidden,
          onChange: setAttr('startHidden')
        }),
        el(ToggleControl, {
          label: 'Wrap navigation',
          checked: a.wrap,
          onChange: setAttr('wrap')
        })
      )
    ),
    el('nav', { className:'lgwebos-menu-editor' },
      el('p', {}, 'Add menu items (buttons/links) inside. Use Tab order for intended sequence.'),
      el('p', {}, 'Optional: add data-luna-service, data-luna-method, data-luna-payload to an item for native actions.'),
      el(InnerBlocks)
    )
  ];
},
save: function(){ return el(InnerBlocks.Content); }
});
})(window.wp);


