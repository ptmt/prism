var React = require('react');

var TopToolbar = React.createClass({
  getInitialState: function() {
    return {
      level: 0,
      exp: 0
    };
  },
  render: function() {

    //$('.player-level').html(data.Player.Level);
    //$('.player-exp').html(number_format_default(data.Player.Exp));
    var level = 1;
    var exp = 1000;

    return (

      <nav className="navbar navbar-inverse" role="navigation">

        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">PRISM</a>
        </div>

        <div className="collapse navbar-collapse navbar-ex1-collapse">

          <ul className="nav navbar-nav navbar-right">
            <li>
            <p className="navbar-text">
            <span>Level</span>
            <span className="player-level">{level}</span>/
            <span className="player-exp">{exp} exp</span>
            </p>
            </li>
            <li>
            <button href="#playerinfo" className="navbar-btn btn btn-default" data-toggle="modal">Dossier</button>
            </li>
          </ul>
        </div>

      </nav>
    );
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

});

module.exports = TopToolbar;
