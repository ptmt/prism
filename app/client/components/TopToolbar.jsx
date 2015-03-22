var React = require('react');
var mui = require('material-ui');
var Providers = require('./Providers');
var PlaybackControls = require('./PlaybackControls');

var TopToolbar = React.createClass({

  // getInitialState: function() {
  //   return {
  //     player: {
  //       level: 0,
  //       exp: 0
  //     }
  //   };
  // },

  // <div>
  //   <mui.Slider name="slider1" />
  // </div>

  render: function() {

    var progress = {"width": "45%"};

    return (
      <mui.Toolbar>
        <mui.ToolbarGroup key={0} float="left">
          <Providers/>
          <span className="mui-toolbar-separator">&nbsp;</span>
        </mui.ToolbarGroup>
        <PlaybackControls/>
        <mui.ToolbarGroup key={1} float="right">
          <span>Current Date:</span>
          <span className="mui-toolbar-separator">&nbsp;</span>
          <mui.FlatButton label="Full info" primary={true} onClick={this._handleTouchTap} />
        </mui.ToolbarGroup>
      </mui.Toolbar>
    );
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

});

module.exports = TopToolbar;
