/* @flow */
var React = require('react');
var mui = require('material-ui');

var Providers = React.createClass({

  getInitialState() {
    var tokens = window.localStorage['tokens'];
    if (tokens) {
      tokens = JSON.parse(tokens);
    }
    return {
      foursquare: tokens && tokens.foursquare,
      instagram: tokens && tokens.instagram
    }
  },

  render: function(): any {
    return (
      <span>
        {!this.state.foursquare &&
          <mui.IconButton onClick={this.handleAuth.bind(this, 'foursquare')} iconClassName="ion-social-foursquare" tooltip="Foursquare"/>
        }
        {!this.state.instagram &&
          <mui.IconButton onClick={this.handleAuth.bind(this, 'instagram')} iconClassName="ion-social-instagram" tooltip="Instagram"/>
        }
        <mui.IconButton iconClassName="ion-social-github" />
        <mui.IconButton iconClassName="ion-social-twitter" />
      </span>
    );
  },

  handleAuth(provider) {
    // redirect or open the new window?
    window.location.href="/api/v1/auth/" + provider;
  }
});

module.exports = Providers;
