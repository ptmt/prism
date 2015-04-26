/* @flow */
var React = require('react');
var mui = require('material-ui');
var appActions = require('../actions');

var LeftPanel = React.createClass({

  getInitialState() {
    return {
      open : false
    }
  },


  _renderAction(point) {
    return <span className="accent accent-clickable"
      onClick={this.handlePoint.bind(this, point)}>{point.name}</span>;
  },

  handlePoint(point) {
    appActions.pointClicked(point);
  },

  render: function(): any {
    var classes = !this.state.open ? 'left-panel closed': 'left-panel opened';
    var icon = !this.state.open ? 'icon ion-chevron-right': 'icon ion-chevron-left';
    var stats = this.props.stats;
    var player = this.props.player;

    if (this.props.player.achievements)
    {
      var log = this.props.player.achievements.join(' ');
    }
    return (
      <div className={classes}>
        <div className="overlay-background">
          <div className="toggler" onClick={this.toggleStatPanel}>
            <span className={icon}></span>
          </div>
        </div>
        <div className="info">
            <h3>Common statistics</h3>
            Avg Distance per checkin: <span className="accent">{stats.avgDistancePerCheckin}</span> km <br/>
            Most liked: <span className="accent">{stats.mostLikedCheckin && this._renderAction(stats.mostLikedCheckin)}</span><br/>
            Most popular place: {stats.mostPopularCheckin && this._renderAction(stats.mostPopularCheckin)}<br/>
            Hottest place: <span className="accent">{stats.hottestPlace && this._renderAction(stats.hottestPlace)}</span><br/>
            <h3>Skills</h3>
            Curiosity: <span className="accent">{player.skills.curiosity}</span><br/>
            Sociality: <span className="accent">{player.skills.sociality}</span>
            <h3>System</h3>
            {this.props.stats.fs &&
              <span>Foursquare Clients: <span className="accent">{this.props.stats.fs.clients}</span></span>
            }
            <h3>Achievements</h3>
            {log}
        </div>
      </div>
    );
  },

  toggleStatPanel() {
    this.setState({
      open: !this.state.open
    })
  }
});

module.exports = LeftPanel;
