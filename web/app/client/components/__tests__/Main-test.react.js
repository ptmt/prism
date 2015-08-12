jest.dontMock('../Main.jsx');
jest.dontMock('../WelcomeWindow.jsx');
jest.dontMock('../Providers.jsx');
jest.dontMock('../../alt.jsx');
jest.dontMock('../../stores/ProvidersStore.jsx');

describe('App', function() {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var container = document.createElement("div");
  var Main = require('../Main.jsx');
  var actions = require('../../actions');
  var Request = require('../../lib/request.jsx');

  it('after start should show welcome window', function() {
    var app = TestUtils.renderIntoDocument(
      <Main />
    );
    actions.init();

    var welcome = TestUtils.findRenderedDOMComponentWithClass(app, 'welcome-window');
    expect(welcome.props.className.indexOf('mui-is-shown') > -1).toEqual(true);

    // Simulate a click and verify that it is now On
    var icon1 = TestUtils.findRenderedDOMComponentWithClass(app, 'ion-social-foursquare');
    TestUtils.Simulate.click(icon1);
    // expect(label.getDOMNode().textContent).toEqual('On');
  });

  it('after start should show welcome window that', function() {
    var app = TestUtils.renderIntoDocument(
      <Main />
    );
    window.location.href = '?demo=1';
    console.log(Request);
    actions.init();

    var welcome = TestUtils.findRenderedDOMComponentWithClass(app, 'welcome-window');
    expect(welcome.props.className.indexOf('mui-is-shown') > -1).toEqual(false);
  });
});
