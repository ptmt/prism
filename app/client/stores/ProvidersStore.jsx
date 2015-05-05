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
      if (supportsStorage() && window.localStorage['tokens']) {
        tokens = JSON.parse(window.localStorage['tokens']);
        return this.fetchTimeline(tokens);
      }

      if (document.location.href.indexOf('setToken') > -1) {
        var token = getParameterByName('setToken');//document.location.href.split('Token')[1].split('=')[1];
        // if (token.indexOf('#') > -1) {
        //   token = token.split('#')[0];
        // }
        if (!supportsStorage()) {
          alert('Prism needs localStorage support, could you please enable cookie?');
        }
        var tokens = window.localStorage['tokens'] ? JSON.parse(window.localStorage['tokens']) : {};
        tokens[getParameterByName('provider')] = token;
        window.localStorage['tokens'] = JSON.stringify(tokens);

        // then fetch timeline with tokens
        this.fetchTimeline(tokens);
      }

      if (document.location.href.indexOf('server_error') > -1) {
        setTimeout(() => {
          prismActions.error('Error has occured. Please create an issue on github.com/unknownexception/prism');
        }, 1);
      }

    }
  }

  fetchTimeline(tokens) {
    this.isLoading = true;
    this.isNotStarted = false;
    service.fetchTimeline(tokens, (err, data) => {
      this.isLoading = false;
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
