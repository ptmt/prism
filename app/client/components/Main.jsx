/* @flow */

var React = require('react');
var mui = require('material-ui');
var config = require('../config');
var Map = require('./Map');
var TopToolbar = require('./TopToolbar');
var WelcomeWindow = require('./WelcomeWindow');
var StatPanel = require('./StatPanel');
//var providersStore = require('../stores/ProvidersStore');
var timelineStore = require('../stores/timelineStore');

var Main = React.createClass({

  getInitialState() {
    return {
      providers: {},
      i: 0,
      iteration: {
        stats: {

        },
        player: {
          level: 0,
          exp: 0
        }
      }
    };
  },

  componentDidMount() {
    timelineStore.listen(this.onChange);
  },

  componentWillUnmount() {
    timelineStore.unlisten(this.onChange)
  },

  render(): any {
    return (
      <div>
        <Map />
        <TopToolbar />
        <StatPanel player = {this.state.iteration.player}/>
        <WelcomeWindow />
        <mui.Snackbar message="Loading .."/>
      </div>);
  },

  onChange(data) {
    // TODO: move all this login into store

    // 1. get the current iteration
    var timestamp = data.timeline.timestamps[this.state.i]
    var iteration = data.timeline.iterations[timestamp];

    console.log(timestamp, iteration);

    // 2. render
    this.setState({iteration: iteration});
  }

  /**
  * Event handler for 'change' events coming from the stores
  */
  // _onIteration: function(data) {
  //   console.log(data);
  // },
  //
  // _onStartup: function(data) {
  //   console.log('starting up..', data);
  //   this.setState({providers: data});
  // },

});

module.exports = Main;
