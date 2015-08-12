/* @flow */

var foursquareClient = new (require('../providers/foursquare/client'))();
var instagramClient = new (require('../providers/instagram/client'))();

// because core.js Error
for(var Error____Key in Error){if(Error.hasOwnProperty(Error____Key)){HttpError[Error____Key]=Error[Error____Key];}}var ____SuperProtoOfError=Error===null?null:Error.prototype;HttpError.prototype=Object.create(____SuperProtoOfError);HttpError.prototype.constructor=HttpError;HttpError.__superConstructor__=Error;function HttpError(){"use strict";if(Error!==null){Error.apply(this,arguments);}}
                     


function AuthController(){"use strict";}

  // trying to create Foursquare login url and redirect to it
  AuthController.foursquare=function(req     , content     , cb)             {"use strict";
    return cb(null, 'end', {
      statusCode: 302,
      headers: {
        'Location': foursquareClient.getFoursquareUrl(),
        'Content-Length': '0'
      }
    })
  };

  // return access code to client
  AuthController.foursquare_callback=function(req     , content     , cb)             {"use strict";
    foursquareClient.auth(req.query.code).then(function(accessToken)  {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?provider=foursquare&setToken=' + accessToken,
          'Content-Length': '0'
        }
      })
    }).catch(function(error)  {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?server_error=' + error,
          'Content-Length': '0'
        }
      })
    });
  };

  AuthController.instagram=function(req     , content     , cb)             {"use strict";
    return cb(null, 'end', {
      statusCode: 302,
      headers: {
        'Location': instagramClient.getInstagramUrl(),
        'Content-Length': '0'
      }
    })
  };

  AuthController.instagram_callback=function(req     , content     , cb)             {"use strict";
    instagramClient.auth(req.query.code).then(function(accessToken)  {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?provider=instagram&setToken=' + accessToken,
          'Content-Length': '0'
        }
      })
    }).catch(function(error)  {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?server_error=' + error,
          'Content-Length': '0'
        }
      })
    });
  };






module.exports = AuthController;
