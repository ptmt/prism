/* @flow */
/* global document, window */
'use strict';

// /** @jsx React.DOM */
//
// var React = window.React = require('react'),
//     Timer = require("./ui/Timer"),
//     mountNode = document.getElementById("app");
//
// var TodoList = React.createClass({
//   render: function() {
//     var createItem = function(itemText) {
//       return <li>{itemText}</li>;
//     };
//     return <ul>{this.props.items.map(createItem)}</ul>;
//   }
// });
// var TodoApp = React.createClass({
//   getInitialState: function() {
//     return {items: [], text: ''};
//   },
//   onChange: function(e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var nextItems = this.state.items.concat([this.state.text]);
//     var nextText = '';
//     this.setState({items: nextItems, text: nextText});
//   },
//   render: function() {
//     return (
//       <div>
//         <h3>TODO</h3>
//         <TodoList items={this.state.items} />
//         <form onSubmit={this.handleSubmit}>
//           <input onChange={this.onChange} value={this.state.text} />
//           <button>{'Add #' + (this.state.items.length + 1)}</button>
//         </form>
//         <Timer />
//       </div>
//     );
//   }
// });
//
//
// React.renderComponent(<TodoApp />, mountNode);
//
var map = require('./map'),
  foursquare = require('./FoursquareClient');

document.addEventListener('DOMContentLoaded', function() {
  var m = map.init(),
    l = map.initMaskedLayer(),
    isAuth = window.localStorage.getItem('auth') === 'true',
    isDebug = window.localStorage.getItem('debug') === 'true' 
      && document.location.href.indexOf('logout') === -1;

  l.setData([]);
  m.addLayer(l);
  if (document.location.href.indexOf('start') > -1) {
    window.localStorage.setItem('auth', true);
  }

  if (isAuth || isDebug) {
    foursquare.start(m, l);
  } else {
    document.querySelectorAll('.signup-form')[0].style.display = 'block';
  }
});
