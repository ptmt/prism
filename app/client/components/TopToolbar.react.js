var React = require('react');
var foursquareStore = require('../stores/foursquareStore');
var Reflux = require('reflux');

var TopToolbar = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      player: {
        level: 0,
        exp: 0
      }
    };
  },
  componentDidMount: function() {
    this.listenTo(foursquareStore, this._onChange);
  },
  render: function() {

    //$('.player-level').html(data.Player.Level);
    //$('.player-exp').html(number_format_default(data.Player.Exp));
    // var level = 1;
    // var exp = 1000;

    return (

      <nav className="navbar navbar-inverse" role="navigation">

        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">PRISM</a>
          </div>

          <form className="navbar-form navbar-left" role="search">
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Search" />
            </div>
            <div className="btn-group">
              <button className="btn btn-default">
                <span className="glyphicons glyphicons-fast-backward"></span>
              </button>
              <button className="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tooltip on bottom">
                <span className="glyphicons glyphicons-pause">&#xe178;</span>
              </button>
              <button className="btn btn-default">
                <span className="glyphicons glyphicons-fast-forward"></span>
              </button>

            </div>
          </form>

          <div className="collapse navbar-collapse navbar-ex1-collapse">

            <ul className="nav navbar-nav navbar-right">
              <li>
              <p className="navbar-text">
              <span>Level</span>
              <span className="player-level">{this.state.player.level}</span>/
              <span className="player-exp">{this.state.player.exp} exp</span>
              </p>
              </li>
              <li>
              <button href="#playerinfo" className="navbar-btn btn btn-default" data-toggle="modal">Dossier</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  },

  /**
  * Event handler for 'change' events coming from the stores
  */
  _onChange: function() {
    this.setState(foursquareStore.iterationStep);
  },

  _onDropDownMenuChange: function(e, key, menuItem) {
    console.log('Menu Clicked: ', menuItem);
  },

});

module.exports = TopToolbar;
