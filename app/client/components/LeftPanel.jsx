/* @flow */
var React = require('react');
var mui = require('material-ui');

var LeftPanel = React.createClass({

  getInitialState() {
    return {
      open : false
    }
  },

  render: function(): any {
    var classes = !this.state.open ? 'left-panel closed': 'left-panel opened';
    var icon = !this.state.open ? 'icon ion-chevron-right': 'icon ion-chevron-left';
    var stats = this.props.stats;

    return (
      <div className={classes}>
      <div className="info">
          <h3>Common statistics</h3>
          Avg Distance Per Checkin: <span className="accent">{stats.avgDistancePerCheckin}</span> km/h
          <h3>Skills</h3>
      </div>
        <div className="overlay-background">
          <div className="toggler" onClick={this.toggleStatPanel}>
            <span className={icon}></span>
          </div>
        </div>


      </div>
    );
  },

  toggleStatPanel() {
    console.log('open');
    this.setState({
      open: !this.state.open
    })
  }
});

module.exports = LeftPanel;
