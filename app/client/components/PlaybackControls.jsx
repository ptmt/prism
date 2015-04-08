var React = require('react');
var mui = require('material-ui');

var PlaybackControls = React.createClass({

  render() {

    var progress = this.props.progress;
    var play = this.props.isPlaying ? 'ion-pause' : 'ion-play';
    var playTip = this.props.isPlaying ? 'Pause' : 'Play';

    return (
      <div className="mui-drop-down-menu playback-controls">
        <mui.IconButton tooltip="Prev Point" onClick={this.onRewind}>
          <mui.FontIcon className="ion-ios-rewind"/>
        </mui.IconButton>
        <mui.IconButton tooltip={playTip} onClick={this.onPlayPauseHandler}>
          <mui.FontIcon className={play}/>
        </mui.IconButton>
        <mui.IconButton tooltip="Next Point" onClick={this.onFastForward}>
          <mui.FontIcon className="ion-ios-fastforward"/>
        </mui.IconButton>

        <mui.Slider ref="slider" name="timelineSlider" value={progress} onDragStop={this.onSliderChange} />
      </div>
    );
  },
  onPlayPauseHandler() {
    if (this.props.onChange) {
      this.props.onChange({
        action: this.props.isPlaying? 'pause' : 'play'
      });
    }
  },
  onRewind() {
    if (this.props.onChange) {
      this.props.onChange({
        action: 'rewind'
      });
    }
  },
  onFastForward() {
    if (this.props.onChange) {
      this.props.onChange({
        action: 'fastforward'
      });
    }
  },
  onSliderChange() {
    if (this.props.onChange) {
      this.props.onChange({
        action: 'setStep',
        value: this.refs.slider.getValue()
      });
    }
  }
});

module.exports = PlaybackControls;
