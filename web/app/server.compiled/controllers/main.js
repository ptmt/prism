/* @flow */

var providers = require('../providers');
var $__0=    require('../models/timeline'),Timeline=$__0.Timeline;

// TODO: add dependency injection
// like CacheManager or something to make it testable

function Request(){"use strict";}
             
                


// because core.js Error
for(var Error____Key in Error){if(Error.hasOwnProperty(Error____Key)){HttpError[Error____Key]=Error[Error____Key];}}var ____SuperProtoOfError=Error===null?null:Error.prototype;HttpError.prototype=Object.create(____SuperProtoOfError);HttpError.prototype.constructor=HttpError;HttpError.__superConstructor__=Error;function HttpError(){"use strict";if(Error!==null){Error.apply(this,arguments);}}
                     


function MainController(){"use strict";}
  MainController.getTimeline=function(req         , content     , render)             {"use strict";
    // get data from each provider and recalculate timeline
    //console.log('loaded ', providers.length, ' providers');
    //console.log(req.query.tokens, JSON.parse(decodeURIComponent(req.query.tokens)));
    req.timeline = new Timeline(req.query ? JSON.parse(decodeURIComponent(req.query.tokens)) : {}, providers);
    req.timeline.fetch().then(function(result) {
      render(null, result);
    }).catch(function(error)  {
      console.log(error)
      render(error);
    });

  };


module.exports = MainController;
