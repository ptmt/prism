/* @flow */

var cache = {};

module.exports.iterate = function(req     , content     , callback            )         {
  if (!cache) {
    if (req.queryParams.debug) {
      initCache();
    } else {
      return utils.json({
        error: 'Session is expired'
      });
    }
  }
  var currentCheckin = app.cache.checkinsData.checkins.items[app.cache.live
  .i];

  fc.calculationFunctions.forEach(function(calcFunc) {
    calcFunc(currentCheckin, app.cache.live, app.cache.player); //currentCheckin, stats, socialPlayer
  });

  if (app.cache.checkinsData.checkins.items.length > app.cache.live.i) {
    app.cache.live.i++;
  } else {
    return utils.json({
      final: 'final'
    })
  }

  return utils.json({
    live: app.cache.live,
    currentCheckin: currentCheckin,
    player: app.cache.player
  });

  return 'ok';
}
