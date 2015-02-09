var React = require('react');
var mui = require('material-ui');

var Reflux = require('reflux');
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var Paper = mui.Paper;
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var Icon = mui.Icon;
var FlatButton = mui.FlatButton;

var TopToolbar = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      player: {
        level: 0,
        exp: 0
      }
    };
  },
  componentDidMount: function() {
    this.listenTo(TimelineStore, this._onChange);
  },

  //   <div class="toolbar-container"></div>
  render: function() {

    var progress = {"width": "45%"};

    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
        <FlatButton label="flow check" primary={true} onClick={this._handleTouchTap} />
        </ToolbarGroup>

        <ToolbarGroup key={1} float="right">
          <a href="http://flowtype.org/docs/getting-started.html"><Icon icon="social-school" /></a>
          <a href="https://github.com/unknownexception/tryflow"><Icon icon="mui-icon-github" /></a>

          <span className="mui-toolbar-separator">&nbsp;</span>
          <FlatButton label="flow check" primary={true} onClick={this._handleTouchTap} />
        </ToolbarGroup>
      </Toolbar>
    );
  },

  /**
  * Event handler for 'change' events coming from the stores
  */
  _onChange: function() {
    this.setState(foursquareStore.iterationStep);
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

});

module.exports = TopToolbar;
