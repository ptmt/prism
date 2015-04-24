/* @flow */
var React = require('react');
var mui = require('material-ui');
var sortBy = require('lodash.sortby');

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
    var player = this.props.player;
    return (
      <div className={classes}>
      <div className="info">
          <h3>Common statistics</h3>
          Avg Distance Between Checkins: <span className="accent">{stats.avgDistancePerCheckin}</span> km
          Most liked: <span className="accent">{stats.mostLikedCheckin && stats.mostLikedCheckin.caption}</span><br/>
          Most popular place: <span className="accent">{stats.mostPopularCheckin && stats.mostPopularCheckin.caption}</span><br/>
          Hottest place: <span className="accent">{stats.hottestPlace && stats.hottestPlace.caption}</span><br/>
          <h3>Skills</h3>
          Curiosity: <span className="accent">{player.skills.curiosity}</span><br/>
          Sociality: <span className="accent">{player.skills.sociality}</span>
          <h3>System</h3>
          {this.props.stats.fs &&
            <span>Foursquare Clients: <span className="accent">{this.props.stats.fs.clients}</span></span>
          }

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
