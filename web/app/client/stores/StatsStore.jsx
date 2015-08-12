var alt = require('../alt')
var prismActions = require('../actions')

module.exports = alt.createStore(class StatsStore {
  constructor() {
    this.bindActions(prismActions)
  }

  onPointClicked(data) {
    this.point = data;
  }
});
