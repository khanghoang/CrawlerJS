var request = require('request');
var Bluebird = require('bluebird');
var Mustache = require('mustache');

module.exports = function(events) {

  events.hook('fetch', function(e) {
    var promise = Bluebird.pending();
    var instance = e.data.instance;
    var manifest = instance._manifest;
    var config = manifest.target.agent || {};
    config.url = Mustache.render(manifest.target.url, e.data.ranges);

    request(config, function(err, res, data) {
      if(err)
        return promise.reject(err);

      instance._state.set('lastIteration', new Date().getTime());
      e.data.body = data;
      e.data.url = config.url;
      e.data.headers = res.headers;
      e.data.statusCode = res.statusCode;
      promise.resolve();

    });

    return promise.promise;
  }, 999);
};
