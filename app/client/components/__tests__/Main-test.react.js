jest.dontMock('../Main.jsx');
jest.dontMock('../../alt.jsx');

describe('App', function() {
  it('after start should show welcome window that', function() {
    var React = require('react/addons');
    var Main = require('../Main.jsx');
    var TestUtils = React.addons.TestUtils;

    // Render a checkbox with label in the document
    var app = TestUtils.renderIntoDocument(
      <Main />
    );

    // Verify that it's Off by default
    var welcome = TestUtils.findRenderedDOMComponentWithClass(app, 'welcome-window');
    expect(welcome.getDOMNode().style).toEqual('Off');

    // // Simulate a click and verify that it is now On
    // var input = TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input');
    // TestUtils.Simulate.change(input);
    // expect(label.getDOMNode().textContent).toEqual('On');
  });
});
