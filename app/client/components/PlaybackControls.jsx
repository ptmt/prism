var React = require('react');
var mui = require('material-ui');

var PlaybackControls = React.createClass({

  render: function() {

    var progress = this.props.progress;

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

        <mui.Slider name="timelineSlider" value={progress} />
      </div>
    );
  },

});

module.exports = PlaybackControls;
