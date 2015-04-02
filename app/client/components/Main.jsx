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
      playing: false,
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
    //console.log(progress, this.state.i,  this.state.iterationsTotal);
    return (
      <div>
        <Map />
        <TopToolbar
          date={this.state.timestamp}
          progress={progress}
          isPlaying={this.state.playing}
          onPlaybackChange={this.onPlaybackChange}/>
        <StatPanel player = {this.state.iteration.player}/>
        <WelcomeWindow />
        <mui.Snackbar message="Loading .."/>
      </div>);
  },

  onChange(data) {
    this.setState({
      source: data,
      playing: true
    })
    this.renderStep();
  },

  renderStep(force) {
    // TODO: move all this login into store

    // 0. check if we're not in the pause
    if (this.state.playing === false && !force) {
      return;
    }
    // 1. get the current iteration
    var timestamp = this.state.source.timeline.timestamps[this.state.i]
    var iteration = this.state.source.timeline.iterations[timestamp];

    console.log(timestamp, iteration);

    if (!timestamp || !iteration) {
      return;
    }

    // 2. render
    this.setState({
      iteration: iteration,
      timestamp: timestamp,
      playing: true,
      i: this.state.i + 1,
      iterationsTotal: Object.keys(this.state.source.timeline.iterations).length
    });

    // 3. render point on the map

    // 5. setTimeout for next step
    this.timeout = setTimeout(() => this.renderStep(), 500);
  },

  onPlaybackChange(e) {
    if (e.action === 'pause') {
      this.setState({
        playing: false
      })
    }
    if (e.action === 'play') {
      this.setState({
        playing: true
      });
      this.renderStep(true);
    }
    if (e.action === 'fastforward') {
      this.setState({
        i: this.state.i + 5
      })
    }
    if (e.action === 'rewind') {
      this.setState({
        i: this.state.i - 5
      })
    }
  }

});

module.exports = Main;
