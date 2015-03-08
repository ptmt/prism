/* @flow */

var React = require('react');
var config = require('../config');
var xhr = require('../lib/xhr');
var mui = require('material-ui');
var appActions = require('../actions');
var Providers = require('./Providers');

var WelcomeWindow = React.createClass({

  // getInitialState: function() {
  //   return {
  //     foursquareConnected: false
  //   };
  // },
  //
  // componentDidMount: function() {
  //   xhr.getJson(config.apiEndpoint + '/connected', (error, result) => {
  //     if (!error && this.isMounted()) {
  //       this.setState({
  //         foursquareConnected: true
  //       });
  //     }
  //   });
  // },

  render: function(): any {
    return (
      <mui.Dialog title="To get started choose any social network" className="welcome-window">
        <div className="signup-services">
          <Providers/>
        </div>
        <div className="footer">
          <a href="https://github.com/unknownexception/prism">README.MD</a>
        </div>
      </mui.Dialog>
    )
  },

  _connectFoursquare: function() {
    console.log('lets connect foursquare');
  },

  _start: function() {
    appActions.start();
  }

});

module.exports = WelcomeWindow;
