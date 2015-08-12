// /* @flow */
// type Callback <T> = (err: ?string, data? : T) => void;
//
// class Request<T> {
//   static getJson<T>(url: string, callback: Callback<T>) {
//     var request = new XMLHttpRequest();
//     request.open('GET', url, true);
//
//     request.onload = function() {
//       if (request.status === 200) {
//         var json = JSON.parse(request.responseText);
//         if (json.error) {
//           return callback(json.error);
//         }
//         callback(null, json);
//       } else {
//         // We reached our target server, but it returned an error
//         callback('error:' + request.responseText);
//       }
//     };
//
//     request.onerror = function() {
//       // There was a connection error of some sort
//       callback('error');
//     };
//
//     request.send();
//   }
// }
//
//
// module.exports = Request;

/* @flow */
type Callback <T> = (err: ?string, data? : T) => void;

module.exports.getJson = function<T>(url: string, callback: Callback<T>) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        var json = JSON.parse(request.responseText);
        if (json.error) {
          return callback(json.error);
        }
        callback(null, json);
      } else {
        // We reached our target server, but it returned an error
        callback('error:' + request.responseText);
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      callback('error');
    };

    request.send();
}
