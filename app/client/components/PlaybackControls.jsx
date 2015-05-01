var React = require('react');
var mui = require('material-ui');
var keymaster = require('keymaster');

var PlaybackControls = React.createClass({

  render() {

    var progress = this.props.progress;
    var play = this.props.isPlaying ? 'ion-pause' : 'ion-play';
    var playTip = this.props.isPlaying ? 'Pause' : 'Play';

    return (
      <div className="mui-drop-down-menu playback-controls">
        <mui.IconButton onClick={this.onRewind}>
          <mui.FontIcon className="ion-ios-rewind"/>
        </mui.IconButton>
        <mui.IconButton onClick={this.onPlayPauseHandler}>
          <mui.FontIcon className={play}/>
        </mui.IconButton>
        <mui.IconButton onClick={this.onFastForward}>
          <mui.FontIcon className="ion-ios-fastforward"/>
        </mui.IconButton>

        <mui.Slider ref="slider" name="timelineSlider"
          value={progress}
          onDragStart={this.onDragSart}
          onDragStop={this.onSliderChange} />
      </div>
    );
  },

  componentDidMount: function() {
    keymaster('space', this.onPlayPauseHandler)
  },

  componentWillUnmount: function() {
    keymaster.unbind('space', this.onPlayPauseHandler)
  },

  onDragSart() {
    if (this.props.onChange) {
      this.props.onChange({
        action: 'pause'
      });
    }
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
      this.props.onChange({
        action: 'play'
      });
    }
  }
});

module.exports = PlaybackControls;
