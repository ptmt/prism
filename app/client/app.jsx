/* @flow */
var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin")
var Main = require('./components/Main');
var appActions = require('./actions')

// needed for React Developer Tools
window.React = React;
// needed before React 1.0
injectTapEventPlugin();

React.render(
  <Main />,
  document.body // TODO: append to <div>
);

appActions.init();
