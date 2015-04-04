/* @flow */
var React = require('react');
var mui = require('material-ui');

var NotificationBlock = React.createClass({
  render: function(): any {
    var style = {
      display: this.props.isVisible ? 'block': 'none'
    }
    var icon = 'icon ion-social-foursquare-outline'

    return (
      <div style={style} className="notification-block">
        <div className="box">
          <div className="value"><img width="300px" src="https://irs1.4sqi.net/img/general/680x680/17907214_ElNkxKh7wz3a1rGzbTa--Nhv0tMJgqcwznnKyBF70Jc" /></div>
          <div className="label">Level</div>
        </div>
      </div>
    );
  }
});

module.exports = NotificationBlock;
