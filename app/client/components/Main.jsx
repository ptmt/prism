/* @flow */

var React = require('react');
var mui = require('material-ui');
var config = require('../config');
var Map = require('./Map');
var TopToolbar = require('./TopToolbar');
var WelcomeWindow = require('./WelcomeWindow');

var Main = React.createClass({

  getInitialState() {
    return {
      providers: {}
    };
  },

  componentDidMount() {
    // this.listenTo(TimelineStore, this._onIteration);
    // this.listenTo(ProvidersStore, this._onStartup);
  },

  render(): any {
    return (
      <div>
        <Map providers = {this.state.providers} />
        <TopToolbar iteration = {this.state.iteration}/>
        <WelcomeWindow />
        <mui.Snackbar message="Loading .."/>
      </div>);
  },

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
