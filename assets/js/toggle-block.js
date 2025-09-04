(function(wp){
var el = wp.element.createElement;
var blockEditor = wp.blockEditor;
var components = wp.components;
var InspectorControls = blockEditor.InspectorControls;
var InnerBlocks = blockEditor.InnerBlocks;
var PanelBody = components.PanelBody;
var SelectControl = components.SelectControl;
var ToggleControl = components.ToggleControl;

wp.blocks.registerBlockType('lg-webos/remote-toggle', {
title: 'LG webOS Remote Toggle',
icon: 'visibility',
category: 'widgets',
attributes: {
colorKey: { type:'string', default:'blue' },
startOpen: { type:'boolean', default:false },
animation: { type:'string', default:'fade' }
},
edit: function(props){
var a = props.attributes;
var setAttr = function(k){ return function(v){ var up={}; up[k]=v; props.setAttributes(up); }; };

  return [
    el(InspectorControls, {},
      el(PanelBody, { title:'Toggle Settings', initialOpen:true },
        el(SelectControl, {
          label: 'Color Key',
          value: a.colorKey,
          options: [
            {label:'Red', value:'red'},
            {label:'Green', value:'green'},
            {label:'Yellow', value:'yellow'},
            {label:'Blue', value:'blue'}
          ],
          onChange: setAttr('colorKey')
        }),
        el(ToggleControl, {
          label: 'Start Open',
          checked: a.startOpen,
          onChange: setAttr('startOpen')
        }),
        el(SelectControl, {
          label: 'Animation',
          value: a.animation,
          options: [
            {label:'Fade', value:'fade'},
            {label:'Slide Down', value:'slide-down'},
            {label:'Slide Up', value:'slide-up'}
          ],
          onChange: setAttr('animation')
        })
      )
    ),
    el('div', { className:'lgwebos-remote-toggle-editor' },
      el('p', {}, 'Remote Toggle (' + a.colorKey + ') — Add content to be toggled below:'),
      el(InnerBlocks)
    )
  ];
},
save: function(){ return el(InnerBlocks.Content); }

});
})(window.wp);
