var React = require('react');
var mui = require('material-ui');

var PlaybackControls = React.createClass({

  render: function() {

    var progress = {"width": "45%"};

    return (
      <div className="mui-drop-down-menu playback-controls">
        <mui.IconButton tooltip="Prev Point">
          <mui.FontIcon className="ion-ios-fastforward"/>
        </mui.IconButton>
        <mui.IconButton tooltip="Sort">
          <mui.FontIcon className="ion-play"/>
        </mui.IconButton>
        <mui.IconButton tooltip="Next Point">
          <mui.FontIcon className="ion-ios-fastforward"/>
        </mui.IconButton>

        <mui.Slider name="slider1" />
      </div>
    );
  },

});

module.exports = PlaybackControls;
