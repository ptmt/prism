var React = require('react');
var mui = require('material-ui');

var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var Paper = mui.Paper;
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var Icon = mui.Icon;
var FlatButton = mui.FlatButton;
var Providers = require('./Providers');

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
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <Providers/>
        </ToolbarGroup>

        <ToolbarGroup key={1} float="right">
          <span></span>
          <span className="mui-toolbar-separator">&nbsp;</span>
          <FlatButton label="Full info" primary={true} onClick={this._handleTouchTap} />
        </ToolbarGroup>
      </Toolbar>
    );
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

});

module.exports = TopToolbar;
