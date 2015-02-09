/* @flow */

var React = require('react');
var config = require('../config');
var mapsLib = require('../map');

var Map = React.createClass({

  // getInitialState: function() {
  //   return {
  //     foursquareConnected: false
  //   };
  // },
  //
  componentDidMount: function() {
    var map = mapsLib.initMap();
    var layer = mapsLib.initMaskedLayer();
    var isAuth = window.localStorage.getItem('auth') === 'true';
    var isDebug = window.localStorage.getItem('debug') === 'true' && document.location.href.indexOf('logout') === -1;

    layer.setData([]);
    map.addLayer(layer);
    this.setState({
      map: map,
      layer: layer
    });
  },

  render(): any {
    return (<div className="map-container" id="map"></div>);
  },

});

module.exports = Map;
