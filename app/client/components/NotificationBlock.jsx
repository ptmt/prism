/* @flow */
var React = require('react');
var mui = require('material-ui');

var NotificationBlock = React.createClass({
  render: function(): any {
    var icon = 'icon ion-social-foursquare-outline'
    var time = new Date(this.props.point.timestamp*1000);

    return (
      <div className="notification-block">
        <div className="box">
          {this.props.photo &&
            <div className="value"><img width="300px" src={this.props.point.photo} /></div>
          }
          <div className="label">{time.toTimeString()} - {this.props.point.caption}
          {this.props.likes &&
            <span>(likes: {this.props.likes})</span>
          }
          {this.props.comments &&
            <span>(comments: {this.props.comments})</span>
          }
          </div>

        </div>
      </div>
    );
  }
});

module.exports = NotificationBlock;
