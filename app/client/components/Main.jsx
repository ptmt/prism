/* @flow */

var React = require('react');
var Reflux = require('reflux');
var config = require('../config');
var mapsLib = require('../map');
var Map = require('./Map');
var TopToolbar = require('./TopToolbar');
var WelcomeWindow = require('./WelcomeWindow');
var mui = require('material-ui');
var Snackbar = mui.Snackbar;
var TimelineStore = require('../stores/TimelineStore.jsx');
var ProvidersStore = require('../stores/ProvidersStore.jsx');

var Main = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      providers: {}
    };
  },

  componentDidMount: function() {
    this.listenTo(TimelineStore, this._onIteration);
    this.listenTo(ProvidersStore, this._onStartup);
  },

  render(): any {
    return (
      <div>
        <Map providers = {this.state.providers} />
        <TopToolbar iteration = {this.state.iteration}/>
        <WelcomeWindow />
        <Snackbar message="Loading .."/>
      </div>);
  },

  /**
  * Event handler for 'change' events coming from the stores
  */
  _onIteration: function(data) {
    console.log(data);
  },

  _onStartup: function(data) {
    console.log('starting up..', data);
    this.setState({providers: data});
  },

});

module.exports = Main;
