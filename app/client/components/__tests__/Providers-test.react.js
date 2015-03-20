jest.dontMock('../Providers.jsx');
jest.dontMock('../../alt.jsx');

describe('Providers component', function() {

  it('shoud return all visible providers at start', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var Providers = require('../Providers.jsx');
    var actions = require('../../actions');

    var providers = TestUtils.renderIntoDocument(
      <Providers />
    );

    var foursquare = TestUtils.findRenderedDOMComponentWithClass(providers, 'ion-social-foursquare');
    var instagram = TestUtils.findRenderedDOMComponentWithClass(providers, 'ion-social-instagram');
    var github = TestUtils.findRenderedDOMComponentWithClass(providers, 'ion-social-github');

    expect(foursquare).toBeDefined();
    expect(instagram).toBeDefined();
    expect(github).toBeDefined();

  });

  // add different states
});
