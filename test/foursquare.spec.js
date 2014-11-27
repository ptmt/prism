/* global describe, before, it */
'use strict';

var assert = require('assert');
var FoursquareService = require('../app/server.compiled/foursquare/service');

describe('Foursquare Client', function () {

  var foursquareService;

  before(function () {
    foursquareService = new FoursquareService(null, {
      debug: true
    });
  });

  it('able to get checkins', function () {
    var checkinsData = foursquareService.getCheckins(0, 250);
    assert.equal(checkinsData.checkins.items.length > 0, true);
  });
});
