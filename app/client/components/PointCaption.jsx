/* @flow */
var React = require('react');
var mui = require('material-ui');

var PointCaption = React.createClass({
  render: function(): any {
    var style = {
      top: this.props.y,
      left: this.props.x,
      display: this.props.isVisible ? 'block': 'none'
    }

    return (
      <div style={style} className="current-point gps-ring">
        <div></div>
      </div>

    );
  }
});

module.exports = PointCaption;
