var alt = require('../alt')

class PlaybackActions {
  constructor() {
    this.generateActions(
      'init',
      'welcome',
      'error',
      'fetchTimelineCompleted',
      'start',
      'pause'
    )
  }
}
console.log(JSON.stringify(alt));
module.exports = alt.createActions(PlaybackActions)
