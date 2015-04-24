/* @flow */
var React = require('react');

var StatPanel = React.createClass({

  accent(val) {
    return <span className="accent">{val}</span>;
  },

  render: function(): any {
    return (
      <div className="stats">
        <div className="player-level box">
          <div className="value">{this.props.player.level}</div>
          <div className="label">Level</div>
        </div>
        <div className="player-exp box">
          <div className="value">{this.props.player.exp}</div>
          <div className="label">Exp</div>
        </div>
        <div className="checkin-stat box">
          <div>Avg Speed: {this.accent(this.props.stat.avgSpeed)} km/h</div>
          <div>Top Speed: {this.accent(this.props.stat.topSpeed)} km/h</div>
          <div>Total Distance: {this.accent(this.props.stat.totalDistance)} km</div>
          <div>Last Ditance: {this.accent(this.props.stat.lastDistance)} km</div>
        </div>
      </div>
    );
  }
});

module.exports = StatPanel;
