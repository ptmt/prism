/* global describe, before, it */
'use strict';

var chai = require('chai');
var assert = chai.assert;
var MainController = require('../app/server.compiled/controllers/main');

describe('Test levels', function () {

  var fetchedTimeline;

  before(function (done) {
    MainController.getTimeline({}, null, function (err, res) {
      fetchedTimeline = res;
      done();
    })
  });

  it('should result a valid structure', function () {
    assert.notEqual(fetchedTimeline, undefined);
    assert.notEqual(fetchedTimeline.iterations, undefined);
    assert.notEqual(fetchedTimeline.timestamps, undefined);
    assert.notEqual(fetchedTimeline.providers, undefined);
  });

  it('first iteration stats should be almost empty, except the point', function () {
    var firstIteration = fetchedTimeline.iterations[fetchedTimeline.timestamps[0]];
    //console.log(firstIteration);
    assert.equal(firstIteration.currentPoint.caption, 'Академия Вкуса');
    assert.equal(firstIteration.currentPoint.source, 'Foursquare');
    assert.equal(firstIteration.player.exp, 10);
    assert.equal(firstIteration.player.level, 1);
    assert.equal(firstIteration.player.skills.length, 0);
    assert.equal(firstIteration.stats.totalDistance, 0);
    assert.equal(firstIteration.stats.avgDistancePerCheckin, 0);
    assert.equal(firstIteration.stats.topSpeed, 0);
    assert.equal(firstIteration.stats.lastDistance, 0);

  });

  it('second iteration stats should add more stats', function () {
    var firstIteration = fetchedTimeline.iterations[fetchedTimeline.timestamps[1]];
    //console.log(firstIteration);
    assert.equal(firstIteration.currentPoint.caption, 'ТОЦ «Версаль»');
    assert.equal(firstIteration.currentPoint.source, 'Foursquare');
    assert.equal(firstIteration.player.exp, 20);
    assert.equal(firstIteration.player.level, 2, 'level');
    assert.equal(firstIteration.player.skills.length, 0, 'skills');
    assert.equal(firstIteration.stats.totalDistance, 18, 'totalDistance');
    assert.equal(firstIteration.stats.avgDistancePerCheckin, 18);
    assert.equal(firstIteration.stats.avgSpeed, 1, 'avgSpeed');
    assert.equal(firstIteration.stats.topSpeed, 1);
    assert.equal(firstIteration.stats.avgInterval, 20);
    assert.equal(firstIteration.stats.lastDistance, 18);

  });

  it('last iteration stats should give valid total stats', function () {
    var lastIteration = fetchedTimeline.iterations[fetchedTimeline.timestamps[fetchedTimeline.timestamps.length - 1]];
    console.log(lastIteration);
    assert.equal(lastIteration.player.exp, 14650);
    assert.equal(lastIteration.player.level, 8, 'level');
    assert.equal(lastIteration.player.skills.length, 0, 'skills');
    assert.equal(lastIteration.stats.totalDistance, 34368, 'totalDistance');
    assert.equal(lastIteration.stats.avgDistancePerCheckin, 138, 'avgDistancePerCheckin');
    assert.equal(lastIteration.stats.topSpeed, 462, 'topSpeed');
    assert.equal(lastIteration.stats.avgSpeed, 8, 'avgSpeed');
    assert.equal(lastIteration.stats.lastDistance, 3642);

  });
});
