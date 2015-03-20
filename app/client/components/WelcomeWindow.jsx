/* @flow */

var React = require('react/addons');
var mui = require('material-ui');
var Providers = require('./Providers');
var providersStore = require('../stores/ProvidersStore');

var WelcomeWindow = React.createClass({

  componentDidMount() {
    providersStore.listen(this.onChange);
  },

  componentWillUnmount() {
    providersStore.unlisten(this.onChange)
  },

  render: function(): any {
    return (
      <mui.Dialog ref="dialog" title="Select a social network to start" className="welcome-window">
        <div className="signup-services">
          <Providers/>
        </div>
        <div className="footer">
          <a href="https://github.com/unknownexception/prism">README.MD</a>
        </div>
      </mui.Dialog>
    )
  },

  onChange: function() {
    console.log('onChange');
    if (!providersStore.getState().isDemo) {
      this.refs.dialog.show();
    }
  }

});

module.exports = WelcomeWindow;
