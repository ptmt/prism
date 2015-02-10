/* @flow */
var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin")
var Main = require('./components/Main');
//var TopToolbar = require('./components/TopToolbar.react');
var appActions = require('./actions')

// needed for React Developer Tools
window.React = React;
// needed before React 1.0
injectTapEventPlugin();

React.render(
  <Main />,
  document.body
);

appActions.welcome();

// document.addEventListener('DOMContentLoaded', function() {
//   // var map = maps.getMap();
//   // var layer = maps.initMaskedLayer();
//   // var isAuth = window.localStorage.getItem('auth') === 'true';
//   // var isDebug = window.localStorage.getItem('debug') === 'true' && document.location.href.indexOf('logout') === -1;
//   //
//   // layer.setData([]);
//   // map.addLayer(layer);
//   // if (document.location.href.indexOf('start') > -1) {
//   //   window.localStorage.setItem('auth', true);
//   // }
//
//   // if (isAuth || isDebug) {
//   //   React.render(<TopToolbar />, document.querySelector('.toolbar-container'));
//   //   appActions.start(map, layer);
//   // } else {
//   React.render(
//     <Main />,
//     document.body
//   );
//     //document.querySelectorAll('.signup-form')[0].style.display = 'block';
//   //}
// });
