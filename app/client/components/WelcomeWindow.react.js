/* @flow */
var React = require('react');

var WelcomeWindow = React.createClass({

  render: function(): any {
    return (
      <div className="signup-form">
        <div className="signup-services">
          <h1>Foursquare, we love you</h1>
          <p>Search checkins making you better</p>
          <a className="btn btn-primary btn-lg" href="/api/v1/foursquare/signin"><img width="36px" src="images/foursquare-logomark.png" /> Sign in With Foursquare</a>
          <a href=''>Privacy</a> | <a href=''>Source code</a>
        </div>
      </div>
    );
  },

});

module.exports = WelcomeWindow;
