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
      timestamp: null,
      iterationsTotal: 1,
      points: [],
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
        <Map points={this.state.points} />
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
    console.log(this.state.i);

    // 1. get the current iteration
    var timestamp = this.state.source.timeline.timestamps[this.state.i]
    var iteration = this.state.source.timeline.iterations[timestamp];

    //console.log(timestamp, iteration);

    if (!timestamp || !iteration) {
      return;
    }

    // collect points and paths
    // TODO: trade for memory?
    var points = [];
    for (var j = 0; j < this.state.i; j++) {
      var p = this.state.source.timeline.iterations[this.state.source.timeline.timestamps[j]].currentPoint;
      points.push(p);
    }

    // 2. render
    this.setState({
      iteration: iteration,
      timestamp: timestamp,
      i: this.state.i + 1,
      iterationsTotal: Object.keys(this.state.source.timeline.iterations).length,
      points: points
    });

    // 3. setTimeout for next step
    this.timeout = setTimeout(() => this.renderStep(), this.state.i > 1 ? 1000 : 50);
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
      });
      if (!this.state.playing) {
        this.renderStep(true);  // just render, but stay in pause
      }
    }
    if (e.action === 'rewind') {
      this.setState({
        i: this.state.i > 5 ? this.state.i - 5 : 0
      })
      if (!this.state.playing) {
        this.renderStep(true); // just render, but stay in pause
      }
    }
    if (e.action === 'setStep') {
      this.setState({
        i: Math.round(e.value * this.state.iterationsTotal)
      })
      if (!this.state.playing) {
        this.renderStep(true); // just render, but stay in pause
      }
    }
  }

});

module.exports = Main;
