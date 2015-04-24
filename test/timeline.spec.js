/* global describe, before, it */
'use strict';

var chai = require('chai');
var assert = chai.assert;
var MainController = require('../app/server.compiled/controllers/main');
var _ = require('lodash');

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

  it('first iteration stats should be almost empty', function () {
    var firstIteration = fetchedTimeline.iterations[fetchedTimeline.timestamps[0]];
    //console.log(firstIteration);
    assert.equal(firstIteration.currentPoint.caption, 'Академия Вкуса');
    assert.equal(firstIteration.currentPoint.source, 'Foursquare');
    assert.equal(firstIteration.player.exp, 70);
    assert.equal(firstIteration.player.level, 3, 'level');
    assert.equal(JSON.stringify(firstIteration.player.skills), '{"sociality":10,"curiosity":60}');
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
    assert.equal(firstIteration.player.exp, 140);
    assert.equal(firstIteration.player.level, 3, 'level');
    assert.equal(firstIteration.player.skills.sociality, 20, 'skills - sociality');
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
    assert.equal(lastIteration.player.exp, 31340);
    assert.equal(lastIteration.player.level, 9, 'level');
    assert.equal(lastIteration.player.skills.sociality, 2500, 'skills - sociality');
    assert.equal(lastIteration.player.skills.curiosity, 28840, 'skills - curiosity');
    assert.equal(lastIteration.stats.totalDistance, 34368, 'totalDistance');
    assert.equal(lastIteration.stats.avgDistancePerCheckin, 138, 'avgDistancePerCheckin');
    assert.equal(lastIteration.stats.topSpeed, 462, 'topSpeed');
    assert.equal(lastIteration.stats.avgSpeed, 8, 'avgSpeed');
    assert.equal(lastIteration.stats.lastDistance, 3642);
    assert.equal(lastIteration.stats.mostLikedCheckin.caption, 'Международный аэропорт Домодедово / Domodedovo International Airport (DME)');
  });

  it('should be calculate client usage', function() {
    var iteration = fetchedTimeline.iterations[fetchedTimeline.timestamps[fetchedTimeline.timestamps.length - 1]];

    assert.equal(iteration.stats.fs.clients, '4th & Mayor(192), Foursquare for WP7(50), foursquare for Android(8)');


  })
});
