/* @flow */
var React = require('react');
var mui = require('material-ui');

var PointCaption = React.createClass({
  render: function(): any {
    //console.log(this.props.image);
    var style = {
      top: this.props.y,
      left: this.props.x,
      display: this.props.isVisible ? 'block': 'none'
    }
    var icon = 'icon ion-social-foursquare-outline'

    return (
      <div style={style} className="caption">
        <span className= {icon}></span>
      </div>

    );
  }
});

module.exports = PointCaption;
