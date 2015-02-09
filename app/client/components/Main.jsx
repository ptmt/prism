/* @flow */

var React = require('react');
var config = require('../config');
var mapsLib = require('../map');
var Map = require('./Map');
var TopToolbar = require('./TopToolbar');
var WelcomeWindow = require('./WelcomeWindow');

var Main = React.createClass({

  // getInitialState: function() {
  //   return {
  //     foursquareConnected: false
  //   };
  // },
  //
  componentDidMount: function() {
    // var map = mapsLib.initMap();
    // var layer = mapsLib.initMaskedLayer();
    // var isAuth = window.localStorage.getItem('auth') === 'true';
    // var isDebug = window.localStorage.getItem('debug') === 'true' && document.location.href.indexOf('logout') === -1;
    //
    // layer.setData([]);
    // map.addLayer(layer);
    // this.state({
    //   map: map,
    //   layer: layer
    // });
  },

  render(): any {
    return (
      <div>
        <Map />
        <TopToolbar />
        <WelcomeWindow />
      </div>);
  },

});

module.exports = Main;
