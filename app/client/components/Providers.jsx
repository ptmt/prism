/* @flow */
var React = require('react');
var mui = require('material-ui');

var Providers = React.createClass({
  render: function(): any {
    return (
      <span>
        <mui.FontIcon className="ion-social-foursquare" />
        <mui.FontIcon className="ion-social-instagram" />
        <mui.FontIcon className="ion-social-github" />
      </span>
    );
  }
});

module.exports = Providers;
