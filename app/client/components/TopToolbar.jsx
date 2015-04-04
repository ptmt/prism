var React = require('react');
var mui = require('material-ui');
var Providers = require('./Providers');
var PlaybackControls = require('./PlaybackControls');

var TopToolbar = React.createClass({

  render: function() {

    var currentDate = this.props.date ? this.formatDate(new Date(this.props.date*1000)) : this.formatDate(new Date());

    return (
      <mui.Toolbar>
        <mui.ToolbarGroup key={0} float="left">
          <Providers/>
          <span className="mui-toolbar-separator">&nbsp;</span>
        </mui.ToolbarGroup>
        <PlaybackControls progress={this.props.progress} isPlaying={this.props.isPlaying} onChange={this.props.onPlaybackChange}/>
        <mui.ToolbarGroup key={1} float="right">
          <span className="mui-toolbar-separator">&nbsp;</span>
          <mui.RaisedButton label={currentDate} primary={true} onClick={this._handleTouchTap} />
        </mui.ToolbarGroup>
      </mui.Toolbar>
    );
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

  formatDate(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return (monthNames[date.getMonth()]) + ' ' + date.getDate() + ' ' + date.getFullYear();
  }

});

module.exports = TopToolbar;
