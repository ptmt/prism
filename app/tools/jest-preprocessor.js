var ReactTools = require('react-tools');
module.exports = {
  process: function(src, file) {
    if (!/\.jsx$/.test(file) && !/\.react\.js$/.test(file)) return src;
    return ReactTools.transform(src,
      {
        harmony: true,
        stripTypes: true
      });
  }
};
