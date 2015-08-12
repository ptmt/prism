// __tests__/CheckboxWithLabel-test.js

jest.dontMock('../WelcomeWindow.jsx');
jest.dontMock('../../alt.jsx');

describe('WelcomeWindow', function() {
  it('changes the text after click', function() {
    var React = require('react/addons');
    var WelcomeWindow = require('../WelcomeWindow.jsx');
    var TestUtils = React.addons.TestUtils;

    // Render a checkbox with label in the document
    var welcome = TestUtils.renderIntoDocument(
      <WelcomeWindow/>
    );

    //var welcome = TestUtils.findRenderedDOMComponentWithClass(welcome, 'welcome-window');

    expect(welcome.getDOMNode()).toBeDefined();

  });
});
