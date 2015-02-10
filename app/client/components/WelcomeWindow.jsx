/* @flow */

var React = require('react');
var config = require('../config');
var xhr = require('../lib/xhr');
var mui = require('material-ui');
var appActions = require('../actions');
var Paper = mui.Paper;

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
    var foursquareButton;

  //  if (!this.state.foursquareConnected) {
      foursquareButton = <a className="btn btn-primary btn-lg" href="/api/v1/foursquare/signin">
      <img width="36px" src="images/foursquare-logomark.png" /> Connect Foursquare
      </a>;
    // }
    // else {
    //   foursquareButton = <a className="btn btn-primary btn-lg" disable href="/api/v1/foursquare/signin">
    //   <img width="36px" src="images/foursquare-logomark.png" /> Connected
    //   </a>;
    // }
    // <div class="signup-form-container"></div>
    return (
      <Paper className="welcome-screen" zDepth={4}>
        <div className="signup-services">
          <h1>PRISM</h1>
          <p>Connected providers:</p>
          <mui.Toggle name="fs" onChange="_connectFoursquare" label="Foursquare" />
          <mui.Toggle name="insta" onChange="_connectFoursquare" label="Instagram" />
          <mui.Toggle name="github" onChange="_connectFoursquare" label="Github" />
          <mui.RaisedButton label="Start" onClick={this._start} />
        </div>
        <div className="footer">
          <p><a href=''>Privacy</a> | <a href=''>Source code</a></p>
        </div>
      </Paper>
    );
  },

  _connectFoursquare: function() {
    console.log('lets connect foursquare');
  },

  _start: function() {
    appActions.start();
  }

});

module.exports = WelcomeWindow;
