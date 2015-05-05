/* global describe, before, it */
'use strict';

var assert = require('assert');
var InstagramClient = require('../app/server.compiled/providers/instagram/client');

describe('Instagram Client', function () {

  var instagramClient;

  before(function () {
    instagramClient = new InstagramClient();
  });

  it('able to get first 250 checkins', function (done) {
    instagramClient.getCheckins(0, 250, function(err, checkinsData) {
      assert.equal(err, null);
      assert.equal(checkinsData.checkins.items.length === 250, true);
      done();
    });
  });
});
