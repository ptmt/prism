/* @flow */

var React = require('react');
var config = require('../config');
var mapsLib = require('../map');
var PointCaption = require('./PointCaption');

// this is not react-ish component
// because it manages state internally inside layers

var Map = React.createClass({

  getInitialState: function() {
    return {
      caption: {
        x: 0,
        y: 0,
        title: ''
      }
    };
  },
  //
  componentDidMount() {
    var map = mapsLib.initMap();
    var layer = mapsLib.initMaskedLayer();
    layer.setData([]);
    map.addLayer(layer);
    this.setState({
      map: map,
      layer: layer
    });
  },

  render(): any {
    var pointCaptionVisible = this.props.points ? this.props.points.length > 0 : false;
    return (<div className="map-container" id="map">
        <PointCaption
          isVisible={pointCaptionVisible}
          x={this.state.caption.x}
          y={this.state.caption.y}
          caption= {this.state.caption.title}/>
      </div>);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.points && nextProps.points.length != this.props.points.length) {
      // make a diff between props
      // and draw on the map
      this.drawPoints(
        nextProps.points
          .filter(p => p.lat)
          .map(p=> [p.lat, p.lng, p.r])
        );

      if (nextProps.points.length > 0 && !this.state.map.getBounds().contains(this.state.layer.bounds20)) {
         this.state.map.fitBounds(this.state.layer.bounds20, {
           animate: true
         });
      }


      var p = nextProps.points[nextProps.points.length - 1];
      if (p.lat) {
        this.placeCaption([p.lat, p.lng], p.caption);
      }
    }
  },

  placeCaption(coordinates: any, caption: any) {
    var a = this.state.map.latLngToLayerPoint(coordinates);
    this.setState({
      caption: {
        x: a.x,
        y: a.y,
        title: caption
      }
    });
  },

  drawPoints(points: Array<any>) {
    this.state.layer.setData(points);
  }

});

module.exports = Map;
