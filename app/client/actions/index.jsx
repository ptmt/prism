var alt = require('../alt')

class PrismActions {
  constructor() {
    this.generateActions(
      'init',
      'welcome',
      'error',
      'fetchTimelineStart',
      'fetchTimelineCompleted'
    )
  }
}

module.exports = alt.createActions(PrismActions)
