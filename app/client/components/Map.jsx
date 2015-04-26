/* @flow */

var React = require('react');
var config = require('../config');
var mapsLib = require('../map');
var PointCaption = require('./PointCaption');
var path = require('../map/path');
var statsStore = require('../stores/StatsStore');

var Map = React.createClass({

  getInitialState: function() {
    return {
      caption: {
        x: 0,
        y: 0,
        visible: false
      }
    };
  },


  componentWillUnmount() {
    statsStore.unlisten(this.onStoreChange);
  },

  componentDidMount() {
    statsStore.listen(this.onStoreChange);
    var map = mapsLib.initMap();
    var layer = mapsLib.initMaskedLayer();
    layer.setData([]);
    map.addLayer(layer);
    map.on('moveend, zoomend', () => {
      this.locatePoint(this.props.points[this.props.points.length - 1], map);
    });
    map.on('movestart', () => {
      if (this.state.caption.visible)
      {
        this.setState({
          caption: {
            visible: false
          }
        })
      }
    });
    this.setState({
      map: map,
      layer: layer
    });
  },

  render(): any {
    return (<div className="map-container" id="map">
        <PointCaption
          isVisible={this.state.caption.visible }
          x={this.state.caption.x}
          y={this.state.caption.y}
          caption= {this.state.caption.title}
          image= {this.state.caption.image} />

      </div>);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.points.length > 0 && nextProps.points.length != this.props.points.length) {
      // make a diff between props
      // and draw on the map
      this.drawPoints(
        nextProps.points
          .filter(p => p.lat)
          .map(p=> [p.lat, p.lng, p.r])
        );

      if (nextProps.points.length > 0 && !this.state.map.getBounds().contains(this.state.layer.bounds20)) {
         this.state.map.fitBounds(this.state.layer.bounds20, {
           animate: true,
           padding: [200, 200]
         });
      }

      var p = nextProps.points[nextProps.points.length - 1];
      this.locatePoint(p, this.state.map);

      if (nextProps.points.length > 1
        && nextProps.points[nextProps.points.length - 1].lat
        && nextProps.points[nextProps.points.length - 2].lat) {
           path.drawLine(
             nextProps.points.length
             , nextProps.points[nextProps.points.length - 1]
             , nextProps.points[nextProps.points.length - 2]
             , this.state.map);
        }
      }
  },

  locatePoint(p, map) {
    if (p && p.lat) {
      var a = map.latLngToContainerPoint([p.lat, p.lng]);
      this.setState({
        caption: {
          x: a.x,
          y: a.y,
          visible: true
        }
      });
    }
  },

  drawPoints(points: Array<any>) {
    this.state.layer.setData(points);
  },

  onStoreChange(store) {
    var p = store.point;
    console.log('handle point clicked', p);
    this.state.map.panTo([p.lat, p.lng]);

  }

});

module.exports = Map;
