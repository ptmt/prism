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
      timestamp: Date.now,
      iterationsTotal: 1,
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
    var progress = this.state.i / this.state.iterationsTotal;
    console.log(progress, this.state.i,  this.state.iterationsTotal);
    return (
      <div>
        <Map />
        <TopToolbar date={this.state.timestamp} progress={progress} />
        <StatPanel player = {this.state.iteration.player}/>
        <WelcomeWindow />
        <mui.Snackbar message="Loading .."/>
      </div>);
  },

  onChange(data) {
    this.renderStep(data);
  },

  renderStep(data) {
    // TODO: move all this login into store

    // 1. get the current iteration
    var timestamp = data.timeline.timestamps[this.state.i]
    var iteration = data.timeline.iterations[timestamp];

    console.log(timestamp, iteration);

    if (!timestamp || !iteration) {
      return;
    }

    // 2. render
    this.setState({
      iteration: iteration,
      timestamp: timestamp,
      i: this.state.i + 1,
      iterationsTotal: Object.keys(data.timeline.iterations).length
    });

    // 3. render point on the map

    // 5. setTimeout for next step
    this.timeout = setTimeout(() => this.renderStep(data), 500);
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
