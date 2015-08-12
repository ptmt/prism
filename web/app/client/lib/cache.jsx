/* @flow */

var Request = require('./request');
var IS_PRODUCTION = false;

class Cache {
  storage: any;

  constructor(storage: any) {
    this.storage = storage;
  }
  get(key: string): any {
    var res = this.storage.getItem(key);
    if (res) {
      return JSON.parse(res);
    } else {
      return false;
    }
  }
  set(key: string, value: string): boolean {
    var json = JSON.stringify(value)
    return this.storage.setItem(key, json);
  }
  setAsync(key: string, cb: Function) {
    var res = this.get(key);
    if (res && IS_PRODUCTION) {
      console.log('from cache');
      return cb(null, res);
    }
    Request.getJson(key, (err, res) => {
      if (!err) {
        this.set(key, res);
        cb(null, res);
      } else {
        cb();
      }
    });
  }
}

module.exports = Cache;
