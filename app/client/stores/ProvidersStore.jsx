var alt = require('../alt')
//var merge = require('object-assign')
var service = require('../lib/service');
var prismActions = require('../actions')

module.exports = alt.createStore(class ProvidersStore {
  constructor() {
    this.bindActions(prismActions)
    this.isNotStarted = true;
    this.isLoading = false;
  }

  onInit() {
    // if this is demo scenario or user already logged in
    // then call fetchPrismTimeline() action
    if (document.location.href.indexOf('demo') > -1) {
      this.fetchTimeline({});
    } else {
      // do nothing, just welcome screen?
      if (document.location.href.indexOf('foursquareCode') > -1) {
        var code = document.location.href.split('foursquareCode')[1].split('=')[1];
        if (supportsStorage()) {
          window.localStorage['foursquare.code'] = code;
        }
        // then fetch timeline with code
        this.fetchTimeline({foursquare: code});
      }

      if (supportsStorage() && window.localStorage['foursquare.code']) {
        this.fetchTimeline({foursquare: window.localStorage['foursquare.code']});
      }
    }
  }

  fetchTimeline(codes) {
    this.isLoading = true;
    this.isNotStarted = false;
    service.fetchTimeline(codes, (err, data) => {
      this.isLoading = false;
      console.log(err, data);
      if (err || !data) {
        prismActions.error(err ? err : 'Error has occured. Please create an issue on github.com/unknownexception/prism');
      } else {
        prismActions.fetchTimelineCompleted(data);
      }
    });
  }


});

function supportsStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
