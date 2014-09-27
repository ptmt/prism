module.exports.redirect = function(to) {
  return {
    status: 303,
    headers: {
      'location': to
    },
    body: []
  };
};
