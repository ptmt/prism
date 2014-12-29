/* @flow */
var React = require('react');

var WelcomeWindow = React.createClass({

  render: function(): any {
    return (
      <div className="signup-form">
        <div className="signup-services">
          <h1>Foursquare, we loved you</h1>
          <p>All personal information is stored in memory only.</p>
          <a className="btn btn-primary btn-lg" href="/api/signin/foursquare"><img width="36px" src="images/foursquare-logomark.png" /> Sign in With Foursquare</a>
        </div>
      </div>
    );
  },

});

module.exports = WelcomeWindow;
