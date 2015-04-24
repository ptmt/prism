/* @flow */
var React = require('react');
var mui = require('material-ui');

/*
  display last N notifications
  with append / prepend animation
  For example, we have a 3 points
  and get the new one
  so we append the point
  and then destroy the first one
*/
var NotificationBlock = React.createClass({
  getInitialState() {
    return {
      points: []
    }
  },
  render: function(): any {

    var notifications = this.state.points.map(point => {
      var icon = 'icon ion-social-foursquare-outline'
      var time = new Date(point.timestamp*1000);
      var hours = time.getHours();
      var minutes = time.getMinutes();
      minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
      return <div className="notification-block">
        <div className="box">
          {point.photo &&
            <div className="value"><img width="200px" src={point.photo} /></div>
          }

          <div className="label">
            <span className="icons">
              <span className= {icon}></span>
              <span className="icon ion-android-favorite"></span>{point.likes}
              <span className="icon ion-chatbubble-working"></span>{point.comments}
            </span>
           {hours}:{minutes} {point.caption}
          </div>


        </div>
      </div>
    })
    return (
      <div className="notifications-right">
          {notifications}
      </div>
    );
  },
  componentWillReceiveProps(nextProps) {

    if (nextProps.points.length > 3) {
      this.setState({
        points: nextProps.points
      });
      setTimeout(()=> {
        this.setState({
          points: nextProps.points.slice(-3)
        });
      }, 300);
    }
   else {
    this.setState({
      points: nextProps.points
    });
   }
 }
});

module.exports = NotificationBlock;
