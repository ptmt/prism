/* @flow */

var React = require('react');
var config = require('../config');
var xhr = require('../lib/xhr');

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

    return (
      <div className="signup-form">
        <div className="signup-services">
          <h1>PRISM</h1>
          <p>Find out that makes you better</p>
          <p>{foursquareButton}</p>
          <p><a href=''>Privacy</a> | <a href=''>Source code</a></p>
        </div>
      </div>
    );
  },

});

module.exports = WelcomeWindow;
