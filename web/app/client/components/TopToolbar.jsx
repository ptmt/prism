var React = require('react');
var mui = require('material-ui');
var Providers = require('./Providers');
var PlaybackControls = require('./PlaybackControls');

var TopToolbar = React.createClass({

  render: function() {

    var currentDate = this.props.date ? this.formatDate(new Date(this.props.date*1000)) : this.formatDate(new Date());
    var progress = this.props.currentI / this.props.totalI;
    return (
      <mui.Toolbar>
        <mui.ToolbarGroup key={0} float="left">
          <Providers/>
          <span className="mui-toolbar-separator">&nbsp;</span>
        </mui.ToolbarGroup>
        <PlaybackControls progress={progress} isPlaying={this.props.isPlaying} onChange={this.props.onPlaybackChange}/>
        <mui.ToolbarGroup key={1} float="right">
          <span className="mui-toolbar-separator">&nbsp;</span>
          <span className="mui-drop-down-menu toolbar-text">{this.props.currentI}/{this.props.totalI}</span>
          <span className="mui-drop-down-menu toolbar-text">{currentDate}</span>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    );
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
    //<mui.RaisedButton label={currentDate} primary={true} onClick={this._handleTouchTap} />
  },

  formatDate(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return (monthNames[date.getMonth()]) + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

});

module.exports = TopToolbar;
