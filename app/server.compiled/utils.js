'use strict';

module.exports.redirect = function (to) {
  return {
    status: 303,
    headers: {
      'location': to
    },
    body: []
  };
};

module.exports.json = function (data) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: [JSON.stringify(data)]
  };
};
