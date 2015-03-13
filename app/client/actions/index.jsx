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

module.exports = alt.createActions(PlaybackActions)
