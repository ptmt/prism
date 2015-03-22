/* @flow */
var React = require('react');

var StatPanel = React.createClass({
  // getInitialState() {
  //   return {
  //     level: 0,
  //     exp: 0
  //   }
  // },
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
      </div>
    );
  }
});

module.exports = StatPanel;
