/* @flow */
var React = require('react');

var LeftPanel = React.createClass({

  // <div class="leftpanel-container"></div>
  render: function(): any {
    return (
      <div className="panel panel-default">
        <ul className="nav nav-tabs">
          <li className="active"><a href="#home" data-toggle="tab">Top Checkins</a></li>
          <li><a href="#profile" data-toggle="tab">Profile</a></li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <div className="tab-pane fade active in" id="home">
            <p>Most awesome: tratat</p>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = LeftPanel;
