/* global describe, before, it */
'use strict';

var assert = require('assert');
var FoursquareService = require('../app/server.compiled/providers/foursquare/service');

describe('Foursquare Client', function () {

  var foursquareService;

  before(function () {
    foursquareService = new FoursquareService({
      demo: true
    });
  });

  it('able to get first 250 checkins', function (done) {
    foursquareService.getCheckins(0, 250, function(err, checkinsData) {
      assert.equal(err, null);
      assert.equal(checkinsData.checkins.items.length === 250, true);
      done();
    });
  });
});
