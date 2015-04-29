/* @flow */
var React = require('react/addons');
var mui = require('material-ui');

var Providers = React.createClass({
  render: function(): any {
    return (
      <span>
        <mui.IconButton onClick={this.handleFoursquare} iconClassName="ion-social-foursquare" tooltip="Foursquare"/>
        <mui.IconButton iconClassName="ion-social-instagram" />
        <mui.IconButton iconClassName="ion-social-github" />
      </span>
    );
  },

  handleFoursquare() {
    // redirect or open the new window?
    window.location.href="/api/v1/auth/foursquare";
  }
});

module.exports = Providers;
