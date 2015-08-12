/* global describe, before, it */
'use strict';

var assert = require('assert');
var FoursquareClient = require('../app/server.compiled/providers/foursquare/client');

describe('Foursquare Client', function () {

  var foursquareClient;

  before(function () {
    foursquareClient = new FoursquareClient();
  });

  it('able to get first 250 checkins', function (done) {
    foursquareClient.getCheckins(0, 250, function(err, checkinsData) {
      assert.equal(err, null);
      assert.equal(checkinsData.checkins.items.length === 250, true);
      done();
    });
  });
});
